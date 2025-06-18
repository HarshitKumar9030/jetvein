import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

function validateSignupData(body: unknown): string[] {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    errors.push("Invalid request body");
    return errors;
  }

  const data = body as Record<string, unknown>;

  // just a simple validation for required fields
  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required");
  } else if (data.name.trim().length === 0) {
    errors.push("Name cannot be empty");
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email address");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required");
  } else {
    if (data.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (data.password.length > 128) {
      errors.push("Password must be less than 128 characters");
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push("Password must contain at least one number");
    }
  }

  return errors;
}

// User interface 

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  emailVerified: Date | null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not set");
      return NextResponse.json(
        {
          error: "Database configuration error",
          code: "CONFIG_ERROR",
        },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    const validationErrors = validateSignupData(body); // now this simplifies the validation logic, since we can get any validation errors in a single array
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: validationErrors[0],
          code: "VALIDATION_ERROR",
          details: validationErrors,
        },
        { status: 400 }
      );
    }
    const { name, email, password } = body as {
      name: string;
      email: string;
      password: string;
    };
    const normalizedEmail = email.toLowerCase().trim(); // normalize email to lowercase and trim whitespace
    const trimmedName = name.trim();

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection<User>("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists",
          code: "USER_EXISTS",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // saltfactor: 12

    // Create user object
    const newUser: User = {
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
        emailVerified: null,
        createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    if (!result.insertedId) {
      throw new Error("Failed to create user");
    }

    console.log(`New user created: ${result.insertedId} (${normalizedEmail})`);

    // Return success response (without password)
    const userResponse = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  } finally {
    // closing
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}

// Optional: GET method to check if email is available
export async function GET(request: NextRequest) {
  let client: MongoClient | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if email exists
    const existingUser = await usersCollection.findOne({
      email: email,
    });

    return NextResponse.json({
      available: !existingUser,
      email,
    });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Failed to check email availability" },
      { status: 500 }
    );
  } finally {
    // Always close the database connection
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}
