import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
  
    const mongoUri = process.env.MONGODB_URI;
    let mongoHealthy = false;
    let mongoStats = {};

    if (mongoUri) {
      try {
        const client = new MongoClient(mongoUri);
        await client.connect();

        const db = client.db();
        await db.admin().ping();

        // Get some basic database stats
        const dbStats = await db.stats();
        const usersCount = await db.collection("users").countDocuments();

        mongoStats = {
          collections: dbStats.collections || 0,
          dataSize: dbStats.dataSize || 0,
          indexSize: dbStats.indexSize || 0,
          usersCount,
        };

        mongoHealthy = true;
        await client.close();
      } catch (mongoError) {
        console.error("MongoDB health check failed:", mongoError);
        mongoHealthy = false;
      }
    }
    // framing the health status response
    const healthStatus = {
      status: mongoHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        mongodb: {
          status: mongoHealthy ? "healthy" : "unhealthy",
          connected: mongoHealthy,
          stats: mongoStats,
        },
        api: {
          status: "healthy",
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        arch: process.arch,
      },
    };

    const statusCode = mongoHealthy ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
