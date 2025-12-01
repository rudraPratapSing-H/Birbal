// AudioChunkList.js
"use client";

export default function AudioChunkList({ audioScript, currentChunkIndex, setCurrentChunkIndex }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-purple-200">All Parts:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-2">
        {audioScript.map((chunk, idx) => (
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
  );
}
