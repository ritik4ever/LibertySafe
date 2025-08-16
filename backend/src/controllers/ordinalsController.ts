import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/authMiddleware';
import { inscribeToOrdinals, getInscriptionStatus as getStatus } from '../services/ordinalsService';
import { generateOOMDMetadata } from '../services/metadataService';
import Document from '../models/Document';

export const createMetadata = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const metadata = generateOOMDMetadata(req.body);

        res.json({
            success: true,
            data: metadata,
        });
    } catch (error) {
        console.error('Create metadata error:', error);
        res.status(500).json({ error: 'Failed to create metadata' });
    }
};

export const getMetadata = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { inscriptionId } = req.params;

        // In a real implementation, you would fetch this from the Bitcoin blockchain
        // For now, we'll return a placeholder
        res.json({
            success: true,
            data: {
                inscriptionId,
                metadata: 'Metadata would be fetched from Bitcoin blockchain',
            },
        });
    } catch (error) {
        console.error('Get metadata error:', error);
        res.status(500).json({ error: 'Failed to fetch metadata' });
    }
};

export const inscribeDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { documentId, metadata } = req.body;

        // Verify document ownership
        const document = await Document.findById(documentId);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        if (document.authorAddress !== req.user?.address) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        // Inscribe to Bitcoin
        const inscriptionId = await inscribeToOrdinals(documentId, metadata);

        res.json({
            success: true,
            data: { inscriptionId },
        });
    } catch (error) {
        console.error('Inscribe document error:', error);
        res.status(500).json({ error: 'Failed to inscribe document' });
    }
};

export const getInscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { inscriptionId } = req.params;

        const status = await getStatus(inscriptionId);

        res.json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.error('Get inscription status error:', error);
        res.status(500).json({ error: 'Failed to get inscription status' });
    }
};