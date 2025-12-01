// PlayerControls.js
"use client";

export default function PlayerControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  disableNext,
  disablePrevious
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
      <button
        onClick={onPrevious}
        disabled={disablePrevious}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm sm:text-base"
      >
        ← Previous
      </button>
      {isPlaying ? (
        <button
          onClick={onPause}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition text-sm sm:text-base"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm sm:text-base"
        >
          Play
        </button>
      )}
      <button
        onClick={onNext}
        disabled={disableNext}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm sm:text-base"
      >
        Next →
      </button>
    </div>
  );
}
