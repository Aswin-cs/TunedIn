import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/config/connectDb";
import { Song } from "@/models/song.model";
import mongoose from "mongoose";


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Song ID is required" },
        { status: 400 }
      );
    }

    let song = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      song = await Song.findById(id)
        .populate("uploadUser", "name username email avatar")
        .lean();
    }

    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      song,
    });
  } catch (error) {
    console.error("Error fetching song by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch song",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
