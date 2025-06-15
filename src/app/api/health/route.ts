import { NextResponse } from 'next/server';
import { checkRedisHealth } from '@/lib/redis';
import { getRedisService } from '@/lib/redis-service';

const redisService = getRedisService();

export async function GET() {
  try {
    // Check Redis health
    const redisHealthy = await checkRedisHealth();
    
    // Get some basic stats
    const [cacheHits, apiCalls] = await Promise.all([
      redisService.getCounter('cache_hits'),
      redisService.getCounter('api_calls')
    ]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        redis: {
          status: redisHealthy ? 'healthy' : 'unhealthy',
          connected: redisHealthy
        },
        api: {
          status: 'healthy'
        }
      },
      stats: {
        cache_hits: cacheHits,
        api_calls: apiCalls,
        cache_hit_ratio: apiCalls > 0 ? (cacheHits / (cacheHits + apiCalls) * 100).toFixed(2) + '%' : '0%'
      }
    };
    
    const statusCode = redisHealthy ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 503 }
    );
  }
}
