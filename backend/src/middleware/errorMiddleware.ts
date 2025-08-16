import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
    error.statusCode = 404;
    next(error);
};

export const errorHandler = (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Mongoose duplicate key
    if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        statusCode = 400;
        const field = Object.keys((error as any).keyValue)[0];
        message = `Duplicate field value: ${field}`;
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values((error as any).errors).map((val: any) => val.message);
        message = `Validation Error: ${errors.join(', ')}`;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    console.error('Error:', {
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

export const asyncHandler = (fn: Function) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};