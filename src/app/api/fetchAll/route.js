
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Chapter from "@/models/Chapter";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
  
  
    const chapters = await Chapter.find({}).exec();
    return NextResponse.json({ success: true, data: chapters });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

