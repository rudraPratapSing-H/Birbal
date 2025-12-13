"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function NotesView({ onNavigateToAudio }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBook, setFilterBook] = useState("");

  useEffect(() => {
    fetchAllNotes();
  }, [filterBook]);

  const fetchAllNotes = async () => {
    try {
      setLoading(true);
      const url = filterBook 
        ? `http://localhost:3000/api/getAllNotes?book_name=${encodeURIComponent(filterBook)}`
        : `http://localhost:3000/api/getAllNotes`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setNotes(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (note) => {
    if (onNavigateToAudio) {
      onNavigateToAudio({
        book_name: note.book_name,
        chapter_num: note.chapter_num,
        chunk_index: note.chunk_index
      });
    }
  };

  const getUniqueBooks = () => {
    const books = [...new Set(notes.map(n => n.book_name))];
    return books;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading notes: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Notes</h1>
          
          {/* Filter by book */}
          {getUniqueBooks().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={() => setFilterBook("")}
                className={`${!filterBook ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                All Books
              </Button>
              {getUniqueBooks().map(book => (
                <Button
                  key={book}
                  onClick={() => setFilterBook(book)}
                  className={`${filterBook === book ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  {book}
                </Button>
              ))}
            </div>
          )}

          <p className="text-gray-600">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
          </p>
        </div>

        {notes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-lg">No notes found. Start adding notes to your audio chunks!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {note.book_name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Chapter {note.chapter_num} • Chunk {note.chunk_index + 1}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-800 whitespace-pre-wrap">{note.note}</p>
                    </div>

                    {note.timestamp && (
                      <p className="text-xs text-gray-400">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      onClick={() => handlePlayAudio(note)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                    >
                      ▶ Play Audio
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
