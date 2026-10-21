import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/config/connectDb";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get("username")?.trim() || "";

    if (!rawUsername) {
      return NextResponse.json(
        { available: false, message: "Username cannot be empty." },
        { status: 400 }
      );
    }

    if (rawUsername.length < 3) {
      return NextResponse.json(
        { available: false, message: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (rawUsername.length > 20) {
      return NextResponse.json(
        { available: false, message: "Username must not exceed 20 characters." },
        { status: 400 }
      );
    }

    // Only allow alphanumeric and underscores
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(rawUsername)) {
      return NextResponse.json(
        { available: false, message: "Username can only contain letters, numbers, and underscores (_)." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDb();

    // Case-insensitive query to prevent duplicates like 'Aswin' and 'aswin'
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${rawUsername}$`, "i") },
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          available: false,
          message: `@${rawUsername} is already taken. Try another name.`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        available: true,
        message: `@${rawUsername} is available!`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      {
        available: false,
        message: "Failed to verify username availability. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUsername = (body.username || "").trim();

    const url = new URL(req.url);
    url.searchParams.set("username", rawUsername);
    return GET(new NextRequest(url));
  } catch (err: any) {
    return NextResponse.json(
      { available: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
