import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import useOnClickOutside from "@/hooks/useOnClickOutside";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Label } from "../ui/label";
import { Coding } from "./types";

type LabObservationCodeSelectProps = {
  onSelect: (code: Coding) => void;
  value: Coding | undefined;
};

// TODO: Make this a more generic async auto complete component; This is currently duplicated from LabOrderCodeSelect
export default function LabObservationCodeSelect({
  onSelect,
  value: selected,
}: LabObservationCodeSelectProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [data, setData] = useState<Coding[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => {
    setShowOptions(false);
    setQuery(selected?.display ?? selected?.code ?? "");
  });

  useEffect(() => {
    if (selected) {
      setQuery(selected.display ?? selected.code);
    }
  }, [selected]); // added this useEffect for stability

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const { res, data } = await request(routes.labs.labObservationCodes, {
        body: { search: query, count: 10 },
      });

      if (!res?.ok) {
        setLoading(false);
        return;
      }

      setData(data?.results ?? []);
      setLoading(false);
    };

    fetchData();
  }, [query]);

  return (
    <div className="grid gap-1.5 w-full">
      <Label htmlFor="lab-observation-code-select">
        Select a lab observation
      </Label>

      <div>
        <Command
          ref={commandRef}
          onFocus={() => setShowOptions(true)}
          className={cn("border", showOptions === false && "divide-y-0")}
        >
          <CommandInput
            id="lab-observation-code-select"
            className="shadow-none border-none focus:ring-0"
            placeholder="Search lab observation code"
            value={query}
            onValueChange={setQuery}
          />
          {showOptions && (
            <CommandList className="max-h-36">
              <CommandEmpty>
                {loading ? "Loading..." : "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.code}
                    value={query}
                    onSelect={() => {
                      onSelect(item);
                      setQuery(item.display ?? item.code);
                      setShowOptions(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between gap-2 w-full">
                      <p>
                        <span className="font-semibold text-gray-900">
                          {item.display}
                        </span>
                        <br />
                        <span className="text-xs font-semibold text-gray-500">
                          {item.code}
                        </span>
                      </p>

                      <span className="text-xs text-gray-500">
                        {item.system}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}
