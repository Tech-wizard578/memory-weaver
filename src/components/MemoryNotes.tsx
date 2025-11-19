import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Edit, Save, X, BookOpen } from "lucide-react";

interface MemoryNotesProps {
  notes?: string;
  onSave: (notes: string) => void;
}

export const MemoryNotes = ({ notes = "", onSave }: MemoryNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    onSave(editedNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  return (
    <Card className="p-6 bg-muted/30 border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Your Notes</h3>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            aria-label="Edit notes"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add your personal notes about this memory..."
            className="min-h-[120px] text-base resize-none"
            aria-label="Memory notes"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Notes
            </Button>
            <Button variant="ghost" onClick={handleCancel} size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-base text-foreground leading-relaxed">
          {notes ? (
            <p className="whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-muted-foreground italic">
              Click the edit button to add your personal thoughts about this memory...
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
