import { useState, useEffect, useCallback } from "react";
import { Memory } from "@/types/memory";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, X, SkipForward } from "lucide-react";
import { format } from "date-fns";
import { VoiceNarration } from "./VoiceNarration";

interface AmbientModeProps {
  memories: Memory[];
  isOpen: boolean;
  onClose: () => void;
}

const TRANSITION_DURATION = 15000; // 15 seconds per memory

export const AmbientMode = ({ memories, isOpen, onClose }: AmbientModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentMemory = memories[currentIndex];

  const nextMemory = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  }, [memories.length]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(nextMemory, TRANSITION_DURATION);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, nextMemory]);

  useEffect(() => {
    // Reset when opening
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!currentMemory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-full h-full m-0 p-0 bg-black">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Full-screen image background */}
          <div className="absolute inset-0 overflow-hidden">
            {currentMemory.photos[0] && (
              <img
                src={currentMemory.photos[0].url}
                alt={currentMemory.title}
                className="w-full h-full object-cover animate-fadeIn"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Controls overlay */}
          <div className="absolute top-8 right-8 flex gap-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-black/50 hover:bg-black/70 text-white"
              aria-label={isPlaying ? "Pause ambient mode" : "Play ambient mode"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMemory}
              className="bg-black/50 hover:bg-black/70 text-white"
              aria-label="Next memory"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white"
              aria-label="Exit ambient mode"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Memory content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-12 z-10 text-white animate-slideUp">
            <div className="max-w-4xl">
              <p className="text-lg mb-2 opacity-90">
                {format(currentMemory.date, "MMMM d, yyyy")}
                {currentMemory.location && ` • ${currentMemory.location}`}
              </p>
              <h2 className="text-5xl font-semibold mb-6">{currentMemory.title}</h2>
              <p className="text-2xl leading-relaxed mb-6 opacity-90">
                {currentMemory.narrative}
              </p>
              
              <div className="flex items-center gap-4">
                <VoiceNarration 
                  text={`${currentMemory.title}. ${currentMemory.narrative}`}
                  autoPlay={false}
                />
                <span className="text-sm opacity-75">
                  {currentIndex + 1} of {memories.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
