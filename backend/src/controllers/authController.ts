import { Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bitcoin from 'bitcoinjs-lib';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const authenticateWallet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { address, signature, message } = req.body;

        // Verify the signature matches the address and message
        // In production, implement proper Bitcoin signature verification
        const isValidSignature = verifyBitcoinSignature(address, message, signature);

        if (!isValidSignature) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }

        // Find or create user
        let user = await User.findOne({ address });

        if (!user) {
            user = new User({
                address,
                joinedAt: new Date(),
                lastActive: new Date(),
            });
            await user.save();
        } else {
            user.lastActive = new Date();
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { address: user.address },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                address: user.address,
                username: user.username,
                bio: user.bio,
                joinedAt: user.joinedAt,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const verifyToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        res.json({
            success: true,
            user: {
                address: req.user.address,
                username: req.user.username,
                bio: req.user.bio,
                joinedAt: req.user.joinedAt,
                isVerified: req.user.isVerified,
            },
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Token verification failed' });
    }
};

// Helper function to verify Bitcoin signature
function verifyBitcoinSignature(address: string, message: string, signature: string): boolean {
    try {
        // This is a simplified implementation
        // In production, use proper Bitcoin message verification libraries

        // Expected message format for wallet authentication
        const expectedMessage = `LibertySafe Authentication\n\nSign this message to authenticate with LibertySafe.\n\nTimestamp: ${message}`;

        // For demo purposes, we'll accept any non-empty signature
        // In production, implement proper cryptographic verification
        return signature.length > 0 && address.length > 0;

    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}