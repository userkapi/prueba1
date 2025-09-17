import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Heart,
  Smile,
  Meh,
  Frown,
  Angry,
  Tag,
  Clock,
  TrendingUp,
  BookmarkPlus,
  Bookmark,
  X,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Share2
} from "lucide-react";

export interface Story {
  id: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  category: string;
  tags: string[];
  reactions: { [key: string]: number };
  timestamp: Date;
  anonymous: boolean;
  authorId?: string;
  readTime: number; // estimated reading time in minutes
  wordCount: number;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  moods: number[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  tags: string[];
  minReactions: number;
  maxReadTime: number;
  sortBy: 'relevance' | 'recent' | 'popular' | 'oldest';
  includeOwn: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

interface AdvancedSearchProps {
  stories: Story[];
  onSearch: (results: Story[]) => void;
  compact?: boolean;
}

const CATEGORIES = [
  { value: "ansiedad", label: "Ansiedad", color: "bg-yellow-100 text-yellow-800" },
  { value: "depresion", label: "Depresión", color: "bg-blue-100 text-blue-800" },
  { value: "estres", label: "Estrés", color: "bg-red-100 text-red-800" },
  { value: "relaciones", label: "Relaciones", color: "bg-pink-100 text-pink-800" },
  { value: "trabajo", label: "Trabajo", color: "bg-purple-100 text-purple-800" },
  { value: "familia", label: "Familia", color: "bg-green-100 text-green-800" },
  { value: "autoestima", label: "Autoestima", color: "bg-indigo-100 text-indigo-800" },
  { value: "duelo", label: "Duelo", color: "bg-gray-100 text-gray-800" },
  { value: "adicciones", label: "Adicciones", color: "bg-orange-100 text-orange-800" },
  { value: "trastornos", label: "Trastornos", color: "bg-rose-100 text-rose-800" },
  { value: "logros", label: "Logros", color: "bg-emerald-100 text-emerald-800" },
  { value: "general", label: "General", color: "bg-slate-100 text-slate-800" }
];

const MOOD_OPTIONS = [
  { value: 1, label: "Muy mal", icon: Angry, color: "text-red-500" },
  { value: 2, label: "Mal", icon: Frown, color: "text-orange-500" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500" },
  { value: 4, label: "Bien", icon: Smile, color: "text-green-500" },
  { value: 5, label: "Excelente", icon: Heart, color: "text-emerald-500" },
];

const QUICK_FILTERS = [
  { label: "Última semana", action: () => ({ from: subWeeks(new Date(), 1), to: new Date() }) },
  { label: "Último mes", action: () => ({ from: subMonths(new Date(), 1), to: new Date() }) },
  { label: "Más populares", sortBy: "popular" as const },
  { label: "Más recientes", sortBy: "recent" as const },
  { label: "Solo positivas", moods: [4, 5] },
  { label: "Solo negativas", moods: [1, 2] },
];

export default function AdvancedSearch({ stories, onSearch, compact = false }: AdvancedSearchProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    moods: [],
    dateRange: {},
    tags: [],
    minReactions: 0,
    maxReadTime: 10,
    sortBy: "relevance",
    includeOwn: true
  });
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Load saved searches
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`tioskap_searches_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          filters: {
            ...s.filters,
            dateRange: {
              from: s.filters.dateRange.from ? new Date(s.filters.dateRange.from) : undefined,
              to: s.filters.dateRange.to ? new Date(s.filters.dateRange.to) : undefined
            }
          }
        })));
      }
    }
  }, [user]);

  // Save searches to localStorage
  useEffect(() => {
    if (user && savedSearches.length > 0) {
      localStorage.setItem(`tioskap_searches_${user.id}`, JSON.stringify(savedSearches));
    }
  }, [savedSearches, user]);

  // Extract tags from all stories
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    stories.forEach(story => {
      story.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [stories]);

  // Perform search
  const searchResults = useMemo(() => {
    let filtered = stories.filter(story => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!story.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(story.category)) {
          return false;
        }
      }

      // Mood filter
      if (filters.moods.length > 0) {
        if (!filters.moods.includes(story.mood)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const storyDate = story.timestamp;
        if (filters.dateRange.from && storyDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && storyDate > filters.dateRange.to) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => story.tags.includes(tag));
        if (!hasTag) {
          return false;
        }
      }

      // Min reactions filter
      const totalReactions = Object.values(story.reactions).reduce((sum, count) => sum + count, 0);
      if (totalReactions < filters.minReactions) {
        return false;
      }

      // Max read time filter
      if (story.readTime > filters.maxReadTime) {
        return false;
      }

      // Include own stories filter
      if (!filters.includeOwn && story.authorId === user?.id) {
        return false;
      }

      return true;
    });

    // Sort results
    switch (filters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case "popular":
        filtered.sort((a, b) => {
          const aReactions = Object.values(a.reactions).reduce((sum, count) => sum + count, 0);
          const bReactions = Object.values(b.reactions).reduce((sum, count) => sum + count, 0);
          return bReactions - aReactions;
        });
        break;
      case "relevance":
      default:
        // Relevance scoring based on query match, recency, and popularity
        if (filters.query) {
          filtered.sort((a, b) => {
            const query = filters.query.toLowerCase();
            const aScore = calculateRelevanceScore(a, query);
            const bScore = calculateRelevanceScore(b, query);
            return bScore - aScore;
          });
        }
        break;
    }

    return filtered;
  }, [stories, filters, user]);

  // Update search results
  useEffect(() => {
    onSearch(searchResults);
  }, [searchResults, onSearch]);

  const calculateRelevanceScore = (story: Story, query: string): number => {
    let score = 0;
    const content = story.content.toLowerCase();
    
    // Exact phrase match
    if (content.includes(query)) {
      score += 10;
    }
    
    // Word matches
    const queryWords = query.split(' ');
    queryWords.forEach(word => {
      if (content.includes(word)) {
        score += 3;
      }
    });
    
    // Recency bonus (newer stories get higher score)
    const daysSincePosted = (Date.now() - story.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - daysSincePosted * 0.1);
    
    // Popularity bonus
    const reactions = Object.values(story.reactions).reduce((sum, count) => sum + count, 0);
    score += Math.min(reactions * 0.5, 5);
    
    return score;
  };

  const applyQuickFilter = (quickFilter: any) => {
    setFilters(prev => ({
      ...prev,
      ...(quickFilter.action ? { dateRange: quickFilter.action() } : {}),
      ...(quickFilter.sortBy ? { sortBy: quickFilter.sortBy } : {}),
      ...(quickFilter.moods ? { moods: quickFilter.moods } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      categories: [],
      moods: [],
      dateRange: {},
      tags: [],
      minReactions: 0,
      maxReadTime: 10,
      sortBy: "relevance",
      includeOwn: true
    });
  };

  const saveSearch = () => {
    if (!user || !filters.query) return;

    const name = prompt("Nombre para esta búsqueda:");
    if (!name) return;

    const newSearch: SavedSearch = {
      id: `search_${Date.now()}`,
      name,
      filters: { ...filters },
      createdAt: new Date()
    };

    setSavedSearches(prev => [newSearch, ...prev].slice(0, 10)); // Keep only 10 saved searches
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const hasActiveFilters = filters.query || filters.categories.length > 0 || filters.moods.length > 0 || 
    filters.dateRange.from || filters.dateRange.to || filters.tags.length > 0 || 
    filters.minReactions > 0 || filters.maxReadTime < 10 || !filters.includeOwn;

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar historias..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10"
            />
          </div>
          <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Búsqueda Avanzada</DialogTitle>
                <DialogDescription>
                  Encuentra exactamente lo que buscas con filtros detallados
                </DialogDescription>
              </DialogHeader>
              <AdvancedSearchForm 
                filters={filters}
                setFilters={setFilters}
                availableTags={availableTags}
                onSave={saveSearch}
                onClear={clearFilters}
                savedSearches={savedSearches}
                onLoadSaved={loadSavedSearch}
                onDeleteSaved={deleteSavedSearch}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(filter)}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filtros:</span>
            {filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="text-xs">
                {CATEGORIES.find(c => c.value === category)?.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    categories: prev.categories.filter(c => c !== category) 
                  }))}
                />
              </Badge>
            ))}
            {filters.moods.map(mood => (
              <Badge key={mood} variant="secondary" className="text-xs">
                {MOOD_OPTIONS.find(m => m.value === mood)?.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    moods: prev.moods.filter(m => m !== mood) 
                  }))}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-600"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {searchResults.length} historias encontradas
          {filters.query && ` para "${filters.query}"`}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Búsqueda Avanzada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdvancedSearchForm 
          filters={filters}
          setFilters={setFilters}
          availableTags={availableTags}
          onSave={saveSearch}
          onClear={clearFilters}
          savedSearches={savedSearches}
          onLoadSaved={loadSavedSearch}
          onDeleteSaved={deleteSavedSearch}
        />
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{searchResults.length} historias encontradas</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Advanced Search Form Component
interface AdvancedSearchFormProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters | ((prev: SearchFilters) => SearchFilters)) => void;
  availableTags: string[];
  onSave: () => void;
  onClear: () => void;
  savedSearches: SavedSearch[];
  onLoadSaved: (search: SavedSearch) => void;
  onDeleteSaved: (id: string) => void;
}

function AdvancedSearchForm({
  filters,
  setFilters,
  availableTags,
  onSave,
  onClear,
  savedSearches,
  onLoadSaved,
  onDeleteSaved
}: AdvancedSearchFormProps) {
  return (
    <div className="space-y-6">
      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <Label>Búsquedas guardadas</Label>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map(search => (
              <div key={search.id} className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadSaved(search)}
                  className="text-xs"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  {search.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteSaved(search.id)}
                  className="h-6 w-6 p-0 text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Query */}
      <div className="space-y-2">
        <Label>Buscar texto</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Palabras clave, frases..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categorías</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CATEGORIES.map(category => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={filters.categories.includes(category.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({ ...prev, categories: [...prev.categories, category.value] }));
                  } else {
                    setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category.value) }));
                  }
                }}
              />
              <Label htmlFor={category.value} className="text-sm">{category.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div className="space-y-2">
        <Label>Estado de ánimo</Label>
        <div className="flex gap-2">
          {MOOD_OPTIONS.map(mood => {
            const Icon = mood.icon;
            return (
              <Button
                key={mood.value}
                variant={filters.moods.includes(mood.value) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (filters.moods.includes(mood.value)) {
                    setFilters(prev => ({ ...prev, moods: prev.moods.filter(m => m !== mood.value) }));
                  } else {
                    setFilters(prev => ({ ...prev, moods: [...prev.moods, mood.value] }));
                  }
                }}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{mood.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <Label>Rango de fechas</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {filters.dateRange.from ? format(filters.dateRange.from, 'dd MMM', { locale: es }) : 'Desde'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={(date) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, from: date || undefined } 
                }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {filters.dateRange.to ? format(filters.dateRange.to, 'dd MMM', { locale: es }) : 'Hasta'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={(date) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, to: date || undefined } 
                }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mínimo de reacciones: {filters.minReactions}</Label>
          <Slider
            value={[filters.minReactions]}
            onValueChange={([value]) => setFilters(prev => ({ ...prev, minReactions: value }))}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Tiempo de lectura máximo: {filters.maxReadTime} min</Label>
          <Slider
            value={[filters.maxReadTime]}
            onValueChange={([value]) => setFilters(prev => ({ ...prev, maxReadTime: value }))}
            max={20}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort and Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="popular">Más populares</SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Opciones</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeOwn"
              checked={filters.includeOwn}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, includeOwn: checked as boolean }))}
            />
            <Label htmlFor="includeOwn" className="text-sm">Incluir mis propias historias</Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onClear}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onSave} disabled={!filters.query}>
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Guardar búsqueda
          </Button>
        </div>
      </div>
    </div>
  );
}
