import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Filter {
  column: string;
  operator: string;
  value: string;
}

interface TableFilterProps {
  keys: Array<{
    key: string;
    label: string;
    type: string; // "text", "dropdown", or "checkbox"
    options?: string[]; // Available options for dropdown/checkbox
    defaultOperator?: string; // Default operator for this key
    operators: string[]; // Allowed operators
  }>;
  onFiltersChange: (filters: Filter[]) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({ keys, onFiltersChange }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Partial<Filter>>({});

  const addFilter = (filter: Filter) => {
    const updatedFilters = [...filters, filter];
    setFilters(updatedFilters);
    setCurrentFilter({});
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Filters</h3>

      {/* Display Applied Filters */}
      <div className="space-y-2">
        {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 border rounded p-2"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-sm">
                  {keys.find((key) => key.key === filter.column)?.label ||
                    "Select Column"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-64 space-y-2">
                {keys.map((key) => (
                  <Button
                    key={key.key}
                    variant="ghost"
                    onClick={() => updateFilter(index, "column", key.key)}
                  >
                    {key.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-sm">
                  {filter.operator}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-64 space-y-2">
                {keys
                  .find((key) => key.key === filter.column)
                  ?.operators.map((op) => (
                    <Button
                      key={op}
                      variant="ghost"
                      onClick={() => updateFilter(index, "operator", op)}
                    >
                      {op}
                    </Button>
                  ))}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-sm">
                  {filter.value}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-64 space-y-2">
                {keys.find((key) => key.key === filter.column)?.type ===
                "checkbox" ? (
                  keys
                    .find((key) => key.key === filter.column)
                    ?.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filter.value === option}
                          onCheckedChange={() =>
                            updateFilter(index, "value", option)
                          }
                        />
                        <span>{option}</span>
                      </div>
                    ))
                ) : (
                  <Input
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(index, "value", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                )}
              </PopoverContent>
            </Popover>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFilter(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>

      {/* Add Filter Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">+ Add Filter</Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-64 space-y-4">
          {!currentFilter.column && (
            <>
              <h4 className="text-sm font-medium">Select Column</h4>
              {keys.map((key) => (
                <Button
                  key={key.key}
                  variant="ghost"
                  onClick={() =>
                    setCurrentFilter({
                      column: key.key,
                      operator: key.defaultOperator || "is",
                    })
                  }
                >
                  {key.label}
                </Button>
              ))}
            </>
          )}

          {currentFilter.column && !currentFilter.value && (
            <>
              <h4 className="text-sm font-medium">Select Value</h4>
              {keys.find((key) => key.key === currentFilter.column)?.type ===
              "checkbox" ? (
                keys
                  .find((key) => key.key === currentFilter.column)
                  ?.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={currentFilter.value === option}
                        onCheckedChange={() =>
                          addFilter({
                            column: currentFilter.column!,
                            operator: currentFilter.operator || "is",
                            value: option,
                          })
                        }
                      />
                      <span>{option}</span>
                    </div>
                  ))
              ) : (
                <Input
                  placeholder="Enter value"
                  onBlur={(e) =>
                    addFilter({
                      column: currentFilter.column!,
                      operator: currentFilter.operator || "is",
                      value: e.target.value,
                    })
                  }
                />
              )}
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableFilter;
