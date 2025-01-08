import { MinusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { LabObservation } from "@/types/emr/observation";

interface LabObservationItemProps {
  observation: LabObservation;
  index: number;
  disabled?: boolean;
  onUpdate: (updates: Partial<LabObservation>) => void;
  onRemove: () => void;
}
export const LabObservationItem: React.FC<LabObservationItemProps> = ({
  observation,
  index,
  disabled,
  onUpdate,
  onRemove,
}) => {
  const { t } = useTranslation();
  const [showNotes, setShowNotes] = React.useState(false);
  return (
    <div className="p-3 justify-between group focus-within:ring-2 ring-gray-300 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">
          {index + 1}.{" "}
          {observation.code?.display ?? observation.code?.code ?? "Select Code"}
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
        {/* Unit Badge */}
        <div className="">
          <Label>{t("unit")}</Label>
          <Select
            value={observation.unit}
            onValueChange={(value: string) => onUpdate({ unit: value })}
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
        </div>
        {/* Result */}
        <div className="flex space-x-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">
              {t("result")} (Ref. Interval: 4.0 - 11.0 x10³/μL)
            </Label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={observation.result.value}
              onChange={(e) => onUpdate({ result: { value: e.target.value } })}
              disabled={disabled}
            />
          </div>
          <div>
            <Badge className="bg-green-100 text-green-600" variant="outline">
              Normal
            </Badge>
          </div>
        </div>
      </div>
      {/* Note Section */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setShowNotes(!showNotes);
          }}
          className={`h-6 px-2 ${
            observation.note ? "text-blue-500" : "text-gray-500"
          } hover:bg-gray-100`}
          disabled={disabled}
        >
          <CareIcon icon="l-notes" className="mr-2 h-4 w-4" />
          {showNotes
            ? "Hide Notes"
            : observation.note
              ? "Show Notes"
              : "Add Notes"}
        </Button>
        {showNotes && (
          <Textarea
            value={observation.note}
            onChange={(e) => onUpdate({ note: e.target.value })}
            placeholder="Add notes..."
            className="min-h-[100px]"
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};
