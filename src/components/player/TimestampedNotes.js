"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function TimestampedNotes({ 
  book_name, 
  chapter_num, 
  chunk_index, 
  audioRef,
  onSeek 
}) {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (book_name && chapter_num !== undefined && chunk_index !== undefined) {
      fetchNotes();
    }
  }, [book_name, chapter_num, chunk_index]);

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await fetch(
        `/api/saveNote?book_name=${encodeURIComponent(book_name)}&chapter_num=${chapter_num}&chunk_index=${chunk_index}`
      );
      const data = await res.json();
      if (data.success && data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setFetching(false);
    }
  };

  const getCurrentTime = () => {
    return audioRef?.current?.currentTime || 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;

    const timestamp = getCurrentTime();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch('/api/saveNote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_name,
          chapter_num,
          chunk_index,
          note: noteText,
          timestamp
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setNoteText("");
        await fetchNotes();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeekToNote = (timestamp) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = timestamp;
      if (onSeek) onSeek(timestamp);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      <h4 className="text-lg font-semibold mb-3 text-purple-300">
        Timestamped Notes for this Part
      </h4>

      {/* Add New Note */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-400">
            Current time: {formatTime(getCurrentTime())}
          </span>
        </div>
        <textarea
          className="w-full h-24 p-3 rounded-lg bg-gray-900 text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none mb-2"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder={fetching ? "Loading notes..." : "Type your note here... It will be saved with the current audio timestamp"}
          disabled={fetching || loading}
        />
        <Button
          onClick={handleSaveNote}
          disabled={loading || fetching || !noteText.trim()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : saved ? "Saved! ✓" : "Save Note at Current Time"}
        </Button>
      </div>

      {/* Display Notes */}
      {notes.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-gray-400 mb-2">
            Saved Notes ({notes.length})
          </h5>
          {notes.sort((a, b) => a.timestamp - b.timestamp).map((note, index) => (
            <div
              key={note._id || index}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <button
                  onClick={() => handleSeekToNote(note.timestamp)}
                  className="text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                  title="Click to jump to this timestamp"
                >
                  ⏱️ {formatTime(note.timestamp)}
                </button>
                <span className="text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && !fetching && (
        <p className="text-sm text-gray-500 italic">
          No notes yet. Add your first timestamped note!
        </p>
      )}
    </div>
  );
}
