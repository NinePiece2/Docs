"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Kbd } from "@/components/ui/kbd";

interface PagefindResultData {
  meta: {
    title: string;
  };
  excerpt: string;
  url: string;
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
}

interface PagefindAPI {
  search: (query: string) => Promise<PagefindSearchResponse>;
}

declare global {
  interface Window {
    pagefind?: PagefindAPI;
  }
}

interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load pagefind on mount
  useEffect(() => {
    async function loadPagefind() {
      if (typeof window.pagefind === "undefined") {
        try {
          window.pagefind = await import(
            // @ts-expect-error pagefind.js generated after build
            /* webpackIgnore: true */ "/_pagefind/pagefind.js"
          );
          setIsReady(true);
        } catch (e) {
          console.error("Failed to load pagefind:", e);
          // Fallback to empty search
          window.pagefind = {
            search: async () => ({ results: [] }),
          };
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    }
    loadPagefind();
  }, []);

  // Handle search
  async function handleSearch(searchQuery: string) {
    setQuery(searchQuery);

    if (!searchQuery.trim() || !window.pagefind) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const search = await window.pagefind.search(searchQuery);
      const formattedResults = await Promise.all(
        search.results.slice(0, 8).map(async (result: PagefindResult) => {
          const data = await result.data();
          // Clean up the URL by removing .html extension
          const cleanUrl = data.url.replace(/\.html$/, "");

          return {
            id: result.id,
            title: data.meta.title,
            excerpt: data.excerpt,
            url: cleanUrl,
          };
        }),
      );
      setResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Listen for keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between rounded-lg sm:w-48 lg:w-64"
        >
          <span className="hidden text-sm text-muted-foreground sm:inline-flex gap-2 items-center">
            <SearchIcon className="h-4 w-4" />
            Search docs...
          </span>
          <span className="sm:hidden">
            <SearchIcon className="h-4 w-4" />
          </span>
          <Kbd className="hidden pointer-events-none sm:flex">⌘K</Kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-96 p-0" align="start">
        <div className="flex flex-col gap-4 p-4">
          <Input
            ref={searchInputRef}
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-10"
            autoFocus
            disabled={!isReady}
          />

          {isLoading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && query && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {!isLoading && results.length === 0 && !query && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {!isReady ? "Loading search..." : "Start typing to search..."}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col gap-1 rounded-lg border border-border/50 p-3 transition-all hover:bg-accent hover:border-border cursor-pointer"
                >
                  <h3 className="text-sm font-semibold leading-tight">
                    {result.title}
                  </h3>
                  <p
                    className="text-xs text-muted-foreground line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
