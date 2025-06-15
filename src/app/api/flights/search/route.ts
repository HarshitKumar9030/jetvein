import { NextRequest, NextResponse } from 'next/server';
import { getRedisService } from '@/lib/redis-service';
import type { FlightData } from '@/lib/redis-service';

const redisService = getRedisService();

// Mock function to simulate external API call
async function fetchFlightDataFromExternalAPI(flightNumber: string): Promise<FlightData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - replace with actual API call
  const mockData: FlightData = {
    flightNumber: flightNumber.toUpperCase(),    aircraft: {
      registration: 'VT-ANJ',
      model: 'Airbus A320neo',
      age: 3.5,
      image: undefined
    },
    airline: 'Air India',
    route: {
      from: 'DEL',
      to: 'BOM'
    },
    status: 'In Flight',
    timestamp: Date.now()
  };
  
  return mockData;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get('flight');
    
    if (!flightNumber) {
      return NextResponse.json(
        { error: 'Flight number is required' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = await redisService.checkRateLimit(`api:${clientIP}`, 100, 3600);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString()
          }
        }
      );
    }

    // Check cache first
    let flightData = await redisService.getFlightData(flightNumber);
    
    if (flightData) {
      // Increment cache hit counter
      await redisService.incrementCounter('cache_hits');
      
      return NextResponse.json({
        data: flightData,
        cached: true,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Cache': 'HIT',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      });
    }

    // Cache miss - fetch from external API
    flightData = await fetchFlightDataFromExternalAPI(flightNumber);
    
    if (!flightData) {
      return NextResponse.json(
        { error: 'Flight not found' },
        { status: 404 }
      );
    }

    // Cache the result
    await redisService.cacheFlightData(flightNumber, flightData);
    
    // Increment API call counter
    await redisService.incrementCounter('api_calls');
    
    return NextResponse.json({
      data: flightData,
      cached: false,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'X-Cache': 'MISS',
        'X-RateLimit-Remaining': rateLimit.remaining.toString()
      }
    });
    
  } catch (error) {
    console.error('Flight search API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flightNumber, userId } = body;
    
    if (!flightNumber) {
      return NextResponse.json(
        { error: 'Flight number is required' },
        { status: 400 }
      );
    }

    // Add to search history if user is authenticated
    if (userId) {
      await redisService.addSearchHistory(userId, flightNumber);
    }

    // Redirect to GET method
    const url = new URL(request.url);
    url.searchParams.set('flight', flightNumber);
    
    return NextResponse.redirect(url, 307);
    
  } catch (error) {
    console.error('Flight search POST error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
