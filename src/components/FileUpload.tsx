import { useCallback, useState } from "react";
import { Upload, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onEnterDemoMode: () => void;
}

export const FileUpload = ({ onFilesSelected, onEnterDemoMode }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("image/") ||
          file.type === "application/json" ||
          file.type === "text/plain"
      );

      if (validFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please upload images, JSON, or text files.",
          variant: "destructive",
        });
        return;
      }

      onFilesSelected(validFiles);
    },
    [onFilesSelected, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-10 h-10 text-primary" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2 text-foreground">
              Upload Your Memories
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              Drag and drop photos, text files, or JSON exports here
            </p>
          </div>

          <div className="flex gap-4">
            <label htmlFor="file-input">
              <Button size="lg" className="cursor-pointer text-base" asChild>
                <span>
                  <FileImage className="w-5 h-5 mr-2" />
                  Choose Files
                </span>
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*,.json,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>

            <Button
              variant="outline"
              size="lg"
              onClick={onEnterDemoMode}
              className="text-base"
            >
              <File className="w-5 h-5 mr-2" />
              Try Demo Mode
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Supported: JPG, PNG, JSON, TXT • All data stays on your device
          </p>
        </div>
      </div>
    </div>
  );
};
