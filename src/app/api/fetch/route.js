
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Chapter from "@/models/Chapter";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const book_name = searchParams.get("book_name");
    const chapter_num = searchParams.get("chapter_num");
  
    const chapters = await Chapter.find({ book_name: book_name, chapter_num: chapter_num }).exec();
    return NextResponse.json({ success: true, data: chapters });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

