import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRedisService } from '@/lib/redis-service';

const redisService = getRedisService();

// GET - Retrieve user's search history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Use email as user identifier
    const userId = session.user.email;
    
    const searchHistory = await redisService.getSearchHistory(userId, limit);
    
    return NextResponse.json({
      history: searchHistory,
      total: searchHistory.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Search history GET error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add to search history
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchTerm } = body;
    
    if (!searchTerm || typeof searchTerm !== 'string') {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Use email as user identifier
    const userId = session.user.email;
    
    await redisService.addSearchHistory(userId, searchTerm.trim());
    
    return NextResponse.json({
      success: true,
      message: 'Search term added to history',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Search history POST error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Clear search history
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use email as user identifier
    const userId = session.user.email;
    const key = `search_history:${userId}`;
    
    await redisService.del(key);
    
    return NextResponse.json({
      success: true,
      message: 'Search history cleared',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Search history DELETE error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
