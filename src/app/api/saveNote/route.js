import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter"; // adjust path if needed
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const book_name = searchParams.get("book_name");
  const chapter_num = searchParams.get("chapter_num");
  const chunk_index = Number(searchParams.get("chunk_index"));

  await dbConnect();

  const chapter = await Chapter.findOne({ book_name, chapter_num });
  if (!chapter || !chapter.audio_script?.[chunk_index]) {
    return NextResponse.json({ success: false, error: "Chunk not found" }, { status: 404 });
  }
  const note = chapter.audio_script[chunk_index].note || "";
  return NextResponse.json({ success: true, note });
}

export async function POST(req) {
  const { book_name, chapter_num, chunk_index, note } = await req.json();
  await dbConnect();

  const chapter = await Chapter.findOne({ book_name, chapter_num });
  if (!chapter || !chapter.audio_script?.[chunk_index]) {
    return NextResponse.json({ success: false, error: "Chunk not found" }, { status: 404 });
  }
  chapter.audio_script[chunk_index].note = note;
  chapter.markModified('audio_script');
  await chapter.save();
  return NextResponse.json({ success: true });
}