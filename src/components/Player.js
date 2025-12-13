

// Player.js
"use client";

import PlayerControls from "@/components/player/PlayerControls";
import PlaybackSpeedSelector from "@/components/player/PlaybackSpeedSelector";
import AudioChunkList from "@/components/player/AudioChunkList";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

import { useRef, useEffect, useState } from "react";

export default function Player({
  chapterData,
  currentChunkIndex,
  setCurrentChunkIndex,
  playbackSpeed,
  setPlaybackSpeed,
  isPlaying,
  setIsPlaying,
  handleAudioEnded,
  handleNext,
  handlePrevious,
  notesProps,
  audioPlayer,
  onBackToChapters
}) {
  const currentChunk = chapterData?.audio_script?.[currentChunkIndex];
  const audioRef = useRef(null);
  const [showPdf, setShowPdf] = useState(true);

  // Extract book name from audio URL
  const getBookPdfPath = () => {
    if (!currentChunk?.audio_url) return null;
    // Extract book name from URL like: https://storage.googleapis.com/subtleartofnotgivingafuck/audio/subtleArtOfNotGivingAFuck/chapter_4_chunk_1.mp3
    const match = currentChunk.audio_url.match(/\/audio\/([^\/]+)\//);
    if (match && match[1]) {
      console.log("Extracted book name from URL:", match[1]);
      return `/books/${match[1]}.pdf`;
    }
    console.log("Could not extract book name from URL:", currentChunk.audio_url);
    return null;
  };

  const pdfPath = getBookPdfPath();

  // Keep audio playbackRate in sync with playbackSpeed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentChunkIndex]);

  return (
    <Card className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm sm:text-base font-semibold"
            onClick={onBackToChapters}
          >
            ← Back to chapters
          </button>
          {pdfPath && (
            <button
              className={`px-3 py-2 sm:px-4 sm:py-2 ${showPdf ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg transition text-sm sm:text-base font-semibold`}
              onClick={() => setShowPdf(!showPdf)}
            >
              {showPdf ? '📖 Hide Book' : '📖 Show Book'}
            </button>
          )}
        </div>
        <PlaybackSpeedSelector playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-300">
        Chapter {chapterData.chapter_num}: {chapterData.title || "Untitled"}
      </h2>
      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
        Part {currentChunkIndex + 1} of {chapterData.audio_script.length}
      </p>

      {/* PDF Viewer */}
      {pdfPath && showPdf && (
        <div className="mb-4 sm:mb-8">
          <div className="bg-black/30 p-2 rounded-lg">
            <iframe
              src={pdfPath}
              className="w-full h-[60vh] sm:h-[70vh] rounded-lg"
              title="Book PDF"
            />
          </div>
        </div>
      )}

      {/* Text Display */}
      {!showPdf && currentChunk ? (
        <div className="bg-black/30 p-4 sm:p-8 rounded-lg mb-4 sm:mb-8 h-[60vh] sm:h-[70vh] flex flex-col justify-center items-center overflow-y-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-200">Now Playing:</h3>
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-xl sm:text-2xl text-center">
            {currentChunk.original_text}
          </p>
        </div>
      ) : !showPdf ? (
        <div className="flex justify-center items-center h-40">
          <Spinner className="h-8 w-8" />
        </div>
      ) : null}

      {/* Note Taking UI */}
      <div className="w-full max-w-2xl mt-8">
        <h4 className="text-lg font-semibold mb-2 text-purple-300">Your Notes for this Part:</h4>
        <textarea
          className="w-full h-24 p-3 rounded-lg bg-gray-900 text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none mb-2"
          value={notesProps.note}
          onChange={e => { notesProps.setNote(e.target.value); notesProps.setNoteSaved && notesProps.setNoteSaved(false); }}
          placeholder={notesProps.noteFetching ? "Loading note..." : "Type your notes here..."}
          disabled={notesProps.noteFetching}
        />
        <button
          className="px-4 py-2 mb-5 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-semibold disabled:bg-gray-600"
          onClick={notesProps.saveNote}
          disabled={notesProps.noteLoading || notesProps.noteFetching || !notesProps.note.trim()}
        >
          {notesProps.noteLoading ? "Saving..." : notesProps.noteSaved ? "Saved!" : "Save Note"}
        </button>
      </div>

      {/* Audio Player */}
      {currentChunk?.audio_url && (
        <div className="bg-black/30 p-4 sm:p-6 rounded-lg">
          <audio
            key={currentChunkIndex}
            ref={audioRef}
            controls
            autoPlay
            onEnded={handleAudioEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={e => console.error("Audio error:", e)}
            className="w-full mb-2 sm:mb-4"
            src={currentChunk.audio_url}
          >
            Your browser does not support the audio element.
          </audio>
          {/* <p className="text-xs text-gray-400 mb-2 sm:mb-4 break-all">Audio URL: {currentChunk.audio_url}</p> */}

          {/* Preload next audio chunk in background */}
          {chapterData && currentChunkIndex < chapterData.audio_script.length - 1 && (
            <audio
              src={chapterData.audio_script[currentChunkIndex + 1].audio_url}
              preload="auto"
              style={{ display: "none" }}
            />
          )}

          {/* Navigation Controls */}
          {/* <PlayerControls
            isPlaying={isPlaying}
            onPlay={() => audioPlayer.play()}
            onPause={() => audioPlayer.pause()}
            onNext={handleNext}
            onPrevious={handlePrevious}
            disableNext={currentChunkIndex === chapterData.audio_script.length - 1}
            disablePrevious={currentChunkIndex === 0}
          /> */}
        </div>
      )}

      {/* All Chunks List */}
      <AudioChunkList
        audioScript={chapterData.audio_script}
        currentChunkIndex={currentChunkIndex}
        setCurrentChunkIndex={setCurrentChunkIndex}
      />
    </Card>
  );
}
