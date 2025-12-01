import { useRef, useState, useCallback } from 'react';

export function useAudioPlayer({ src, initialPlaybackRate = 1 }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate);

  // Play audio
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Seek forward by seconds
  const seekForward = useCallback((seconds = 30) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + seconds,
        audioRef.current.duration || 0
      );
    }
  }, []);

  // Seek backward by seconds
  const seekBackward = useCallback((seconds = 30) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - seconds,
        0
      );
    }
  }, []);

  // Set playback rate
  const changePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  // Audio event handlers
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime || 0);
  const onLoadedMetadata = () => setDuration(audioRef.current?.duration || 0);

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    playbackRate,
    setPlaybackRate: changePlaybackRate,
    play,
    pause,
    seekForward,
    seekBackward,
    audioProps: {
      ref: audioRef,
      src,
      controls: true,
      onPlay,
      onPause,
      onTimeUpdate,
      onLoadedMetadata,
      playbackRate,
    },
  };
}
