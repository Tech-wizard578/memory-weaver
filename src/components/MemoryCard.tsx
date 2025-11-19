import { Memory } from "@/types/memory";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Heart } from "lucide-react";
import { format } from "date-fns";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg memory-glow bg-card border-border"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        {memory.photos[0] && (
          <img
            src={memory.photos[0].url}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 text-foreground">{memory.title}</h3>
        <p className="text-lg text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {memory.narrative}
        </p>
        <div className="flex flex-wrap gap-4 text-base text-muted-foreground">
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
          {memory.emotions && memory.emotions.length > 0 && (
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              <span>{memory.emotions[0]}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
