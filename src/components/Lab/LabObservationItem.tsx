import { MinusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { DiagnosticReportFormValues } from "./DiagnosticReportForm";
import { COMMON_LAB_UNITS } from "./constants";

interface LabObservationItemProps {
  index: number;
  disabled?: boolean;
  onRemove: () => void;
}

export const LabObservationItem: React.FC<LabObservationItemProps> = ({
  index,
  disabled,
  onRemove,
}) => {
  const { t } = useTranslation();
  const [showNotes, setShowNotes] = React.useState(false);

  const { watch, control } = useFormContext<DiagnosticReportFormValues>();

  const currentObservation = watch(`observations.${index}`);
  const isNormal = true;

  return (
    <div className="p-3 group focus-within:ring-2 ring-gray-300 rounded-lg space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">
          {index + 1}.{" "}
          {currentObservation?.main_code?.display ||
            currentObservation?.main_code?.code ||
            "Select Code"}
        </h4>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onRemove}
            disabled={disabled}
          >
            <MinusCircledIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:space-x-4">
        <FormField
          control={control}
          name={`observations.${index}.value.value_quantity.code`}
          render={({ field }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel>{t("unit")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value?.code}
                  onValueChange={(value) => {
                    const selectedUnit = COMMON_LAB_UNITS.find(
                      (unit) => unit.code === value,
                    );
                    field.onChange({
                      code: selectedUnit?.code,
                      display: selectedUnit?.display,
                      system: "http://unitsofmeasure.org",
                    });
                  }}
                  disabled={disabled}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.value?.code || "Select Unit"}
                        </SelectValue>
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="capitalize">
                      {COMMON_LAB_UNITS.find(
                        (unit) => unit.code === field.value?.code,
                      )?.display || "Select Unit"}
                    </TooltipContent>
                  </Tooltip>
                  <SelectContent>
                    {COMMON_LAB_UNITS.map((unit) => (
                      <Tooltip key={unit.code}>
                        <TooltipTrigger asChild>
                          <SelectItem value={unit.code}>{unit.code}</SelectItem>
                        </TooltipTrigger>
                        <TooltipContent className="capitalize">
                          {unit.display}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`observations.${index}.value.value_quantity.value`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("result")} (Ref. Interval: 4.0 - 11.0)</FormLabel>
              <FormControl>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end">
          <Badge
            className={
              isNormal
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }
            variant="outline"
          >
            {isNormal ? "Normal" : "Abnormal"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setShowNotes(!showNotes);
          }}
          className={`h-6 px-2 ${
            currentObservation?.note ? "text-blue-500" : "text-gray-500"
          } hover:bg-gray-100`}
          disabled={disabled}
        >
          <CareIcon icon="l-notes" className="mr-2 h-4 w-4" />
          {showNotes
            ? t("hide_notes")
            : currentObservation?.note
              ? t("show_notes")
              : t("add_notes")}
        </Button>
        {showNotes && (
          <FormField
            control={control}
            name={`observations.${index}.note`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add notes..."
                    className="min-h-[100px]"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};
