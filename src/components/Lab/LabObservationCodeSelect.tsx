import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

import useOnClickOutside from "@/hooks/useOnClickOutside";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { Code, ValueSetSystem } from "@/types/questionnaire/code";

import { Label } from "../ui/label";

type LabObservationCodeSelectProps = {
  onSelect: (code: Code) => void;
  value: Code | undefined;
};

// TODO: Make this similar to LabOrderQuestion
export default function LabObservationCodeSelect({
  onSelect,
  value: selected,
}: LabObservationCodeSelectProps) {
  return (
    <div className="grid gap-1.5 w-full">
      <Label htmlFor="lab-observation-code-select">
        Select a lab observation
      </Label>

      <div>
        <ValueSetSelect
          system="system-lab-order-code"
          placeholder="Search lab observation code"
          onSelect={(item) => {
            onSelect(item);
            // Handle any additional actions if needed
          }}
          // disabled={disabled}
        />
      </div>
    </div>
  );
}
