import React from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

import { LabObservation } from "@/types/emr/observation";
import { Code } from "@/types/questionnaire/code";

import { LabObservationItem } from "./LabObservationItem";

interface LabObservationQuestionProps {
  question: string;
  observations: LabObservation[];
  setObservations: React.Dispatch<React.SetStateAction<LabObservation[]>>;
  disabled?: boolean;
}
export const LabObservationQuestion: React.FC<LabObservationQuestionProps> = ({
  question,
  observations,
  setObservations,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const handleAddObservation = (code: Code) => {
    setObservations((prev) => [
      ...prev,
      {
        code,
        result: { value: "" },
        unit: "x10³/μL",
        note: "",
      },
    ]);
  };
  const handleRemoveObservation = (index: number) => {
    setObservations((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpdateObservation = (
    index: number,
    updates: Partial<LabObservation>,
  ) => {
    setObservations((prev) =>
      prev.map((obs, i) => (i === index ? { ...obs, ...updates } : obs)),
    );
  };
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{question}</Label>
      {observations.length > 0 && (
        <div className="rounded-lg border space-y-4 flex flex-col">
          {/* <ul className="space-y-2 divide-y-2 divide-gray-200 divide-dashed"> */}
          {observations.map((observation, index) => (
            <>
              <div className="">
                <LabObservationItem
                  key={index}
                  observation={observation}
                  index={index}
                  disabled={disabled}
                  onUpdate={(updates) =>
                    handleUpdateObservation(index, updates)
                  }
                  onRemove={() => handleRemoveObservation(index)}
                />
              </div>
              <div className="border-l-[2.5px] border-gray-300 w-5 h-12 ms-8 last:hidden" />
            </>
          ))}
          {/* </ul> */}
        </div>
      )}
      <ValueSetSelect
        system="system-observation"
        placeholder={t("search_lab_observation_code")}
        onSelect={handleAddObservation}
        // You can pass a selected value if needed
        // value={...}
        disabled={disabled}
      />
    </div>
  );
};
