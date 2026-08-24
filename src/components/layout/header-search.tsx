"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Search, X } from "lucide-react";

export function HeaderSearch() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    router.push(`/shop?q=${encodeURIComponent(query)}`);
    setIsExpanded(false);
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        aria-label="Search"
        onClick={() => setIsExpanded(true)}
        className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-secondary"
      >
        <Search className="size-5" />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border border-border bg-background"
    >
      <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search jewellery..."
        aria-label="Search jewellery"
        autoFocus
        className="h-9 w-32 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground sm:w-48"
      />
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setIsExpanded(false)}
        className="inline-flex size-9 items-center justify-center transition-colors hover:bg-secondary"
      >
        <X className="size-4" />
      </button>
    </form>
  );
}