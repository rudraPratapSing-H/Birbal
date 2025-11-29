import mongoose from 'mongoose';
const AudioScriptChunkSchema = new mongoose.Schema({

  ssml: { type: String },
  audio_url: { type: String },
  note: { type: String ,default: ""},
  error: { type: String },
}, { _id: false });

const ChapterSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  chapter_num: { type: String, required: true },
  title: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
}, { collection: 'chapters' });

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
