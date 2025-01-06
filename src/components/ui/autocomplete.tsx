import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AutoCompleteOption {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: AutoCompleteOption[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  noOptionsMessage?: string;
  disabled?: boolean;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  onSearch,
  placeholder = "Select...",
  noOptionsMessage = "No options found",
  disabled,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          title={
            value
              ? options.find((option) => option.value === value)?.label
              : undefined
          }
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="overflow-hidden">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 pointer-events-auto">
        <Command>
          <CommandInput
            placeholder="Search option..."
            disabled={disabled}
            onValueChange={onSearch}
            className="outline-none border-none ring-0 shadow-none"
          />
          <CommandList>
            <CommandEmpty>{noOptionsMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(v) => {
                    const currentValue =
                      options.find(
                        (option) =>
                          option.label.toLowerCase() === v.toLowerCase(),
                      )?.value || "";
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
