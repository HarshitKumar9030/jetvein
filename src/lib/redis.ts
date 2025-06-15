import Redis from 'ioredis';

// Redis configuration
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  
  throw new Error('REDIS_URL environment variable is not set');
};

// Create Redis instance with configuration
const createRedisInstance = () => {
  try {
    const redisUrl = getRedisUrl();
    
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    redis.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

    return redis;
  } catch (error) {
    console.error('Failed to create Redis instance:', error);
    throw error;
  }
};

// Global Redis instance
let redis: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redis) {
    redis = createRedisInstance();
  }
  return redis;
};

// Graceful shutdown
export const closeRedisConnection = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('Redis connection closed');
  }
};

// Health check function
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

export default getRedisClient;
