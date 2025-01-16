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

import type { DiagnosticReportFormValues } from "./DiagnosticReportForm";

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
          {currentObservation?.code?.display ||
            currentObservation?.code?.code ||
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

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <FormField
          control={control}
          name={`observations.${index}.unit`}
          render={({ field }) => (
            <FormItem className="w-full md:w-1/4">
              <FormLabel>{t("unit")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x10⁶/μL">x10⁶/μL</SelectItem>
                    <SelectItem value="x10³/μL">x10³/μL</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2 mt-4 md:mt-0">
          <FormField
            control={control}
            name={`observations.${index}.result.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  {t("result")} (Ref. Interval: 4.0 - 11.0 x10³/μL)
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md w-full"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-7">
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
