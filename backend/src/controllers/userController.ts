import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Document from '../models/Document';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { address } = req.params;

        const user = await User.findOne({ address }).populate('documents');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if profile is public or if it's the user's own profile
        const isOwnProfile = req.user?.address === address;
        if (!user.preferences.publicProfile && !isOwnProfile) {
            res.status(403).json({ error: 'Profile is private' });
            return;
        }

        const documentCount = await Document.countDocuments({ authorAddress: address });

        res.json({
            success: true,
            data: {
                address: user.address,
                username: user.username,
                bio: user.bio,
                avatar: user.avatar,
                documentCount,
                joinedAt: user.joinedAt,
                isVerified: user.isVerified,
                lastActive: isOwnProfile ? user.lastActive : undefined,
                preferences: isOwnProfile ? user.preferences : undefined,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const { username, bio, preferences } = req.body;

        const updateData: any = {};
        if (username !== undefined) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: {
                address: updatedUser?.address,
                username: updatedUser?.username,
                bio: updatedUser?.bio,
                avatar: updatedUser?.avatar,
                joinedAt: updatedUser?.joinedAt,
                isVerified: updatedUser?.isVerified,
                preferences: updatedUser?.preferences,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getUserDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { address } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const user = await User.findOne({ address });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if it's the user's own profile or if profile is public
        const isOwnProfile = req.user?.address === address;
        if (!user.preferences.publicProfile && !isOwnProfile) {
            res.status(403).json({ error: 'Profile is private' });
            return;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const documents = await Document.find({ authorAddress: address })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const total = await Document.countDocuments({ authorAddress: address });

        // Format response data (hide sensitive info for non-owners)
        const formattedDocuments = documents.map(doc => ({
            id: doc._id,
            title: doc.title,
            description: doc.description,
            category: doc.category,
            tags: doc.tags,
            isEncrypted: doc.isEncrypted,
            isAnonymous: doc.isAnonymous,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            viewCount: doc.viewCount,
            likes: doc.likes,
            downloads: doc.downloads,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            ordinalsId: doc.ordinalsId,
            isInscribed: doc.isInscribed,
            inscriptionStatus: doc.inscriptionStatus,
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
        console.error('Get user documents error:', error);
        res.status(500).json({ error: 'Failed to fetch user documents' });
    }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { address } = req.params;

        const user = await User.findOne({ address });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const isOwnProfile = req.user?.address === address;
        if (!user.preferences.publicProfile && !isOwnProfile) {
            res.status(403).json({ error: 'Profile is private' });
            return;
        }

        // Aggregate user statistics
        const stats = await Document.aggregate([
            { $match: { authorAddress: address } },
            {
                $group: {
                    _id: null,
                    totalDocuments: { $sum: 1 },
                    totalViews: { $sum: '$viewCount' },
                    totalLikes: { $sum: '$likes' },
                    totalDownloads: { $sum: '$downloads' },
                    inscribedDocuments: {
                        $sum: { $cond: [{ $eq: ['$isInscribed', true] }, 1, 0] }
                    },
                },
            },
        ]);

        const userStats = stats[0] || {
            totalDocuments: 0,
            totalViews: 0,
            totalLikes: 0,
            totalDownloads: 0,
            inscribedDocuments: 0,
        };

        res.json({
            success: true,
            data: userStats,
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
};