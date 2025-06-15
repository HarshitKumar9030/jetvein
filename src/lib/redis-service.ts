import { getRedisClient } from './redis';
import type { Redis } from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix
}

export interface FlightData {
  flightNumber: string;
  aircraft: {
    registration: string;
    model: string;
    age: number;
    image?: string;
  };
  airline: string;
  route?: {
    from: string;
    to: string;
  };
  status: string;
  timestamp: number;
}

export interface AircraftHistory {
  registration: string;
  flights: Array<{
    date: string;
    flightNumber: string;
    from: string;
    to: string;
    duration: string;
    airline: string;
  }>;
}

export class RedisService {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour default TTL
  private keyPrefix = 'jetvein:';

  constructor() {
    this.redis = getRedisClient();
  }

  // Generate cache key with prefix
  private getKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || this.keyPrefix;
    return `${keyPrefix}${key}`;
  }
  // Basic cache operations
  async set(key: string, value: unknown, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options?.prefix);
      const serializedValue = JSON.stringify(value);
      const ttl = options?.ttl || this.defaultTTL;
      
      await this.redis.setex(cacheKey, ttl, serializedValue);
    } catch (error) {
      console.error('Redis SET error:', error);
      throw new Error('Failed to cache data');
    }
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const cacheKey = this.getKey(key, options?.prefix);
      const value = await this.redis.get(cacheKey);
      
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key: string, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options?.prefix);
      await this.redis.del(cacheKey);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw new Error('Failed to delete cache data');
    }
  }

  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key, options?.prefix);
      const result = await this.redis.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // Flight-specific operations
  async cacheFlightData(flightNumber: string, data: FlightData): Promise<void> {
    const key = `flight:${flightNumber.toUpperCase()}`;
    await this.set(key, data, { ttl: 1800 }); // 30 minutes for flight data
  }

  async getFlightData(flightNumber: string): Promise<FlightData | null> {
    const key = `flight:${flightNumber.toUpperCase()}`;
    return await this.get<FlightData>(key);
  }

  async cacheAircraftHistory(registration: string, history: AircraftHistory): Promise<void> {
    const key = `aircraft:${registration.toUpperCase()}`;
    await this.set(key, history, { ttl: 7200 }); // 2 hours for aircraft history
  }

  async getAircraftHistory(registration: string): Promise<AircraftHistory | null> {
    const key = `aircraft:${registration.toUpperCase()}`;
    return await this.get<AircraftHistory>(key);
  }

  // Search history operations
  async addSearchHistory(userId: string, searchTerm: string): Promise<void> {
    try {
      const key = `search_history:${userId}`;
      const timestamp = Date.now();
      const searchEntry = JSON.stringify({ term: searchTerm, timestamp });
      
      // Add to list (LPUSH for newest first)
      await this.redis.lpush(this.getKey(key), searchEntry);
      
      // Trim to keep only last 20 searches
      await this.redis.ltrim(this.getKey(key), 0, 19);
      
      // Set expiry for search history (30 days)
      await this.redis.expire(this.getKey(key), 2592000);
    } catch (error) {
      console.error('Redis search history error:', error);
    }
  }

  async getSearchHistory(userId: string, limit: number = 10): Promise<Array<{term: string, timestamp: number}>> {
    try {
      const key = `search_history:${userId}`;
      const history = await this.redis.lrange(this.getKey(key), 0, limit - 1);
      
      return history.map(entry => JSON.parse(entry));
    } catch (error) {
      console.error('Redis get search history error:', error);
      return [];
    }
  }

  // Rate limiting operations
  async checkRateLimit(identifier: string, limit: number = 100, window: number = 3600): Promise<{allowed: boolean, remaining: number}> {
    try {
      const key = `rate_limit:${identifier}`;
      const cacheKey = this.getKey(key);
      
      const current = await this.redis.get(cacheKey);
      
      if (!current) {
        // First request in window
        await this.redis.setex(cacheKey, window, '1');
        return { allowed: true, remaining: limit - 1 };
      }
      
      const count = parseInt(current);
      
      if (count >= limit) {
        return { allowed: false, remaining: 0 };
      }
      
      // Increment counter
      await this.redis.incr(cacheKey);
      return { allowed: true, remaining: limit - count - 1 };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Allow request if Redis fails
      return { allowed: true, remaining: limit - 1 };
    }
  }
  // Session management
  async createSession(sessionId: string, userData: Record<string, unknown>, ttl: number = 86400): Promise<void> {
    const key = `session:${sessionId}`;
    await this.set(key, userData, { ttl });
  }

  async getSession(sessionId: string): Promise<Record<string, unknown> | null> {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.del(key);
  }

  // Analytics operations
  async incrementCounter(key: string, increment: number = 1): Promise<number> {
    try {
      const cacheKey = this.getKey(`counter:${key}`);
      return await this.redis.incrby(cacheKey, increment);
    } catch (error) {
      console.error('Redis increment error:', error);
      return 0;
    }
  }

  async getCounter(key: string): Promise<number> {
    try {
      const cacheKey = this.getKey(`counter:${key}`);
      const value = await this.redis.get(cacheKey);
      return value ? parseInt(value) : 0;
    } catch (error) {
      console.error('Redis get counter error:', error);
      return 0;
    }
  }
  // Bulk operations
  async mget(keys: string[], prefix?: string): Promise<(unknown | null)[]> {
    try {
      const cacheKeys = keys.map(key => this.getKey(key, prefix));
      const values = await this.redis.mget(...cacheKeys);
      
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Redis MGET error:', error);
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Array<{key: string, value: unknown, ttl?: number}>, prefix?: string): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      
      keyValuePairs.forEach(({ key, value, ttl }) => {
        const cacheKey = this.getKey(key, prefix);
        const serializedValue = JSON.stringify(value);
        
        if (ttl) {
          pipeline.setex(cacheKey, ttl, serializedValue);
        } else {
          pipeline.set(cacheKey, serializedValue);
        }
      });
      
      await pipeline.exec();
    } catch (error) {
      console.error('Redis MSET error:', error);
      throw new Error('Failed to set multiple cache entries');
    }
  }

  // Clear all cache with pattern
  async clearPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(this.getKey(pattern));
      if (keys.length === 0) return 0;
      
      return await this.redis.del(...keys);
    } catch (error) {
      console.error('Redis clear pattern error:', error);
      return 0;
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis ping error:', error);
      return false;
    }
  }
}

// Singleton instance
let redisService: RedisService | null = null;

export const getRedisService = (): RedisService => {
  if (!redisService) {
    redisService = new RedisService();
  }
  return redisService;
};

export default RedisService;
