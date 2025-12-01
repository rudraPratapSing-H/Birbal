

"use client";

export default function PlaybackSpeedSelector({ playbackSpeed, setPlaybackSpeed }) {
  return (
    <div className="mb-4 flex items-center justify-end">
      <label htmlFor="playbackSpeed" className="mr-2 text-base text-purple-200 font-semibold">
        Playback Speed:
      </label>
      <select
        id="playbackSpeed"
        value={playbackSpeed}
        onChange={e => setPlaybackSpeed(Number(e.target.value))}
        className="px-3 py-1 rounded bg-gray-800 text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value={0.5}>0.5x</option>
        <option value={0.75}>0.75x</option>
        <option value={1}>1x</option>
        <option value={1.25}>1.25x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>
    </div>
  );
}
