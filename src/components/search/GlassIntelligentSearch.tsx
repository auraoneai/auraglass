"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url?: string;
  score: number;
  metadata?: SearchResultMetadata;
  highlights?: {
    title?: string[];
    description?: string[];
  };
}

export interface SearchResultMetadata extends Record<string, unknown> {
  rating?: number;
  date?: string | number | Date;
}

export interface SearchDateRange {
  start: string | number | Date;
  end: string | number | Date;
}

export type SearchFilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | SearchDateRange
  | null
  | undefined;

export type SearchFilters = Record<string, SearchFilterValue>;

export interface SearchFilter {
  id: string;
  name: string;
  type: "select" | "multiselect" | "range" | "date" | "boolean";
  options?: Array<{ value: string; label: string; count?: number }>;
  range?: { min: number; max: number; step?: number };
  value?: SearchFilterValue;
}

interface QueryEntity {
  type: string;
  value: string;
}

interface QueryAnalysis {
  intent: string;
  entities: QueryEntity[];
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "category" | "tag" | "filter";
  category?: string;
  count?: number;
}

export interface IntelligentSearchProps {
  data?: SearchResult[];
  onSearch?: (query: string, filters: SearchFilters) => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  enableNLP?: boolean;
  enableVoiceSearch?: boolean;
  maxResults?: number;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

const isStringArray = (value: SearchFilterValue): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isSearchDateRange = (
  value: SearchFilterValue
): value is SearchDateRange =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "start" in value &&
  "end" in value;

const getStringFilterValues = (value: SearchFilterValue): string[] =>
  isStringArray(value) ? value : [];

const getNumericFilterValue = (
  value: SearchFilterValue,
  fallback: number
): number => (typeof value === "number" ? value : fallback);

// NLP Query Analysis
const analyzeQuery = (query: string): QueryAnalysis => {
  const lowercaseQuery = query.toLowerCase();

  // Intent detection
  let intent = "search";
  if (
    lowercaseQuery.includes("find") ||
    lowercaseQuery.includes("show") ||
    lowercaseQuery.includes("get")
  ) {
    intent = "retrieve";
  } else if (
    lowercaseQuery.includes("compare") ||
    lowercaseQuery.includes("vs") ||
    lowercaseQuery.includes("versus")
  ) {
    intent = "compare";
  } else if (
    lowercaseQuery.includes("best") ||
    lowercaseQuery.includes("top") ||
    lowercaseQuery.includes("recommend")
  ) {
    intent = "recommend";
  } else if (
    lowercaseQuery.includes("help") ||
    lowercaseQuery.includes("how to") ||
    lowercaseQuery.includes("tutorial")
  ) {
    intent = "help";
  }

  // Entity extraction (simplified)
  const entities: QueryEntity[] = [];

  // Date entities
  const dateMatches = query.match(
    /(\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|today|yesterday|last week|this month)/gi
  );
  dateMatches?.forEach((match) => {
    entities.push({ type: "date", value: match });
  });

  // Number entities
  const numberMatches = query.match(/\b\d+(?:\.\d+)?\b/g);
  numberMatches?.forEach((match) => {
    entities.push({ type: "number", value: match });
  });

  // Category entities (simplified)
  const categories = [
    "product",
    "service",
    "article",
    "document",
    "image",
    "video",
    "user",
    "project",
  ];
  categories.forEach((category) => {
    if (lowercaseQuery.includes(category)) {
      entities.push({ type: "category", value: category });
    }
  });

  // Sentiment analysis (simplified)
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "best",
    "love",
    "fantastic",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "worst",
    "hate",
    "horrible",
    "useless",
  ];

  const hasPositive = positiveWords.some((word) =>
    lowercaseQuery.includes(word)
  );
  const hasNegative = negativeWords.some((word) =>
    lowercaseQuery.includes(word)
  );

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (hasPositive && !hasNegative) sentiment = "positive";
  else if (hasNegative && !hasPositive) sentiment = "negative";

  // Extract keywords (remove stop words)
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
  ];
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

  return { intent, entities, sentiment, keywords };
};

// Advanced search algorithm with NLP
const performIntelligentSearch = (
  query: string,
  data: SearchResult[],
  filters: SearchFilters,
  enableNLP: boolean = true
): SearchResult[] => {
  if (!query.trim() && Object.keys(filters).length === 0) {
    return data;
  }

  const analysis = enableNLP ? analyzeQuery(query) : null;
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  return data
    .map((item) => {
      let score = 0;

      // Text matching with different weights
      const titleMatch = searchTerms.reduce((acc, term) => {
        return acc + (item.title.toLowerCase().includes(term) ? 1 : 0);
      }, 0);

      const descriptionMatch = searchTerms.reduce((acc, term) => {
        return acc + (item.description.toLowerCase().includes(term) ? 0.5 : 0);
      }, 0);

      const tagMatch = searchTerms.reduce((acc, term) => {
        return (
          acc +
          item.tags.filter((tag) => tag.toLowerCase().includes(term)).length *
            0.7
        );
      }, 0);

      score = titleMatch * 3 + descriptionMatch + tagMatch;

      // NLP-based scoring boost
      if (analysis && enableNLP) {
        // Intent-based scoring
        if (analysis.intent === "recommend" && item.metadata?.rating) {
          score += item.metadata.rating * 0.5;
        }

        // Entity matching
        analysis.entities.forEach((entity) => {
          if (
            entity.type === "category" &&
            item.category.toLowerCase().includes(entity.value)
          ) {
            score += 1;
          }
        });

        // Keyword density bonus
        const keywordMatches = analysis.keywords.filter(
          (keyword) =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        ).length;
        score += keywordMatches * 0.3;
      }

      // Filter matching
      let passesFilters = true;
      Object.entries(filters).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return;

        switch (key) {
          case "category":
            if (isStringArray(value)) {
              passesFilters = passesFilters && value.includes(item.category);
            } else if (typeof value === "string") {
              passesFilters = passesFilters && item.category === value;
            }
            break;
          case "tags":
            if (isStringArray(value)) {
              passesFilters =
                passesFilters && value.some((tag) => item.tags.includes(tag));
            }
            break;
          case "dateRange":
            if (item.metadata?.date && isSearchDateRange(value)) {
              const itemDate = new Date(item.metadata.date);
              const startDate = new Date(value.start);
              const endDate = new Date(value.end);
              passesFilters =
                passesFilters && itemDate >= startDate && itemDate <= endDate;
            }
            break;
          case "rating":
            if (item.metadata?.rating && typeof value === "number") {
              passesFilters = passesFilters && item.metadata.rating >= value;
            }
            break;
        }
      });

      if (!passesFilters) {
        score = 0;
      }

      // Generate highlights
      const highlights: { title?: string[]; description?: string[] } = {};
      if (score > 0) {
        searchTerms.forEach((term) => {
          if (item.title.toLowerCase().includes(term)) {
            if (!highlights.title) highlights.title = [];
            highlights.title.push(term);
          }
          if (item.description.toLowerCase().includes(term)) {
            if (!highlights.description) highlights.description = [];
            highlights.description.push(term);
          }
        });
      }

      return {
        ...item,
        score,
        highlights,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
};

// Generate search suggestions
const generateSuggestions = (
  query: string,
  data: SearchResult[],
  recentSearches: string[]
): SearchSuggestion[] => {
  const suggestions: SearchSuggestion[] = [];
  if (!data || data.length === 0) return suggestions;

  const lowercaseQuery = query.toLowerCase();

  // Recent searches
  recentSearches
    .filter((search) => search.toLowerCase().includes(lowercaseQuery))
    .slice(0, 3)
    .forEach((search) => {
      suggestions.push({
        text: search,
        type: "query",
      });
    });

  // Category suggestions
  const categories = [...new Set(data.map((item) => item.category))];
  categories
    .filter((category) => category.toLowerCase().includes(lowercaseQuery))
    .slice(0, 3)
    .forEach((category) => {
      const count = data.filter((item) => item.category === category).length;
      suggestions.push({
        text: category,
        type: "category",
        category: "Categories",
        count,
      });
    });

  // Tag suggestions
  const allTags = data.flatMap((item) => item.tags);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  Object.entries(tagCounts)
    .filter(([tag]) => tag.toLowerCase().includes(lowercaseQuery))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([tag, count]) => {
      suggestions.push({
        text: tag,
        type: "tag",
        category: "Tags",
        count,
      });
    });

  return suggestions;
};

export const GlassIntelligentSearch: React.FC<IntelligentSearchProps> = ({
  data = [],
  onSearch,
  onResultClick,
  placeholder = "Search with natural language...",
  showFilters = true,
  showSuggestions = true,
  enableNLP = true,
  enableVoiceSearch = false,
  maxResults = 50,
  className,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchAnalysis, setSearchAnalysis] = useState<QueryAnalysis | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionRefs = useRef<(HTMLElement | null)[]>([]);
  const isMountedRef = useRef(false);
  const isInitialMountRef = useRef(true);

  const prefersReducedMotion = useReducedMotion();

  // Generate available filters from data - memoize to prevent unnecessary recalculations
  const availableFilters = useMemo((): SearchFilter[] => {
    if (!data || data.length === 0) return [];

    const categories = [...new Set(data.map((item) => item.category))];
    const allTags = data.flatMap((item) => item?.tags || []);
    const tagCounts = allTags.reduce(
      (acc, tag) => {
        if (tag) {
          acc[tag] = (acc[tag] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ value: tag, label: tag, count }));

    return [
      {
        id: "category",
        name: "Category",
        type: "multiselect",
        options: categories.map((cat) => ({
          value: cat,
          label: cat,
          count: data.filter((item) => item.category === cat).length,
        })),
      },
      {
        id: "tags",
        name: "Tags",
        type: "multiselect",
        options: topTags,
      },
      {
        id: "rating",
        name: "Minimum Rating",
        type: "range",
        range: { min: 0, max: 5, step: 0.5 },
      },
    ];
  }, [data]);

  // Set initial mount flag and cleanup before the dependent effects run.
  useEffect(() => {
    isMountedRef.current = true;
    isInitialMountRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search
  const performSearch = useCallback(
    (searchQuery: string, currentFilters: SearchFilters) => {
      if (!isMountedRef.current) return;

      setIsSearching(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;

        // Don't search if query is empty and filters are empty
        if (!searchQuery.trim() && Object.keys(currentFilters).length === 0) {
          setResults([]);
          setIsSearching(false);
          return;
        }

        const searchResults = performIntelligentSearch(
          searchQuery,
          data,
          currentFilters,
          enableNLP
        );
        const limitedResults = searchResults.slice(0, maxResults);

        setResults(limitedResults);
        setIsSearching(false);

        if (enableNLP && searchQuery.trim()) {
          setSearchAnalysis(analyzeQuery(searchQuery));
        }

        onSearch?.(searchQuery, currentFilters);
      }, 300);
    },
    [data, enableNLP, maxResults, onSearch]
  );

  // Update suggestions when query changes - prevent infinite loops
  useEffect(() => {
    // Skip initial mount completely
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (!isMountedRef.current) return;

    // Only update suggestions if query has content - don't depend on data to prevent loops
    if (query.length > 0) {
      // Use current data from closure, but don't include in deps
      const currentData = data.length > 0 ? data : [];
      const newSuggestions = generateSuggestions(
        query,
        currentData,
        recentSearches
      );
      setSuggestions(newSuggestions);
      setShowSuggestionsList(true);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [query]); // Only depend on query - data and recentSearches accessed via closure

  // Perform search when query or filters change - use ref to avoid infinite loop
  const performSearchRef = useRef(performSearch);
  performSearchRef.current = performSearch;

  useEffect(() => {
    // Skip initial mount to prevent infinite loop
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    // Only perform search if component is mounted and we have a query or filters
    if (!isMountedRef.current) return;

    // Don't search if query is empty and filters are empty
    if (!query.trim() && Object.keys(filters).length === 0) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Use ref to avoid dependency on performSearch
    performSearchRef.current(query, filters);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]); // Only depend on query and filters

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "query") {
      setQuery(suggestion.text);
    } else if (suggestion.type === "category") {
      setFilters((prev) => ({
        ...prev,
        category: [...getStringFilterValues(prev.category), suggestion.text],
      }));
    } else if (suggestion.type === "tag") {
      setFilters((prev) => ({
        ...prev,
        tags: [...getStringFilterValues(prev.tags), suggestion.text],
      }));
    }
    setShowSuggestionsList(false);
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = () => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 9)]);
    }
    setShowSuggestionsList(false);
  };

  const handleFilterChange = (filterId: string, value: SearchFilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const startVoiceSearch = () => {
    const SpeechRecognitionCtor = window.webkitSpeechRecognition;
    if (!enableVoiceSearch || !SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const highlightText = (text: string, highlights: string[] = []) => {
    if (!highlights.length) return text;

    const escapedTerms = highlights
      .filter(Boolean)
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!escapedTerms.length) return text;

    const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    return (
      <>
        {text.split(regex).map((part, index) =>
          escapedTerms.some((term) =>
            new RegExp(`^${term}$`, "i").test(part)
          ) ? (
            <mark
              key={`${part}-${index}`}
              className="glass-px-1 glass-radius-sm glass-surface-subtle glass-text-primary"
            >
              {part}
            </mark>
          ) : (
            <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
          )
        )}
      </>
    );
  };

  const getResultIcon = (category: string) => {
    const icons: Record<string, string> = {
      document: "📄",
      article: "📝",
      image: "🖼️",
      video: "🎥",
      product: "🛍️",
      user: "👤",
      project: "📁",
      service: "⚙️",
    };
    return icons[category.toLowerCase()] || "🔍";
  };

  return (
    <div
      data-glass-component
      className={cn(
        "glass-intelligent-search glass-w-full glass-min-w-0",
        className
      )}
      style={{ width: "100%", maxWidth: "64rem", margin: "0 auto" }}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      <style>{`
        .glass-intelligent-search-panel {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.7)), rgba(255, 255, 255, 0.76) !important;
          background-color: rgba(255, 255, 255, 0.76) !important;
          border-color: rgba(15, 23, 42, 0.14) !important;
          color: #0f172a !important;
          box-shadow: 0 18px 52px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.76);
        }

        .glass-intelligent-search-panel .glass-text-primary,
        .glass-intelligent-search-panel .glass-text-secondary,
        .glass-intelligent-search-panel .glass-text-tertiary {
          color: #0f172a !important;
        }

        .glass-intelligent-search-panel label,
        .glass-intelligent-search-panel p,
        .glass-intelligent-search-panel span {
          color: inherit;
        }

        .glass-intelligent-search-panel button {
          background-color: rgba(255, 255, 255, 0.58) !important;
          border: 1px solid rgba(15, 23, 42, 0.14) !important;
          color: #0f172a !important;
          border-radius: 12px;
        }

        .glass-intelligent-search-panel .glass-search-primary-action {
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.96), rgba(29, 78, 216, 0.92)), rgba(3, 105, 161, 0.96) !important;
          background-color: rgba(3, 105, 161, 0.96) !important;
          border-color: rgba(125, 211, 252, 0.42);
          color: #f8fafc !important;
        }

        .glass-intelligent-search-dropdown {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.84)), rgba(255, 255, 255, 0.9) !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(18px) saturate(1.35);
          -webkit-backdrop-filter: blur(18px) saturate(1.35);
        }

        .glass-intelligent-search input[type="text"] {
          appearance: none;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.72);
          color: #0f172a;
          border-color: rgba(15, 23, 42, 0.18);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .glass-intelligent-search input[type="text"]::placeholder {
          color: rgba(51, 65, 85, 0.66);
        }

        .glass-search-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 1rem;
          height: 1rem;
          flex: 0 0 1rem;
          margin-top: 0.125rem;
          border-radius: 0.375rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(241, 245, 249, 0.74)),
            rgba(255, 255, 255, 0.82);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.12),
            0 4px 12px rgba(2, 6, 23, 0.22);
          cursor: pointer;
        }

        .glass-search-checkbox:checked {
          border-color: rgba(56, 189, 248, 0.9);
          background:
            linear-gradient(135deg, rgba(56, 189, 248, 0.96), rgba(37, 99, 235, 0.9)),
            rgba(255, 255, 255, 0.76);
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 0.82),
            0 0 0 1px rgba(125, 211, 252, 0.34),
            0 8px 18px rgba(14, 165, 233, 0.22);
        }

        .glass-search-range {
          appearance: none;
          -webkit-appearance: none;
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background:
            linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(125, 211, 252, 0.44)),
            rgba(255, 255, 255, 0.72);
          box-shadow:
            inset 0 1px 2px rgba(2, 6, 23, 0.28),
            0 1px 0 rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        .glass-search-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }

        .glass-search-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }
      `}</style>
      {/* Search Input */}
      <Glass className="glass-relative glass-intelligent-search-panel">
        <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-p-4">
          <div className="glass-relative glass-flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                } else if (e.key === "Escape") {
                  setShowSuggestionsList(false);
                }
              }}
              onFocus={() => setShowSuggestionsList(suggestions.length > 0)}
              placeholder={placeholder}
              className="glass-w-full glass-min-w-0 glass-pl-10 glass-pr-4 glass-py-3 glass-border glass-border-subtle glass-radius-lg glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Search input"
              aria-busy={isSearching}
            />

            <div className="glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2">
              {isSearching ? (
                <div
                  className={cn(
                    "glass-w-5 glass-h-5 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full",
                    !prefersReducedMotion && "glass-animate-spin"
                  )}
                  role="status"
                  aria-label="Searching"
                />
              ) : (
                <span className="glass-text-secondary glass-text-lg">🔍</span>
              )}
            </div>
          </div>

          {enableVoiceSearch && (
            <button
              onClick={startVoiceSearch}
              disabled={isListening}
              className={cn(
                "glass-px-3 glass-py-3 glass-radius-lg glass-focus glass-touch-target glass-contrast-guard",
                !prefersReducedMotion && "glass-transition-colors",
                isListening
                  ? cn(
                      "glass-surface-subtle glass-text-primary",
                      !prefersReducedMotion && "glass-animate-pulse"
                    )
                  : "glass-surface-subtle glass-text-secondary hover:glass-surface-subtle"
              )}
              title="Voice search"
            >
              🎤
            </button>
          )}

          <button
            onClick={handleSearchSubmit}
            className={cn(
              "glass-search-primary-action glass-px-6 glass-py-3 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-surface-blue glass-focus glass-touch-target glass-contrast-guard",
              !prefersReducedMotion && "glass-transition-colors"
            )}
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestionsList && suggestions.length > 0 && (
          <div
            className="glass-intelligent-search-panel glass-intelligent-search-dropdown glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-2 glass-surface-subtle glass-border glass-border-subtle glass-radius-lg glass-shadow-lg glass-z-50 glass-max-h-60 glass-overflow-y-auto glass-contrast-guard"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.text}`}
                ref={(el) => (suggestionRefs.current[index] = el)}
                onClick={() => handleSuggestionClick(suggestion)}
                className="glass-w-full glass-px-4 glass-py-2 glass-text-left hover:glass-surface-subtle glass-flex glass-items-center glass-justify-between glass-gap-3 glass-border-b glass-border-subtle last:glass-border-b-0 glass-focus glass-touch-target glass-contrast-guard"
                role="option"
              >
                <div className="glass-flex glass-min-w-0 glass-items-center glass-gap-3">
                  <span className="glass-text-sm">
                    {suggestion.type === "query" && "🔍"}
                    {suggestion.type === "category" && "📁"}
                    {suggestion.type === "tag" && "🏷️"}
                  </span>
                  <span className="glass-text-secondary glass-min-w-0 glass-break-words">
                    {suggestion.text}
                  </span>
                  {suggestion.category && (
                    <span className="glass-text-xs glass-text-secondary">
                      in {suggestion.category}
                    </span>
                  )}
                </div>
                {suggestion.count && (
                  <span className="glass-text-xs glass-text-secondary">
                    {suggestion.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </Glass>

      {/* NLP Analysis Display */}
      {enableNLP && searchAnalysis && query.trim() && (
        <Glass className="glass-intelligent-search-panel glass-mt-4 glass-p-4 glass-surface-subtle">
          <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-text-sm">
            <div className="glass-flex glass-min-w-0 glass-items-center glass-gap-2">
              <span className="glass-font-medium glass-text-primary">
                Intent:
              </span>
              <span className="glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-capitalize glass-break-words">
                {searchAnalysis.intent}
              </span>
            </div>

            {searchAnalysis.entities.length > 0 && (
              <div className="glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2">
                <span className="glass-font-medium glass-text-primary">
                  Entities:
                </span>
                <div className="glass-flex glass-flex-wrap glass-gap-1">
                  {searchAnalysis.entities.slice(0, 3).map((entity, index) => (
                    <span
                      key={index}
                      className="glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words"
                    >
                      {entity.type}: {entity.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2">
              <span className="glass-font-medium glass-text-primary">
                Keywords:
              </span>
              <div className="glass-flex glass-flex-wrap glass-gap-1">
                {searchAnalysis.keywords
                  .slice(0, 4)
                  .map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words"
                    >
                      {keyword}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </Glass>
      )}

      {/* Filters */}
      {showFilters && availableFilters.length > 0 && (
        <Glass className="glass-intelligent-search-panel glass-mt-4 glass-p-4">
          <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-mb-4">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary">
              Filters
            </h3>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className="glass-text-sm glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4">
            {availableFilters.map((filter) => (
              <div key={filter.id}>
                <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
                  {filter.name}
                </label>

                {filter.type === "multiselect" && (
                  <div className="glass-space-y-2 glass-max-h-32 glass-overflow-y-auto">
                    {filter.options?.map((option) => (
                      <label
                        key={option.value}
                        className="glass-flex glass-items-start glass-gap-2 glass-text-sm glass-touch-target glass-contrast-guard"
                      >
                        <input
                          type="checkbox"
                          data-glass-component="checkbox"
                          checked={getStringFilterValues(
                            filters[filter.id]
                          ).includes(option.value)}
                          onChange={(e) => {
                            const current = getStringFilterValues(
                              filters[filter.id]
                            );
                            if (e.target.checked) {
                              handleFilterChange(filter.id, [
                                ...current,
                                option.value,
                              ]);
                            } else {
                              handleFilterChange(
                                filter.id,
                                current.filter(
                                  (v: string) => v !== option.value
                                )
                              );
                            }
                          }}
                          className="glass-search-checkbox glass-radius glass-border-subtle glass-text-primary glass-focus-ring-blue-500 glass-focus glass-contrast-guard"
                        />
                        <span className="glass-flex-1 glass-min-w-0 glass-break-words">
                          {option.label}
                        </span>
                        <span className="glass-text-secondary glass-text-xs">
                          ({option.count})
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === "range" && filter.range && (
                  <div>
                    <input
                      type="range"
                      data-glass-component="range"
                      min={filter.range.min}
                      max={filter.range.max}
                      step={filter.range.step || 1}
                      value={getNumericFilterValue(
                        filters[filter.id],
                        filter.range.min
                      )}
                      onChange={(e) =>
                        handleFilterChange(
                          filter.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="glass-search-range glass-w-full glass-focus glass-contrast-guard"
                    />
                    <div className="glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mt-1">
                      <span>{filter.range.min}</span>
                      <span className="glass-font-medium">
                        {getNumericFilterValue(
                          filters[filter.id],
                          filter.range.min
                        )}
                      </span>
                      <span>{filter.range.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Glass>
      )}

      {/* Results */}
      <div className="glass-mt-6">
        {query.trim() || Object.keys(filters).length > 0 ? (
          <div
            className="glass-mb-4 glass-text-sm glass-text-secondary glass-break-words"
            role="status"
            aria-live="polite"
          >
            Found {results.length} results
            {query.trim() && (
              <span>
                {" "}
                for "<span className="glass-font-medium">{query}</span>"
              </span>
            )}
            {Object.keys(filters).length > 0 && (
              <span> with {Object.keys(filters).length} filters applied</span>
            )}
          </div>
        ) : null}

        <div className="glass-space-y-4">
          {results.map((result) => (
            <Glass
              key={result.id}
              className={cn(
                "glass-intelligent-search-panel glass-p-6 glass-cursor-pointer hover:glass-shadow-lg glass-contrast-guard",
                !prefersReducedMotion && "glass-transition-shadow"
              )}
              onClick={() => onResultClick?.(result)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onResultClick?.(result);
                }
              }}
              role={onResultClick ? "button" : "article"}
              tabIndex={onResultClick ? 0 : undefined}
            >
              <div className="glass-flex glass-flex-col sm:glass-flex-row glass-items-start glass-gap-4">
                <div className="glass-text-2xl glass-flex-shrink-0">
                  {getResultIcon(result.category)}
                </div>

                <div className="glass-flex-1 glass-min-w-0">
                  <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-mb-2">
                    <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-min-w-0 glass-break-words">
                      {highlightText(result.title, result.highlights?.title)}
                    </h3>
                    <span className="glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius glass-break-words">
                      {result.category}
                    </span>
                    {result.metadata?.rating && (
                      <div className="glass-flex glass-items-center glass-gap-1">
                        <span className="glass-text-primary">⭐</span>
                        <span className="glass-text-sm glass-text-secondary">
                          {result.metadata.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="glass-text-secondary glass-mb-3 glass-break-words">
                    {highlightText(
                      result.description,
                      result.highlights?.description
                    )}
                  </p>

                  {result.tags.length > 0 && (
                    <div className="glass-flex glass-flex-wrap glass-gap-1">
                      {result.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-primary glass-radius glass-break-words"
                        >
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 5 && (
                        <span className="glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius">
                          +{result.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="glass-text-sm glass-text-secondary glass-flex-shrink-0">
                  Score: {result.score.toFixed(1)}
                </div>
              </div>
            </Glass>
          ))}

          {results.length === 0 &&
            (query.trim() || Object.keys(filters).length > 0) &&
            !isSearching && (
              <Glass className="glass-intelligent-search-panel glass-text-center glass-px-6 glass-py-12 glass-text-secondary glass-surface-subtle glass-contrast-guard">
                <div className="glass-text-5xl glass-mb-4">🔍</div>
                <h3 className="glass-text-lg glass-font-medium glass-mb-2 glass-text-secondary">
                  No results found
                </h3>
                <p className="glass-text-sm glass-break-words">
                  Try adjusting your search terms or filters, or try using more
                  general keywords.
                </p>
              </Glass>
            )}
        </div>
      </div>
    </div>
  );
};
