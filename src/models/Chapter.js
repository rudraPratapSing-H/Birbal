import mongoose from 'mongoose';

const AudioScriptChunkSchema = new mongoose.Schema({
  original_text: { type: String },
  ssml: { type: String },
  audio_url: { type: String },
  error: { type: String },
}, { _id: false });

const ChapterSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  chapter_num: { type: String, required: true },
  title: { type: String },
  start_line: { type: Number },
  end_line: { type: Number },
  total_chunks: { type: Number },
  audio_script: { type: [AudioScriptChunkSchema], default: [] },
  created_at: { type: Date },
  updated_at: { type: Date },
  audio_file: { type: String },
  gcs_url: { type: String },
  audio_url: { type: String },
}, { collection: 'ssml_data' });

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
