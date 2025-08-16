import express from 'express';
import { body, param } from 'express-validator';
import {
    createMetadata,
    getMetadata,
    inscribeDocument,
    getInscriptionStatus,
} from '../controllers/ordinalsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';

const router = express.Router();

// Create ordinal metadata
router.post('/metadata', authMiddleware, [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('category').isString().notEmpty().withMessage('Category is required'),
    body('tags').isArray().withMessage('Tags must be an array'),
    body('encrypted').isBoolean().withMessage('Encrypted must be a boolean'),
    body('fileHash').isString().notEmpty().withMessage('File hash is required'),
], asyncHandler(createMetadata));

// Get ordinal metadata
router.get('/metadata/:inscriptionId', [
    param('inscriptionId').isString().notEmpty().withMessage('Inscription ID is required'),
], asyncHandler(getMetadata));

// Inscribe document to Bitcoin
router.post('/inscribe', authMiddleware, [
    body('documentId').isString().notEmpty().withMessage('Document ID is required'),
    body('metadata').isObject().withMessage('Metadata is required'),
], asyncHandler(inscribeDocument));

// Get inscription status
router.get('/status/:inscriptionId', [
    param('inscriptionId').isString().notEmpty().withMessage('Inscription ID is required'),
], asyncHandler(getInscriptionStatus));

export default router;