import { CaretSortIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Loading from "@/components/Common/Loading";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";
import { QuestionnaireResponse } from "@/types/questionnaire/form";
import { Question } from "@/types/questionnaire/question";

interface MedicationQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function MedicationQuestion({ question }: MedicationQuestionProps) {
  const medicationSearch = useQuery(routes.valueset.expand, {
    pathParams: { system: "system-medication" },
    body: { count: 10 },
    prefetch: false,
  });

  return (
    <div className="space-y-4">
      <Label>{question.text}</Label>
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              Search
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command filter={() => 1}>
              <CommandInput
                placeholder="Search option..."
                className="my-1"
                onValueChange={(search) =>
                  medicationSearch.refetch({ body: { search } })
                }
              />
              <CommandList>
                <CommandEmpty>
                  {medicationSearch.loading ? <Loading /> : "No options found"}
                </CommandEmpty>
                <CommandGroup>
                  {medicationSearch.data?.results.map((option) => (
                    <CommandItem
                      key={option.code}
                      value={option.code}
                      // onSelect={(currentValue) => {
                      //   onChange(currentValue === value ? "" : currentValue);
                      // }}
                    >
                      {/* <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0",
                      )}
                    /> */}
                      <span>{option.display}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
