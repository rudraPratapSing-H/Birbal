// ChapterList.js
"use client";

export default function ChapterList({ chapters, onChapterClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      {chapters
        .sort((a, b) => parseInt(a.chapter_num) - parseInt(b.chapter_num))
        .map((chapter) => (
          <div
            key={chapter._id}
            onClick={() => onChapterClick(chapter)}
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
  );
}
