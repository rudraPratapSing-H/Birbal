


import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { NextResponse } from "next/server";
import { withCORS } from "../cors";


// GET: fetch note for a specific chunk
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const book_name = searchParams.get("book_name");
  const chapter_num = searchParams.get("chapter_num");
  const chunk_index = searchParams.get("chunk_index");

  if (!book_name || !chapter_num || chunk_index === null) {
    return withCORS(NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 }));
  }

  await dbConnect();
  const chapter = await Chapter.findOne({ book_name, chapter_num });
  if (!chapter) {
    return withCORS(NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 }));
  }

  const idx = Number(chunk_index);
  if (!Array.isArray(chapter.audio_script) || idx < 0 || idx >= chapter.audio_script.length) {
    return withCORS(NextResponse.json({ success: false, error: "Chunk not found" }, { status: 404 }));
  }

  const chunk = chapter.audio_script[idx];
  return withCORS(NextResponse.json({ success: true, note: chunk.note ?? "", chunk }));
}

// POST: save note for a specific chunk
export async function POST(req) {
  const { book_name, chapter_num, chunk_index, note } = await req.json();
  if (!book_name || !chapter_num || chunk_index === undefined || note === undefined) {
    return withCORS(NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 }));
  }

  await dbConnect();
  const chapter = await Chapter.findOne({ book_name, chapter_num });
  if (!chapter) {
    return withCORS(NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 }));
  }

  const idx = Number(chunk_index);
  if (!Array.isArray(chapter.audio_script) || idx < 0 || idx >= chapter.audio_script.length) {
    return withCORS(NextResponse.json({ success: false, error: "Chunk not found" }, { status: 404 }));
  }

  chapter.audio_script[idx].note = note;
  chapter.markModified("audio_script");
  await chapter.save();
  return withCORS(NextResponse.json({ success: true }));
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }));
}