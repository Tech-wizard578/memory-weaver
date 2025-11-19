import { Memory } from "@/types/memory";
import { useMemo } from "react";
import { format } from "date-fns";

interface TimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

export const Timeline = ({ memories, onMemoryClick }: TimelineProps) => {
  const groupedMemories = useMemo(() => {
    const groups: { [key: string]: Memory[] } = {};
    
    memories.forEach((memory) => {
      const year = format(memory.date, "yyyy");
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(memory);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [memories]);

  return (
    <div className="max-w-4xl mx-auto">
      {groupedMemories.map(([year, yearMemories]) => (
        <div key={year} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-primary">{year}</h2>
          <div className="space-y-6 border-l-2 border-secondary/30 pl-8 ml-4">
            {yearMemories.map((memory) => (
              <div
                key={memory.id}
                className="relative cursor-pointer group"
                onClick={() => onMemoryClick(memory)}
              >
                <div className="absolute -left-[2.6rem] top-3 w-5 h-5 rounded-full bg-secondary border-4 border-background group-hover:scale-125 transition-transform duration-300" />
                
                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 memory-glow">
                  <div className="flex gap-4">
                    {memory.photos[0] && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={memory.photos[0].url}
                          alt={memory.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {memory.title}
                      </h3>
                      <p className="text-base text-muted-foreground mb-2">
                        {format(memory.date, "MMMM d")}
                      </p>
                      <p className="text-base text-foreground line-clamp-2">
                        {memory.narrative}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
