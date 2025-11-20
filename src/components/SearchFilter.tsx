import React, { useState, useMemo } from 'react';
import { Memory } from '@/types/memory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter, Calendar, MapPin, Users, Heart } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface SearchFilterProps {
  memories: Memory[];
  onFilterChange: (filtered: Memory[]) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  memories,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique values for filters
  const years = useMemo(() => {
    const yearSet = new Set(
      memories.map(m => new Date(m.date).getFullYear().toString())
    );
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [memories]);

  const locations = useMemo(() => {
    const locationSet = new Set(
      memories.map(m => m.location).filter(Boolean) as string[]
    );
    return Array.from(locationSet).sort();
  }, [memories]);

  const people = useMemo(() => {
    const peopleSet = new Set(memories.flatMap(m => m.people || []));
    return Array.from(peopleSet).sort();
  }, [memories]);

  const emotions = useMemo(() => {
    const emotionSet = new Set(memories.flatMap(m => m.emotions || []));
    return Array.from(emotionSet).sort();
  }, [memories]);

  const categories = useMemo(() => {
    const categorySet = new Set(
      memories.map(m => m.category).filter(Boolean) as string[]
    );
    return Array.from(categorySet).sort();
  }, [memories]);

  // Filter memories
  const filteredMemories = useMemo(() => {
    let filtered = [...memories];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(query) ||
          m.narrative.toLowerCase().includes(query) ||
          m.location?.toLowerCase().includes(query) ||
          m.people?.some(p => p.toLowerCase().includes(query)) ||
          m.userNotes?.toLowerCase().includes(query)
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(
        m => new Date(m.date).getFullYear().toString() === selectedYear
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(m => m.location === selectedLocation);
    }

    // Person filter
    if (selectedPerson !== 'all') {
      filtered = filtered.filter(m => m.people?.includes(selectedPerson));
    }

    // Emotion filter
    if (selectedEmotion !== 'all') {
      filtered = filtered.filter(m => m.emotions?.includes(selectedEmotion));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    return filtered;
  }, [
    memories,
    searchQuery,
    selectedYear,
    selectedLocation,
    selectedPerson,
    selectedEmotion,
    selectedCategory,
  ]);

  // Notify parent of filter changes
  React.useEffect(() => {
    onFilterChange(filteredMemories);
  }, [filteredMemories, onFilterChange]);

  const hasActiveFilters =
    searchQuery.trim() ||
    selectedYear !== 'all' ||
    selectedLocation !== 'all' ||
    selectedPerson !== 'all' ||
    selectedEmotion !== 'all' ||
    selectedCategory !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedLocation('all');
    setSelectedPerson('all');
    setSelectedEmotion('all');
    setSelectedCategory('all');
  };

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedYear !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (selectedPerson !== 'all' ? 1 : 0) +
    (selectedEmotion !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search memories, narratives, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto p-0 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <Separator />

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Person Filter */}
              {people.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Person
                  </label>
                  <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                    <SelectTrigger>
                      <SelectValue placeholder="All people" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All people</SelectItem>
                      {people.map(person => (
                        <SelectItem key={person} value={person}>
                          {person}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Emotion Filter */}
              {emotions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Emotion
                  </label>
                  <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                    <SelectTrigger>
                      <SelectValue placeholder="All emotions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All emotions</SelectItem>
                      {emotions.map(emotion => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {searchQuery.trim() && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedYear !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Year: {selectedYear}
              <button
                onClick={() => setSelectedYear('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedLocation !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Location: {selectedLocation}
              <button
                onClick={() => setSelectedLocation('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedPerson !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Person: {selectedPerson}
              <button
                onClick={() => setSelectedPerson('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedEmotion !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Emotion: {selectedEmotion}
              <button
                onClick={() => setSelectedEmotion('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredMemories.length} of {memories.length} memories
      </div>
    </div>
  );
};
