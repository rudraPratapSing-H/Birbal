
"use client";
import { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";
import { useNotes } from "@/hooks/useNotes";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import Player from "@/components/Player";
import BookCard from "@/components/books/BookCard";
import ChapterList from "@/components/books/ChapterList";
import NotesView from "@/components/NotesView";

import LoginButton from "@/components/LoginButton";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";



function HomeContent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [viewMode, setViewMode] = useState('library'); // 'library' or 'notes'
  const { playbackSpeed, setPlaybackSpeed, isPlaying, setIsPlaying } = usePlayer();
  // Notes hook
  const notesProps = useNotes({
    book_name: chapterData?.book_name,
    chapter_num: chapterData?.chapter_num,
    chunk_index: currentChunkIndex
  });
  // Audio player hook
  const audioUrl = chapterData?.audio_script?.[currentChunkIndex]?.audio_url;
  const audioPlayer = useAudioPlayer({ src: audioUrl, initialPlaybackRate: playbackSpeed });



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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);


  // Handle chapter selection
  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    // Fetch specific chapter data
    fetch(`/api/fetch?book_name=${chapter.book_name}&chapter_num=${chapter.chapter_num}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setChapterData(data.data[0]);
          setCurrentChunkIndex(0);
          setIsPlaying(false);
        } else {
          console.error("No chapter data found");
        }
      })
      .catch((error) => console.error("Error fetching chapter:", error));
  };


  // Audio navigation handlers
  const handleAudioEnded = () => {
    if (chapterData && currentChunkIndex < chapterData.audio_script.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };
  const handleNext = () => {
    if (chapterData && currentChunkIndex < chapterData.audio_script.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
    }
  };

  // Navigate to audio from notes view
  const handleNavigateToAudio = ({ book_name, chapter_num, chunk_index, audio_timestamp }) => {
    // First, find the book
    const book = books.find(b => b.book_name === book_name);
    if (!book) {
      console.error('Book not found');
      return;
    }

    // Find the chapter
    const chapter = book.chapters.find(c => c.chapter_num === chapter_num);
    if (!chapter) {
      console.error('Chapter not found');
      return;
    }

    // Fetch chapter data and navigate
    fetch(`/api/fetch?book_name=${book_name}&chapter_num=${chapter_num}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setViewMode('library');
          setSelectedBook(book);
          setSelectedChapter(chapter);
          setChapterData(data.data[0]);
          setCurrentChunkIndex(chunk_index);
          setIsPlaying(false);
          
          // If audio_timestamp is provided, seek to that time after a short delay
          if (audio_timestamp !== null && audio_timestamp !== undefined) {
            setTimeout(() => {
              const audioElement = document.querySelector('audio');
              if (audioElement) {
                audioElement.currentTime = audio_timestamp;
                audioElement.play();
              }
            }, 500);
          }
        }
      })
      .catch((error) => console.error('Error fetching chapter:', error));
  };

  const currentChunk = chapterData?.audio_script?.[currentChunkIndex];


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600">
            Audio Book Library
          </h1>
          <div className="flex gap-2 items-center flex-wrap justify-center">
            <Button
              onClick={() => setViewMode('library')}
              className={`px-4 py-2 ${viewMode === 'library' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white`}
            >
              📚 Library
            </Button>
            <Button
              onClick={() => setViewMode('notes')}
              className={`px-4 py-2 ${viewMode === 'notes' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white`}
            >
              📝 My Notes
            </Button>
            <LoginButton />
          </div>
        </div>
        {/* Notes View */}
        {viewMode === 'notes' && (
          <NotesView onNavigateToAudio={handleNavigateToAudio} />
        )}

        {/* Library View */}
        {viewMode === 'library' && (
          <>
        {/* Books List */}
        {/* Book List */}
        {!selectedBook && (
          loading ? (
            <div className="flex justify-center items-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {books.map((book, idx) => (
                <BookCard key={idx} book={book} onClick={handleBookClick} />
              ))}
            </div>
          )
        )}
        {/* Book Details */}
        {/* Book Details & Chapter List */}
        {selectedBook && !selectedChapter && (
          <Card className="p-4 sm:p-8">
            <Button
              onClick={() => {
                setSelectedBook(null);
                setSelectedChapter(null);
                setChapterData(null);
                setCurrentChunkIndex(0);
              }}
              className="mb-4 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
            >
              ← Back to Books
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-300">
              {selectedBook.book_name.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Chapters:</h3>
            <ChapterList chapters={selectedBook.chapters} onChapterClick={handleChapterClick} />
          </Card>
        )}
        {/* Chapter Player */}
        {chapterData && (
          <Player
            chapterData={chapterData}
            currentChunkIndex={currentChunkIndex}
            setCurrentChunkIndex={setCurrentChunkIndex}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleAudioEnded={handleAudioEnded}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            notesProps={notesProps}
            audioPlayer={audioPlayer}
            onBackToChapters={() => {
              setSelectedChapter(null);
              setChapterData(null);
              setCurrentChunkIndex(0);
            }}
          />
        )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <HomeContent />
    </PlayerProvider>
  );
}
