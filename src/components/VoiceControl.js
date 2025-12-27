"use client";
import { useEffect } from 'react';
import { useVoice } from '@/context/VoiceProvider';

export default function VoiceControl({ audioPlayer }) {
  const { lastResult } = useVoice();

  useEffect(() => {
    if (!lastResult) return;

    const command = lastResult.toLowerCase();
    
    // Check if the command is at the end of the string or is the string
    // We use 'endsWith' because lastResult might contain a sentence if we are dictating
    // But usually lastResult is just the latest segment.
    
    if (command.includes('pause')) {
      audioPlayer.pause();
    } else if (command.includes('play') || command.includes('resume')) {
      audioPlayer.play();
    } else if (command.includes('forward') || command.includes('skip')) {
      audioPlayer.seekForward(30);
    } else if (command.includes('rewind') || command.includes('back')) {
      audioPlayer.seekBackward(30);
    }
  }, [lastResult, audioPlayer]);

  return null;
}
