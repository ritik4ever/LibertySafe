const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

// Basic middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
    });
});

// API routes
app.get('/api/test', (req, res) => {
    res.json({
        message: 'LibertySafe API is running!',
        version: '1.0.0',
        features: [
            'Document storage',
            'Bitcoin Ordinals integration',
            'End-to-end encryption',
            'IPFS storage',
            'User authentication'
        ]
    });
});

// Basic document endpoint
app.get('/api/documents', (req, res) => {
    res.json({
        documents: [],
        message: 'Document service ready',
        count: 0
    });
});

// User endpoint
app.get('/api/users/:address', (req, res) => {
    const { address } = req.params;
    res.json({
        address,
        message: 'User service ready',
        exists: false
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Database connections (simplified for now)
const connectDatabases = async () => {
    try {
        console.log('🔄 Database connections will be implemented...');
        console.log('✅ Database setup complete (mocked for now)');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDatabases();

        app.listen(PORT, () => {
            console.log(`
🚀 LibertySafe Backend Server Started!

📡 Server: http://localhost:${PORT}
🔍 Health: http://localhost:${PORT}/health
📋 API:    http://localhost:${PORT}/api/test
🌐 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started: ${new Date().toISOString()}

🛡️ LibertySafe - Freedom of Information, Protected Forever
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the application
startServer();