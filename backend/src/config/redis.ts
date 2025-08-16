import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                connectTimeout: 5000,
                // Removed lazyConnect as it's not valid in newer Redis client versions
            },
        });

        redisClient.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        redisClient.on('connect', () => {
            console.log('⚡ Redis connected successfully');
        });

        redisClient.on('disconnect', () => {
            console.warn('⚡ Redis disconnected');
        });

        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
};

export const getRedisClient = (): RedisClientType => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
    try {
        if (redisClient) {
            await redisClient.disconnect();
            console.log('⚡ Redis disconnected');
        }
    } catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
};