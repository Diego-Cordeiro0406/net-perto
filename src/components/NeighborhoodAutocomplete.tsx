import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { useNeighborhoods } from "@/hooks/useNeighborhoods";
import { normalizeText } from "@/lib/formatters";
import type { SelectedNeighborhood } from "@/types/types";

type NeighborhoodAutocompleteProps = {
  value?: string;
  onValueChange: (value: SelectedNeighborhood | null) => void;
  disabled?: boolean;
  placeholder?: string;
  city?: string;
  state?: string;
};

export function NeighborhoodAutocomplete({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Digite seu bairro",
  city = "Petrolina",
  state = "PE",
}: NeighborhoodAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: neighborhoods = [],
    isLoading,
    isError,
  } = useNeighborhoods({
    city,
    state,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredNeighborhoods = useMemo(() => {
    const normalizedSearch = normalizeText(inputValue);

    if (!normalizedSearch) {
      return [];
    }

    return neighborhoods.filter((neighborhood) =>
      normalizeText(neighborhood.name).includes(normalizedSearch)
    );
  }, [inputValue, neighborhoods]);

  function handleChange(value: string) {
    setInputValue(value);
    setIsOpen(true);

    onValueChange(null);
  }

  function handleSelect(neighborhood: (typeof neighborhoods)[number]) {
    setInputValue(neighborhood.name);

    onValueChange({
      id: neighborhood.id,
      name: neighborhood.name,
    });

    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" && filteredNeighborhoods.length > 0) {
      event.preventDefault();
      handleSelect(filteredNeighborhoods[0]);
    }
  }

  const shouldShowSuggestions = isOpen && inputValue.trim().length > 0;

  return (
    <section ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin
          className="absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          type="text"
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => {
            if (inputValue.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={isLoading ? "Carregando bairros..." : placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={shouldShowSuggestions}
          aria-autocomplete="list"
          className={cn(
            "h-12 w-full rounded-md border bg-background pl-10 pr-3",
            "text-base outline-none transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      {shouldShowSuggestions && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          {isError && (
            <div className="px-4 py-3 text-sm text-destructive">
              Não foi possível carregar os bairros.
            </div>
          )}

          {!isError && filteredNeighborhoods.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum bairro encontrado.</div>
          )}

          {!isError && filteredNeighborhoods.length > 0 && (
            <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
              {filteredNeighborhoods.map((neighborhood) => {
                const isSelected = neighborhood.id === value;

                return (
                  <li key={neighborhood.id} role="option">
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => handleSelect(neighborhood)}
                      className={cn(
                        "flex w-full items-center rounded-sm px-3 py-2.5 text-left text-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />

                      <span className="truncate">{neighborhood.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
