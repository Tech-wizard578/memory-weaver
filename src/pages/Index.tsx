import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { MemoryCard } from "@/components/MemoryCard";
import { MemoryViewer } from "@/components/MemoryViewer";
import { Timeline } from "@/components/Timeline";
import { AmbientMode } from "@/components/AmbientMode";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MapView } from "@/components/MapView";
import { Statistics } from "@/components/Statistics";
import { PeopleTagging } from "@/components/PeopleTagging";
import { SearchFilter } from "@/components/SearchFilter";
import { Memory } from "@/types/memory";
import { getMockMemories } from "@/services/mockDataService";
import { exportMemoryBookPDF } from "@/services/pdfExportService";
import { 
  Brain, Upload, Clock, Heart, ArrowRight, Tv, Download, 
  Map, BarChart3, Users, Grid3X3, Menu, X, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type ViewMode = "landing" | "upload" | "memories" | "timeline" | "map" | "statistics" | "people";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [ambientModeOpen, setAmbientModeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Set filtered memories when memories change
  useEffect(() => {
    setFilteredMemories(memories);
  }, [memories]);

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
    ? filteredMemories.findIndex((m) => m.id === selectedMemory.id)
    : -1;

  const handleNextMemory = () => {
    if (currentMemoryIndex < filteredMemories.length - 1) {
      setSelectedMemory(filteredMemories[currentMemoryIndex + 1]);
    }
  };

  const handlePreviousMemory = () => {
    if (currentMemoryIndex > 0) {
      setSelectedMemory(filteredMemories[currentMemoryIndex - 1]);
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

  const handleUpdatePeople = (memoryId: string, people: string[]) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, people } : m))
    );
    toast({
      title: "People updated",
      description: "Tagged people have been updated.",
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

  const navigationItems = [
    { icon: Grid3X3, label: "Grid View", mode: "memories" as ViewMode },
    { icon: Clock, label: "Timeline", mode: "timeline" as ViewMode },
    { icon: Map, label: "Map View", mode: "map" as ViewMode },
    { icon: BarChart3, label: "Statistics", mode: "statistics" as ViewMode },
    { icon: Users, label: "People", mode: "people" as ViewMode },
  ];

  const NavigationSidebar = ({ mobile = false }) => (
    <div className="space-y-2 p-4">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      {navigationItems.map((item) => (
        <Button
          key={item.mode}
          variant={viewMode === item.mode ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => {
            setViewMode(item.mode);
            if (mobile) setSidebarOpen(false);
          }}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Button>
      ))}
      <div className="pt-4 mt-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setAmbientModeOpen(true)}
        >
          <Tv className="w-4 h-4" />
          Ambient Mode
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 mt-2"
          onClick={handleExportPDF}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );

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

  // Main app layout with sidebar (for all other views)
  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card/50">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Neural Recovery</h1>
            </div>
            <p className="text-sm text-muted-foreground">{memories.length} memories</p>
          </div>
          <NavigationSidebar />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Neural Recovery</h1>
            </div>
            <p className="text-sm text-muted-foreground">{memories.length} memories</p>
          </div>
          <NavigationSidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">
                {viewMode === "memories" && "Grid View"}
                {viewMode === "timeline" && "Timeline"}
                {viewMode === "map" && "Map View"}
                {viewMode === "statistics" && "Statistics"}
                {viewMode === "people" && "People Recognition"}
              </h2>
            </div>
            <DarkModeToggle />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {/* Collaborative Mode Notice */}
          {viewMode === "people" && (
            <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Want Collaborative Features?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enable Lovable Cloud to unlock collaborative mode where family members can add
                    context, corrections, and contribute to shared memory collections with real-time sync.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cloud features include: user authentication, database storage, and real-time collaboration.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Search/Filter - Show on memories, timeline, and map views */}
          {(viewMode === "memories" || viewMode === "timeline" || viewMode === "map") && (
            <div className="mb-6">
              <SearchFilter
                memories={memories}
                onFilterChange={setFilteredMemories}
              />
            </div>
          )}

          {/* View-specific content */}
          {viewMode === "memories" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="animate-slideUp">
                  <MemoryCard memory={memory} onClick={() => handleMemoryClick(memory)} />
                </div>
              ))}
              {filteredMemories.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No memories match your filters
                </div>
              )}
            </div>
          )}

          {viewMode === "timeline" && (
            <Timeline memories={filteredMemories} onMemoryClick={handleMemoryClick} />
          )}

          {viewMode === "map" && (
            <MapView memories={filteredMemories} onMemoryClick={handleMemoryClick} />
          )}

          {viewMode === "statistics" && (
            <Statistics memories={memories} />
          )}

          {viewMode === "people" && (
            <PeopleTagging memories={memories} onUpdateMemory={handleUpdatePeople} />
          )}
        </div>
      </main>

      {/* Memory Viewer Dialog */}
      <MemoryViewer
        memory={selectedMemory}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNext={handleNextMemory}
        onPrevious={handlePreviousMemory}
        hasNext={currentMemoryIndex < filteredMemories.length - 1}
        hasPrevious={currentMemoryIndex > 0}
        onUpdateNotes={handleUpdateNotes}
      />

      {/* Ambient Mode */}
      <AmbientMode
        memories={memories}
        isOpen={ambientModeOpen}
        onClose={() => setAmbientModeOpen(false)}
      />
    </div>
  );
};

export default Index;
