import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDb } from "@/config/connectDb";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();
    const user = await User.findOne({ email: session.user.email.toLowerCase() }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: (user as any)._id?.toString(),
        name: user.name || session.user.name || "",
        username: user.username,
        email: user.email,
        avatar: user.avatar || session.user.image || "",
        bio: user.bio || "",
        location: user.location || "",
        createdAt: user.createdAt || user.createadAt || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, bio, location } = body;

    await connectDb();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email.toLowerCase() },
      {
        $set: {
          ...(typeof name === "string" ? { name: name.trim() } : {}),
          ...(typeof bio === "string" ? { bio: bio.trim() } : {}),
          ...(typeof location === "string" ? { location: location.trim() } : {}),
          updatedAt: new Date(),
        },
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (updatedUser as any)._id?.toString(),
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        createdAt: updatedUser.createdAt || updatedUser.createadAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
