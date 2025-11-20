import React, { useState } from 'react';
import { Memory } from '@/types/memory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, X, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PeopleTaggingProps {
  memories: Memory[];
  onUpdateMemory: (memoryId: string, people: string[]) => void;
}

export const PeopleTagging: React.FC<PeopleTaggingProps> = ({
  memories,
  onUpdateMemory,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [newPerson, setNewPerson] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get all unique people across all memories
  const allPeople = Array.from(
    new Set(memories.flatMap(m => m.people || []))
  ).sort();

  const handleAddPerson = (memory: Memory) => {
    if (newPerson.trim()) {
      const currentPeople = memory.people || [];
      if (!currentPeople.includes(newPerson.trim())) {
        onUpdateMemory(memory.id, [...currentPeople, newPerson.trim()]);
      }
      setNewPerson('');
    }
  };

  const handleRemovePerson = (memory: Memory, personToRemove: string) => {
    const currentPeople = memory.people || [];
    onUpdateMemory(
      memory.id,
      currentPeople.filter(p => p !== personToRemove)
    );
  };

  const handleQuickTag = (memory: Memory, person: string) => {
    const currentPeople = memory.people || [];
    if (!currentPeople.includes(person)) {
      onUpdateMemory(memory.id, [...currentPeople, person]);
    }
  };

  // Get memories for a specific person
  const getMemoriesForPerson = (person: string) => {
    return memories.filter(m => m.people?.includes(person));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold">People Recognition</h2>
      </div>

      {/* People Directory */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Tagged People ({allPeople.length})
        </h3>
        
        {allPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPeople.map((person) => {
              const personMemories = getMemoriesForPerson(person);
              return (
                <Dialog key={person}>
                  <DialogTrigger asChild>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-accent">
                          <AvatarFallback className="text-white font-semibold">
                            {person.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{person}</p>
                          <p className="text-sm text-muted-foreground">
                            {personMemories.length} {personMemories.length === 1 ? 'memory' : 'memories'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-accent">
                          <AvatarFallback className="text-white text-sm">
                            {person.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {person}
                      </DialogTitle>
                      <DialogDescription>
                        Appears in {personMemories.length} {personMemories.length === 1 ? 'memory' : 'memories'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      {personMemories.map((memory) => (
                        <Card key={memory.id} className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={memory.photos[0]?.url}
                              alt={memory.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{memory.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(memory.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm mt-2 line-clamp-2">
                                {memory.narrative}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No people tagged yet. Start tagging people in your memories below!
          </p>
        )}
      </Card>

      {/* Memory Tagging Interface */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Tag People in Memories</h3>
        <div className="space-y-4">
          {memories.map((memory) => (
            <Card key={memory.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={memory.photos[0]?.url}
                  alt={memory.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg">{memory.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(memory.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Current tags */}
                  <div className="flex flex-wrap gap-2">
                    {(memory.people || []).map((person) => (
                      <Badge key={person} variant="secondary" className="gap-1">
                        {person}
                        <button
                          onClick={() => handleRemovePerson(memory, person)}
                          className="ml-1 hover:text-destructive"
                          aria-label={`Remove ${person}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Add new person */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add person name..."
                      value={selectedMemory?.id === memory.id ? newPerson : ''}
                      onChange={(e) => {
                        setSelectedMemory(memory);
                        setNewPerson(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddPerson(memory);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddPerson(memory)}
                      disabled={!newPerson.trim() || selectedMemory?.id !== memory.id}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick tag suggestions */}
                  {allPeople.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-muted-foreground">Quick tag:</span>
                      {allPeople
                        .filter(p => !memory.people?.includes(p))
                        .slice(0, 5)
                        .map((person) => (
                          <Button
                            key={person}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickTag(memory, person)}
                          >
                            + {person}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
