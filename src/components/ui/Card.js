// Card.js
"use client";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-purple-500/30 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
