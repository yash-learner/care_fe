import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export interface Filter {
  column: string;
  operator: string;
  value: string;
}

interface TableFilterProps {
  keys: Array<{
    key: string;
    label: string;
    type: string; // "text", "checkbox", or "radio"
    options?: string[]; // Available options for dropdown/checkbox/radio
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

  const clearFilters = () => {
    setFilters([]);
    onFiltersChange([]);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Display Applied Filters */}
      <div className="flex flex-wrap items-center gap-x-2 border rounded-md">
        {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center gap-x-2 px-3 bg-gray-50 border rounded-lg shadow-sm"
          >
            <img
              src="/images/filter.svg"
              alt="filter"
              className="w-4 h-4 text-gray-600"
            />
            {/* Column Label */}
            <span className="font-medium text-sm text-gray-700">
              {keys.find((key) => key.key === filter.column)?.label}
            </span>

            {/* Separator */}
            <Separator orientation="vertical" className="h-9 bg-gray-300" />

            {/* Operator */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 py-0 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {filter.operator}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <ul className="list-none">
                  {keys
                    .find((key) => key.key === filter.column)
                    ?.operators.map((op) => (
                      <li key={op}>
                        <Button
                          key={op}
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 hover:bg-gray-200 w-full"
                          onClick={() => updateFilter(index, "operator", op)}
                        >
                          {op}
                        </Button>
                      </li>
                    ))}
                </ul>
              </PopoverContent>
            </Popover>

            {/* Separator */}
            <Separator orientation="vertical" className="h-9 bg-gray-300" />

            {/* Value */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 py-0 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {filter.value}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 space-y-1">
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
                ) : keys.find((key) => key.key === filter.column)?.type ===
                  "radio" ? (
                  <RadioGroup
                    value={filter.value}
                    onValueChange={(val) => updateFilter(index, "value", val)}
                  >
                    <div className="flex flex-col space-y-2">
                      {keys
                        .find((key) => key.key === filter.column)
                        ?.options?.map((option, idx) => {
                          const optionId = `${filter.column}-${idx}`;
                          return (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={option} id={optionId} />
                              <Label htmlFor={optionId}>{option}</Label>
                            </div>
                          );
                        })}
                    </div>
                  </RadioGroup>
                ) : (
                  <Input
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(index, "value", e.target.value)
                    }
                    placeholder="Enter value"
                    className="text-sm"
                  />
                )}
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-9 bg-gray-300" />

            {/* Remove Button */}
            <Button
              variant="ghost"
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
          <Button variant="outline" className="flex items-center gap-2">
            <img
              src="/images/filter.svg"
              alt="filter"
              className="w-4 h-4 text-gray-600"
            />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 space-y-2 w-64">
          {!currentFilter.column && (
            <>
              <h4 className="text-sm font-medium">Select Column</h4>
              <div className="flex flex-col">
                {keys.map((key) => (
                  <Button
                    key={key.key}
                    variant="ghost"
                    size="sm"
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
              </div>
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
              ) : keys.find((key) => key.key === currentFilter.column)?.type ===
                "radio" ? (
                <RadioGroup
                  onValueChange={(val) =>
                    addFilter({
                      column: currentFilter.column!,
                      operator: currentFilter.operator || "is",
                      value: val,
                    })
                  }
                >
                  <div className="flex flex-col space-y-2">
                    {keys
                      .find((key) => key.key === currentFilter.column)
                      ?.options?.map((option, idx) => {
                        const optionId = `${currentFilter.column}-${idx}`;
                        return (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={option} id={optionId} />
                            <Label htmlFor={optionId}>{option}</Label>
                          </div>
                        );
                      })}
                  </div>
                </RadioGroup>
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

      {/* Clear Filters */}
      {filters.length > 0 && (
        <Button variant="secondary" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default TableFilter;
