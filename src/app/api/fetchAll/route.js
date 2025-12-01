

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Chapter from "@/models/Chapter";
import { withCORS } from "../cors";


export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const chapters = await Chapter.find({}).exec();
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

