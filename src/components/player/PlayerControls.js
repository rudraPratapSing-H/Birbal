// PlayerControls.js
"use client";

export default function PlayerControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  disableNext,
  disablePrevious,
  onSkipBackward,
  onSkipForward
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
      <button
        onClick={onPrevious}
        disabled={disablePrevious}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm"
      >
        ← Previous
      </button>
      <button
        onClick={onSkipBackward}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-semibold"
        title="Skip backward 30 seconds"
      >
        -30s
      </button>
      {/* {isPlaying ? (
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
      )} */}
      <button
        onClick={onSkipForward}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-semibold"
        title="Skip forward 30 seconds"
      >
        +30s
      </button>
      <button
        onClick={onNext}
        disabled={disableNext}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition text-sm"
      >
        Next →
      </button>
    </div>
  );
}
