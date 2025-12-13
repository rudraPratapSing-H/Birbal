import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { withCORS } from "../cors";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const book_name = searchParams.get("book_name");

    // Build query - if book_name provided, filter by it
    const query = book_name ? { book_name } : {};
    
    const chapters = await Chapter.find(query).exec();
    
    const allNotes = [];
    
    chapters.forEach(chapter => {
      if (chapter.audio_script && Array.isArray(chapter.audio_script)) {
        chapter.audio_script.forEach((chunk, index) => {
          if (chunk.note && chunk.note.trim() !== "") {
            allNotes.push({
              book_name: chapter.book_name,
              chapter_num: chapter.chapter_num,
              chunk_index: index,
              note: chunk.note,
              audio_url: chunk.audio_url,
              timestamp: chapter.updated_at || chapter.created_at
            });
          }
        });
      }
    });

    // Sort by most recent first
    allNotes.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
      const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
      return dateB - dateA;
    });

    return withCORS(NextResponse.json({ 
      success: true, 
      count: allNotes.length,
      data: allNotes 
    }));
  } catch (error) {
    return withCORS(NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    ));
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }));
}
