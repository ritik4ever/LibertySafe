import express from 'express';
import { body } from 'express-validator';
import { authenticateWallet, verifyToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';

const router = express.Router();

// Authenticate with wallet signature
router.post('/wallet', [
    body('address').isString().notEmpty().withMessage('Address is required'),
    body('signature').isString().notEmpty().withMessage('Signature is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
], asyncHandler(authenticateWallet));

// Verify token
router.get('/verify', authMiddleware, asyncHandler(verifyToken));

export default router;