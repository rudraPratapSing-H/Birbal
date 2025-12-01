

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Chapter from "@/models/Chapter";
import { withCORS } from "../cors";


export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const book_name = searchParams.get("book_name");
    const chapter_num = searchParams.get("chapter_num");
    const chapters = await Chapter.find({ book_name: book_name, chapter_num: chapter_num }).exec();
    return withCORS(NextResponse.json({ success: true, data: chapters }));
  } catch (error) {
    return withCORS(NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    ));
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }));
}

