import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { withCORS } from "../cors";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const book_name = searchParams.get("book_name");

    if (!book_name) {
      return withCORS(NextResponse.json(
        { success: false, error: "book_name parameter is required" },
        { status: 400 }
      ));
    }

    // Find all chapters for books where book_name contains the search string (case-insensitive)
    const regex = new RegExp(book_name, "i");
    const chapters = await Chapter.find({ book_name: regex }).sort({ book_name: 1, chapter_num: 1 }).exec();

    if (chapters.length === 0) {
      return withCORS(NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      ));
    }

    // Group chapters by book_name
    const books = {};
    chapters.forEach(chapter => {
      if (!books[chapter.book_name]) {
        books[chapter.book_name] = [];
      }
      books[chapter.book_name].push(chapter);
    });

    // Format response
    const data = Object.entries(books).map(([name, chapters]) => ({
      book_name: name,
      total_chapters: chapters.length,
      chapters
    }));

    return withCORS(NextResponse.json({ 
      success: true, 
      data
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