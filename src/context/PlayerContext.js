
import React, { createContext, useContext, useState } from 'react';


const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  // Add more global state as needed

  return (
    <PlayerContext.Provider value={{ playbackSpeed, setPlaybackSpeed, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
