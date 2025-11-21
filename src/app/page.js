




"use client";
import { useState, useEffect } from 'react';


export default function Home() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  // Group chapters by book name
  function groupByBook(chapters) {
    const grouped = {};
    chapters.forEach((chapter) => {
      if (!grouped[chapter.book_name]) {
        grouped[chapter.book_name] = {
          book_name: chapter.book_name,
          chapters: [],
        };
      }
      grouped[chapter.book_name].chapters.push(chapter);
    });
    return Object.values(grouped);
  }

  // Handle book selection
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setChapterData(null);
    setCurrentChunkIndex(0);
  };
    // Fetch all books/chapters on mount
  useEffect(() => {
    fetch("/api/fetchAll")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Group chapters by book_name
          const groupedBooks = groupByBook(data.data);
          setBooks(groupedBooks);
        }
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);


  // Handle chapter selection
  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    
    // Fetch specific chapter data
    fetch(`/api/fetch?book_name=${chapter.book_name}&chapter_num=${chapter.chapter_num}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Chapter data response:", data);
        if (data.success && data.data.length > 0) {
          console.log("Audio script:", data.data[0].audio_script);
          console.log("First chunk audio URL:", data.data[0].audio_script[0]?.audio_url);
          setChapterData(data.data[0]);
          setCurrentChunkIndex(0);
          setIsPlaying(false);
        } else {
          console.error("No chapter data found");
        }
      })
      .catch((error) => console.error("Error fetching chapter:", error));
  };

  // Handle audio ended - play next chunk
  const handleAudioEnded = () => {
    if (chapterData && currentChunkIndex < chapterData.audio_script.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Handle next chunk
  const handleNext = () => {
    if (chapterData && currentChunkIndex < chapterData.audio_script.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  };

  // Handle previous chunk
  const handlePrevious = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
    }
  };

  const currentChunk = chapterData?.audio_script?.[currentChunkIndex];
  // Note-taking state
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteFetching, setNoteFetching] = useState(false);

  // Fetch existing note for this chunk from backend
  useEffect(() => {
    async function fetchNote() {
      if (!chapterData) return;
      setNoteFetching(true);
      setNoteSaved(false);
      try {
        const res = await fetch(`/api/saveNote?book_name=${encodeURIComponent(chapterData.book_name)}&chapter_num=${encodeURIComponent(chapterData.chapter_num)}&chunk_index=${currentChunkIndex}`);
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
  }, [currentChunkIndex, chapterData]);

  // Save note to backend
  async function handleSaveNote() {
    if (!note.trim()) return;
    setNoteLoading(true);
    try {
      const res = await fetch("/api/saveNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_name: chapterData.book_name,
          chapter_num: chapterData.chapter_num,
          chunk_index: currentChunkIndex,
          note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteSaved(true);
      }
    } catch (err) {
      // Optionally show error
    }
    setNoteLoading(false);
  }

  // Log current chunk for debugging
  useEffect(() => {
    if (currentChunk) {
      console.log("Current chunk index:", currentChunkIndex);
      console.log("Current chunk:", currentChunk);
      console.log("Audio URL:", currentChunk.audio_url);
    }
  }, [currentChunk, currentChunkIndex]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600">
          Audio Book Library
        </h1>

        {/* Books List */}
        {!selectedBook && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {books.map((book, idx) => (
              <div
                key={idx}
                onClick={() => handleBookClick(book)}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 border border-purple-500/30"
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-purple-300">
                  {book.book_name.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  {book.chapters.length} Chapter{book.chapters.length > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Book Details */}
        {selectedBook && !selectedChapter && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-8 border border-purple-500/30">
            <button
              onClick={() => setSelectedBook(null)}
              className="mb-4 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm sm:text-base"
            >
              ← Back to Books
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-300">
              {selectedBook.book_name.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Chapters:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {selectedBook.chapters
                .sort((a, b) => parseInt(a.chapter_num) - parseInt(b.chapter_num))
                .map((chapter) => (
                  <div
                    key={chapter._id}
                    onClick={() => handleChapterClick(chapter)}
                    className="bg-white/10 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-white/20 transition border border-purple-400/20"
                  >
                    <h4 className="font-semibold text-base sm:text-lg text-purple-200">
                      Chapter {chapter.chapter_num}: {chapter.title || "Untitled"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      {chapter.total_chunks} audio chunks
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Chapter Player */}
        {chapterData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-8 border border-purple-500/30">
            <button
              onClick={() => {
                setSelectedChapter(null);
                setChapterData(null);
                setCurrentChunkIndex(0);
              }}
              className="mb-4 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm sm:text-base"
            >
              ← Back to Chapters
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-300">
              Chapter {chapterData.chapter_num}: {chapterData.title || "Untitled"}
            </h2>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Part {currentChunkIndex + 1} of {chapterData.audio_script.length}
            </p>

            {/* Text Display */}
            {currentChunk && (
              <div className="bg-black/30 p-4 sm:p-8 rounded-lg mb-4 sm:mb-8 h-[60vh] sm:h-[70vh] flex flex-col justify-center items-center overflow-y-auto">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-200">Now Playing:</h3>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-xl sm:text-2xl text-center">
                  {currentChunk.original_text}
                </p>
               
              </div>
            )}
             {/* Note Taking UI */}
                <div className="w-full max-w-2xl mt-8">
                  <h4 className="text-lg font-semibold mb-2 text-purple-300">Your Notes for this Part:</h4>
                  <textarea
                    className="w-full h-24 p-3 rounded-lg bg-gray-900 text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none mb-2"
                    value={note}
                    onChange={e => { setNote(e.target.value); setNoteSaved(false); }}
                    placeholder={noteFetching ? "Loading note..." : "Type your notes here..."}
                    disabled={noteFetching}
                  />
                  <button
                    className="px-4 py-2 mb-5 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-semibold disabled:bg-gray-600"
                    onClick={handleSaveNote}
                    disabled={noteLoading || noteFetching || !note.trim()}
                  >
                    {noteLoading ? "Saving..." : noteSaved ? "Saved!" : "Save Note"}
                  </button>
                </div>

            {/* Audio Player */}
            {currentChunk?.audio_url && (
              <div className="bg-black/30 p-4 sm:p-6 rounded-lg">
                <audio
                  key={currentChunkIndex}
                  controls
                  autoPlay
                  onEnded={handleAudioEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => console.error("Audio error:", e)}
                  onLoadStart={() => console.log("Audio loading:", currentChunk.audio_url)}
                  className="w-full mb-2 sm:mb-4"
                  src={currentChunk.audio_url}
                >
                  Your browser does not support the audio element.
                </audio>
                <p className="text-xs text-gray-400 mb-2 sm:mb-4 break-all">Audio URL: {currentChunk.audio_url}</p>

                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentChunkIndex === 0}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm sm:text-base"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentChunkIndex === chapterData.audio_script.length - 1}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm sm:text-base"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* All Chunks List */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-purple-200">All Parts:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-2">
                {chapterData.audio_script.map((chunk, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentChunkIndex(idx)}
                    className={`p-2 sm:p-3 rounded-lg transition text-xs sm:text-base ${
                      idx === currentChunkIndex
                        ? "bg-purple-600 font-bold"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    Part {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
