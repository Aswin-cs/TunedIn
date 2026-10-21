import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/config/connectDb";
import { Song, ISong } from "@/models/song.model";


export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: { $regex: searchRegex } },
        { album: { $regex: searchRegex } },
        { artist: { $regex: searchRegex } },
      ];
    }

    if (genre && genre !== "All" && genre.trim() !== "") {
      filter.genre = { $in: [new RegExp(genre.trim(), "i")] };
    }

    const songs = await Song.find(filter)
      .populate("uploadUser", "name username email avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    console.error("Error fetching songs from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch songs from database",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
