// Button.js
"use client";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
