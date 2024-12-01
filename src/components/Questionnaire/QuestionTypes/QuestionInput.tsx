import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { QuestionValue } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { ChoiceQuestion } from "./ChoiceQuestion";

interface QuestionInputProps {
  question: Question;
  value: QuestionValue;
  onChange: (value: QuestionValue) => void;
}

export function QuestionInput({
  question,
  value,
  onChange,
}: QuestionInputProps) {
  const handleNumberChange = (newValue: string) => {
    onChange({
      ...value,
      value:
        question.type === "decimal"
          ? parseFloat(newValue)
          : parseInt(newValue, 10),
    });
  };

  const renderInput = () => {
    switch (question.type) {
      case "decimal":
      case "integer":
        return (
          <Input
            type="number"
            value={value.value?.toString() || ""}
            onChange={(e) => handleNumberChange(e.target.value)}
            step={question.type === "decimal" ? "0.01" : "1"}
          />
        );
      case "choice":
        return (
          <ChoiceQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "text":
        return (
          <Input
            type="text"
            value={value.value?.toString() || ""}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value.value?.toString() || ""}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          {question.text}
          {question.required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        {question.code && (
          <span className="text-sm text-gray-500">{question.code.display}</span>
        )}
      </div>

      {renderInput()}
    </div>
  );
}
