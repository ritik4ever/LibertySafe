import { Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import path from 'path';
import Document from '../models/Document';
import User from '../models/User';
import Like from '../models/Like';
import { AuthRequest } from '../middleware/authMiddleware';
import { encryptFile, decryptFile } from '../services/encryptionService';
import { uploadToIPFS } from '../services/ipfsService';
import { inscribeToOrdinals } from '../services/ordinalsService';
import { generateOOMDMetadata } from '../services/metadataService';

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, sortBy = 'recent', tags, author, page = 1, limit = 20 } = req.query;

        // Build filter query
        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        if (tags) {
            const tagArray = (tags as string).split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }

        if (author) {
            filter.authorAddress = author;
        }

        // Build sort query
        let sort: any = {};
        switch (sortBy) {
            case 'popular':
                sort = { likes: -1, viewCount: -1 };
                break;
            case 'alphabetical':
                sort = { title: 1 };
                break;
            case 'recent':
            default:
                sort = { createdAt: -1 };
                break;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const documents = await Document.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .populate('author', 'username address isVerified')
            .lean();

        const total = await Document.countDocuments(filter);

        // Format response data
        const formattedDocuments = documents.map(doc => ({
            id: doc._id,
            title: doc.title,
            description: doc.description,
            author: doc.isAnonymous ? 'Anonymous' : (doc.author as any)?.username || 'Unknown',
            authorAddress: doc.isAnonymous ? '' : doc.authorAddress,
            category: doc.category,
            tags: doc.tags,
            isEncrypted: doc.isEncrypted,
            isAnonymous: doc.isAnonymous,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            viewCount: doc.viewCount,
            likes: doc.likes,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            ordinalsId: doc.ordinalsId,
        }));

        res.json({
            success: true,
            data: formattedDocuments,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const getDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id)
            .populate('author', 'username address isVerified')
            .lean();

        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        // Increment view count
        await Document.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

        // Check if user has liked this document
        let hasLiked = false;
        if (req.user) {
            const like = await Like.findOne({
                user: req.user._id,
                document: id,
            });
            hasLiked = !!like;
        }

        const formattedDocument = {
            id: document._id,
            title: document.title,
            description: document.description,
            content: document.content,
            author: document.isAnonymous ? 'Anonymous' : (document.author as any)?.username || 'Unknown',
            authorAddress: document.isAnonymous ? '' : document.authorAddress,
            category: document.category,
            tags: document.tags,
            isEncrypted: document.isEncrypted,
            isAnonymous: document.isAnonymous,
            fileName: document.fileName,
            fileSize: document.fileSize,
            mimeType: document.mimeType,
            viewCount: document.viewCount + 1, // Include the increment
            likes: document.likes,
            downloads: document.downloads,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            ordinalsId: document.ordinalsId,
            ipfsHash: document.ipfsHash,
            isInscribed: document.isInscribed,
            inscriptionStatus: document.inscriptionStatus,
            hasLiked,
        };

        res.json({
            success: true,
            data: formattedDocument,
        });
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const {
            title,
            description = '',
            category,
            tags = '',
            isEncrypted = 'true',
            isAnonymous = 'false',
        } = req.body;

        const file = req.file;
        const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

        // Check for duplicate files
        const existingDoc = await Document.findOne({ fileHash });
        if (existingDoc) {
            res.status(409).json({ error: 'Document with this content already exists' });
            return;
        }

        let encryptedBuffer = file.buffer;
        let encryptionKey = '';
        let encryptionIv = '';

        // Encrypt file if requested
        if (isEncrypted === 'true') {
            const encrypted = encryptFile(file.buffer);
            encryptedBuffer = encrypted.encryptedData;
            encryptionKey = encrypted.key;
            encryptionIv = encrypted.iv;
        }

        // Upload to IPFS
        const ipfsHash = await uploadToIPFS(encryptedBuffer, file.originalname);

        // Create document record
        const document = new Document({
            title,
            description,
            author: req.user._id,
            authorAddress: req.user.address,
            category,
            tags: tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
            isEncrypted: isEncrypted === 'true',
            isAnonymous: isAnonymous === 'true',
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            fileHash,
            ipfsHash,
            encryptionKey,
            encryptionIv,
        });

        await document.save();

        // Add document to user's documents
        await User.findByIdAndUpdate(req.user._id, {
            $push: { documents: document._id },
        });

        // Generate OOMD metadata
        const metadata = generateOOMDMetadata(document);

        // Inscribe to Bitcoin Ordinals (async)
        inscribeToOrdinals(document._id.toString(), metadata)
            .then(inscriptionId => {
                // Update document with inscription ID
                Document.findByIdAndUpdate(document._id, {
                    ordinalsId: inscriptionId,
                    isInscribed: true,
                    inscriptionStatus: 'confirmed',
                }).exec();
            })
            .catch(error => {
                console.error('Ordinals inscription failed:', error);
                Document.findByIdAndUpdate(document._id, {
                    inscriptionStatus: 'failed',
                }).exec();
            });

        res.status(201).json({
            success: true,
            data: {
                id: document._id,
                title: document.title,
                description: document.description,
                category: document.category,
                tags: document.tags,
                isEncrypted: document.isEncrypted,
                isAnonymous: document.isAnonymous,
                fileSize: document.fileSize,
                mimeType: document.mimeType,
                ipfsHash: document.ipfsHash,
                createdAt: document.createdAt,
            },
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
};

export const updateDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { id } = req.params;
        const { title, description, category, tags } = req.body;

        const document = await Document.findById(id);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        // Check ownership
        if (document.authorAddress !== req.user?.address) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        // Update document
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category) updateData.category = category;
        if (tags !== undefined) {
            updateData.tags = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
        }

        const updatedDocument = await Document.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedDocument,
        });
    } catch (error) {
        console.error('Update document error:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        // Check ownership
        if (document.authorAddress !== req.user?.address) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        // Remove document from user's documents array
        await User.findByIdAndUpdate(req.user?._id, {
            $pull: { documents: id },
        });

        // Delete all likes for this document
        await Like.deleteMany({ document: id });

        // Delete the document
        await Document.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Document deleted successfully',
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

export const likeDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const document = await Document.findById(id);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        // Check if already liked
        const existingLike = await Like.findOne({
            user: req.user._id,
            document: id,
        });

        if (existingLike) {
            // Unlike
            await Like.findByIdAndDelete(existingLike._id);
            await Document.findByIdAndUpdate(id, { $inc: { likes: -1 } });

            const updatedDocument = await Document.findById(id);
            res.json({
                success: true,
                liked: false,
                likes: updatedDocument?.likes || 0,
            });
        } else {
            // Like
            const like = new Like({
                user: req.user._id,
                userAddress: req.user.address,
                document: id,
            });
            await like.save();

            await Document.findByIdAndUpdate(id, { $inc: { likes: 1 } });

            const updatedDocument = await Document.findById(id);
            res.json({
                success: true,
                liked: true,
                likes: updatedDocument?.likes || 0,
            });
        }
    } catch (error) {
        console.error('Like document error:', error);
        res.status(500).json({ error: 'Failed to update like status' });
    }
};

export const getDocumentStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.json({
            success: true,
            data: {
                views: document.viewCount,
                likes: document.likes,
                downloads: document.downloads,
                shares: 0, // Could be tracked separately
            },
        });
    } catch (error) {
        console.error('Get document stats error:', error);
        res.status(500).json({ error: 'Failed to fetch document statistics' });
    }
};