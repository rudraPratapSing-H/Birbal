// BookCard.js
"use client";

export default function BookCard({ book, onClick }) {
  return (
    <div
      onClick={() => onClick(book)}
      className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 border border-purple-500/30"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-purple-300">
        {book.book_name.replace(/([A-Z])/g, " $1").trim()}
      </h2>
      <p className="text-gray-300 text-sm sm:text-base">
        {book.chapters.length} Chapter{book.chapters.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
