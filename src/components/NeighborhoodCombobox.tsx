import { useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Neighborhood } from "@/types/types";

type NeighborhoodComboboxProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  neighborhoods: Neighborhood[];
  city?: string;
  state?: string;
};

export function NeighborhoodCombobox({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Selecione o bairro",
  // city = "Petrolina",
  // state = "PE",
  neighborhoods,
}: NeighborhoodComboboxProps) {
  const [open, setOpen] = useState(false);

  // const {
  //   data: neighborhoods = [],
  //   isLoading,
  //   isError,
  // } = useNeighborhoods({
  //   city,
  //   state,
  // });

  const selectedNeighborhood = neighborhoods.find((neighborhood) => neighborhood.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-12 w-full justify-between pl-10 pr-3 text-left text-base font-normal"
          />
        }
      >
        <MapPin className="absolute left-7 h-5 w-5 text-muted-foreground" aria-hidden="true" />

        <span className="truncate">{selectedNeighborhood?.name ?? placeholder}</span>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar bairro..." />

          <CommandList>
            <CommandEmpty>Nenhum bairro encontrado.</CommandEmpty>

            <CommandGroup>
              {neighborhoods.map((neighborhood) => (
                <CommandItem
                  key={neighborhood.id}
                  value={neighborhood.name}
                  onSelect={() => {
                    onValueChange(neighborhood.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === neighborhood.id ? "opacity-100" : "opacity-0"
                    )}
                  />

                  {neighborhood.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
