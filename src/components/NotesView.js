"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400 bg-red-900/20 rounded-lg">
        Error loading notes: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            My Notes
          </h2>
          
          {/* Filter by book */}
          {getUniqueBooks().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={() => setFilterBook("")}
                className={`px-3 py-1.5 text-sm ${!filterBook ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} transition-colors`}
              >
                All Books
              </Button>
              {getUniqueBooks().map(book => (
                <Button
                  key={book}
                  onClick={() => setFilterBook(book)}
                  className={`px-3 py-1.5 text-sm ${filterBook === book ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} transition-colors`}
                >
                  {book.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              ))}
            </div>
          )}

          <p className="text-gray-400 text-sm">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
          </p>
        </div>

        {notes.length === 0 ? (
          <Card className="p-8 text-center bg-gray-800/50 border border-gray-700">
            <p className="text-gray-400 text-lg">No notes found. Start adding notes to your audio chunks!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notes.map((note, index) => (
              <Card key={index} className="p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 text-purple-300 rounded-full text-xs font-medium">
                        {note.book_name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Chapter {note.chapter_num} • Chunk {note.chunk_index + 1}
                      </span>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-gray-700/50 p-3 rounded-lg mb-3">
                      <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">{note.note}</p>
                    </div>

                    {note.timestamp && (
                      <p className="text-xs text-gray-500">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      onClick={() => handlePlayAudio(note)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
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
