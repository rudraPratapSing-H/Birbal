import { useState, useEffect } from 'react';

export function useNotes({ book_name, chapter_num, chunk_index }) {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteFetching, setNoteFetching] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      if (!book_name || !chapter_num || chunk_index == null) return;
      setNoteFetching(true);
      setNoteSaved(false);
      try {
        const res = await fetch(`/api/saveNote?book_name=${encodeURIComponent(book_name)}&chapter_num=${encodeURIComponent(chapter_num)}&chunk_index=${chunk_index}`);
        const data = await res.json();
        if (data.success) {
          setNote(data.note || "");
        } else {
          setNote("");
        }
      } catch {
        setNote("");
      }
      setNoteFetching(false);
    }
    fetchNote();
  }, [book_name, chapter_num, chunk_index]);

  async function saveNote() {
    if (!note.trim()) return;
    setNoteLoading(true);
    try {
      const res = await fetch("/api/saveNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_name, chapter_num, chunk_index, note }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteSaved(true);
      }
    } catch (err) {}
    setNoteLoading(false);
  }

  return { note, setNote, noteSaved, noteLoading, noteFetching, saveNote };
}
