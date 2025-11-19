import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { MemoryCard } from "@/components/MemoryCard";
import { MemoryViewer } from "@/components/MemoryViewer";
import { Timeline } from "@/components/Timeline";
import { AmbientMode } from "@/components/AmbientMode";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Memory } from "@/types/memory";
import { getMockMemories } from "@/services/mockDataService";
import { exportMemoryBookPDF } from "@/services/pdfExportService";
import { Brain, Upload, Clock, Heart, ArrowRight, Tv, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "landing" | "upload" | "memories" | "timeline";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [ambientModeOpen, setAmbientModeOpen] = useState(false);
  const { toast } = useToast();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleEnterDemoMode = () => {
    const mockMemories = getMockMemories();
    setMemories(mockMemories);
    setViewMode("memories");
  };

  const handleFilesSelected = (files: File[]) => {
    // TODO: Implement actual file processing with AI
    // For now, show demo data
    handleEnterDemoMode();
  };

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setViewerOpen(true);
  };

  const currentMemoryIndex = selectedMemory
    ? memories.findIndex((m) => m.id === selectedMemory.id)
    : -1;

  const handleNextMemory = () => {
    if (currentMemoryIndex < memories.length - 1) {
      setSelectedMemory(memories[currentMemoryIndex + 1]);
    }
  };

  const handlePreviousMemory = () => {
    if (currentMemoryIndex > 0) {
      setSelectedMemory(memories[currentMemoryIndex - 1]);
    }
  };

  const handleUpdateNotes = (memoryId: string, notes: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, userNotes: notes } : m))
    );
    if (selectedMemory?.id === memoryId) {
      setSelectedMemory({ ...selectedMemory, userNotes: notes });
    }
    toast({
      title: "Notes saved",
      description: "Your personal notes have been saved.",
    });
  };

  const handleExportPDF = async () => {
    try {
      await exportMemoryBookPDF(memories);
      toast({
        title: "Memory book exported",
        description: "Your PDF has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (viewMode === "landing") {
    return (
      <div className="min-h-screen">
        {/* Header with dark mode toggle */}
        <header className="absolute top-4 right-4 z-50">
          <DarkModeToggle />
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-6 animate-gentleFloat">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Neural Pattern Recovery
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Reconstruct precious memories from digital footprints. Using AI to help those
              experiencing memory loss reconnect with their past through photos and stories.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setViewMode("upload")}
                className="text-lg px-8 py-6 h-auto"
              >
                <Upload className="w-6 h-6 mr-2" />
                Upload Memories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleEnterDemoMode}
                className="text-lg px-8 py-6 h-auto"
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center mb-12 text-foreground">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-3 text-foreground">Upload Your Photos</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Upload photos, location data, or any digital memories. All processing
                  happens securely on your device.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-foreground">AI Analysis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our AI analyzes photos to detect people, places, emotions, and creates
                  meaningful narratives from your memories.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="mb-3 text-foreground">Relive Moments</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Browse your memories in a beautiful timeline, with AI-generated stories
                  that bring each moment back to life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Notice */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="mb-4 text-foreground">Your Privacy Matters</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              All data processing happens locally or through secure APIs. Your photos and
              memories are never permanently stored without your permission.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (viewMode === "upload") {
    return (
      <div className="min-h-screen py-12 px-4">
        <header className="absolute top-4 right-4">
          <DarkModeToggle />
        </header>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4 text-foreground">Upload Your Memories</h1>
            <p className="text-xl text-muted-foreground">
              Upload photos or digital footprints to begin reconstructing your memories
            </p>
          </div>

          <FileUpload
            onFilesSelected={handleFilesSelected}
            onEnterDemoMode={handleEnterDemoMode}
          />

          <div className="text-center mt-8">
            <Button variant="ghost" onClick={() => setViewMode("landing")} className="text-base">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "timeline") {
    return (
      <div className="min-h-screen py-12 px-4">
        <header className="absolute top-4 right-4">
          <DarkModeToggle />
        </header>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-foreground">Memory Timeline</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setAmbientModeOpen(true)} 
                className="text-base"
                aria-label="Start ambient mode"
              >
                <Tv className="w-5 h-5 mr-2" />
                Ambient Mode
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF} 
                className="text-base"
                aria-label="Export as PDF"
              >
                <Download className="w-5 h-5 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => setViewMode("memories")} className="text-base">
                Grid View
              </Button>
            </div>
          </div>

          <Timeline memories={memories} onMemoryClick={handleMemoryClick} />
        </div>

        <MemoryViewer
          memory={selectedMemory}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onNext={handleNextMemory}
          onPrevious={handlePreviousMemory}
          hasNext={currentMemoryIndex < memories.length - 1}
          hasPrevious={currentMemoryIndex > 0}
          onUpdateNotes={handleUpdateNotes}
        />

        <AmbientMode
          memories={memories}
          isOpen={ambientModeOpen}
          onClose={() => setAmbientModeOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <header className="absolute top-4 right-4">
        <DarkModeToggle />
      </header>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="mb-2 text-foreground">Your Memories</h1>
            <p className="text-lg text-muted-foreground">
              {memories.length} memories reconstructed
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAmbientModeOpen(true)}
              className="text-base"
              aria-label="Start ambient mode"
            >
              <Tv className="w-5 h-5 mr-2" />
              Ambient
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="text-base"
              aria-label="Export as PDF"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode("timeline")}
              className="text-base"
            >
              <Clock className="w-5 h-5 mr-2" />
              Timeline
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {memories.map((memory) => (
            <div key={memory.id} className="animate-slideUp">
              <MemoryCard memory={memory} onClick={() => handleMemoryClick(memory)} />
            </div>
          ))}
        </div>
      </div>

      <MemoryViewer
        memory={selectedMemory}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNext={handleNextMemory}
        onPrevious={handlePreviousMemory}
        hasNext={currentMemoryIndex < memories.length - 1}
        hasPrevious={currentMemoryIndex > 0}
        onUpdateNotes={handleUpdateNotes}
      />

      <AmbientMode
        memories={memories}
        isOpen={ambientModeOpen}
        onClose={() => setAmbientModeOpen(false)}
      />
    </div>
  );
};

export default Index;
