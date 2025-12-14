
// Spinner.js
"use client";

export default function Spinner({ className = "" }) {
  return (
    <div>
    <svg className={`animate-spin h-5 w-5 text-purple-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <h4 className="text-purple-300 mt-2 text-sm">Loading...</h4>
    </div>
  );
}
