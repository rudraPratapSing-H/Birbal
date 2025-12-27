


import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { NextResponse } from "next/server";
import { withCORS } from "../cors";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


// GET: fetch notes for a specific chunk
export async function GET(req) {
  const session = await getServerSession(authOptions);
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
  let notes = chunk.notes || [];

  // Filter notes based on user session
  if (session?.user?.id) {
    // Show user's notes AND notes without userId (legacy/public)
    notes = notes.filter(n => !n.userId || n.userId.toString() === session.user.id);
  } else {
    // Not logged in: show only notes without userId
    notes = notes.filter(n => !n.userId);
  }

  return withCORS(NextResponse.json({ 
    success: true, 
    note: chunk.note ?? "", // Old single note for backward compatibility
    notes: notes, // New: Array of notes with timestamps
    chunk 
  }));
}

// POST: save note for a specific chunk with timestamp
export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { book_name, chapter_num, chunk_index, note, timestamp } = await req.json();
  if (!book_name || !chapter_num || chunk_index === undefined) {
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

  // If timestamp is provided, add to notes array (new feature)
  if (timestamp !== undefined && note) {
    if (!chapter.audio_script[idx].notes) {
      chapter.audio_script[idx].notes = [];
    }
    
    const newNote = {
      text: note,
      timestamp: timestamp,
      created_at: new Date()
    };

    if (session?.user?.id) {
      newNote.userId = session.user.id;
    }

    chapter.audio_script[idx].notes.push(newNote);
  } else if (note !== undefined) {
    // Backward compatibility: save to old single note field
    chapter.audio_script[idx].note = note;
  }

  chapter.markModified("audio_script");
  await chapter.save();
  return withCORS(NextResponse.json({ success: true }));
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }));
}