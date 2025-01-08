import { format } from "date-fns";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { QuestionnaireResponse } from "@/types/questionnaire/form";

interface DateTimeQuestionProps {
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
  clearError: () => void;
  classes?: string;
}

export function DateTimeQuestion({
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
  clearError,
  classes,
}: DateTimeQuestionProps) {
  const currentValue = questionnaireResponse.values[0]?.value
    ? new Date(questionnaireResponse.values[0].value as string)
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    clearError();
    if (currentValue) {
      date.setHours(currentValue.getHours());
      date.setMinutes(currentValue.getMinutes());
    }

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "dateTime",
          value: date.toISOString(),
        },
      ],
    });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const date = currentValue || new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "dateTime",
          value: date.toISOString(),
        },
      ],
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !currentValue && "text-muted-foreground",
              classes,
            )}
            disabled={disabled}
          >
            <CareIcon icon="l-calender" className="mr-2 h-4 w-4" />
            {currentValue ? format(currentValue, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentValue}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        className="w-[150px]"
        value={formatTime(currentValue)}
        onChange={handleTimeChange}
        disabled={disabled || !currentValue}
      />
    </div>
  );
}
