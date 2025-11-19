import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceNarrationProps {
  text: string;
  autoPlay?: boolean;
}

export const VoiceNarration = ({ text, autoPlay = false }: VoiceNarrationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSpeechSupported(false);
      return;
    }

    if (autoPlay) {
      handlePlay();
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    if (!speechSupported) {
      toast({
        title: "Voice narration not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "Narration error",
        description: "Failed to read the memory aloud.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!speechSupported) return null;

  return (
    <div className="flex gap-2">
      {!isPlaying ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlay}
          aria-label="Read memory aloud"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          Read Aloud
        </Button>
      ) : (
        <>
          {isPaused ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResume}
              aria-label="Resume narration"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              aria-label="Pause narration"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            aria-label="Stop narration"
          >
            <VolumeX className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};
