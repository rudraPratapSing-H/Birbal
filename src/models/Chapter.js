import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Number, required: true }, // Time in seconds
  created_at: { type: Date, default: Date.now }
}, { _id: true });

const AudioScriptChunkSchema = new mongoose.Schema({
  ssml: { type: String },
  audio_url: { type: String },
  note: { type: String, default: "" }, // Keep for backward compatibility
  notes: { type: [NoteSchema], default: [] }, // New: Array of notes with timestamps
  error: { type: String },
}, { _id: false });

const ChapterSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  chapter_num: { type: String, required: true },
  title: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  audio_script: { type: [AudioScriptChunkSchema], default: [] }, // <-- ADD THIS LINE
}, { collection: 'chapters' });

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
