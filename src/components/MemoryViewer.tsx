import { Memory } from "@/types/memory";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface MemoryViewerProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const MemoryViewer = ({
  memory,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: MemoryViewerProps) => {
  if (!memory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-card">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="aspect-video overflow-hidden bg-muted">
            {memory.photos[0] && (
              <img
                src={memory.photos[0].url}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-8">
            <div className="flex gap-4 text-base text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{format(memory.date, "MMMM d, yyyy")}</span>
              </div>
              {memory.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>

            <h2 className="text-4xl font-semibold mb-6 text-foreground">
              {memory.title}
            </h2>

            <p className="text-xl text-foreground leading-relaxed mb-6">
              {memory.narrative}
            </p>

            {memory.emotions && memory.emotions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {memory.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-base"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between p-4 border-t border-border">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="text-base"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Memory
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={!hasNext}
              className="text-base"
            >
              Next Memory
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
