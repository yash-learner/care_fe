import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { QuestionValue } from "@/types/questionnaire/form";
import type { EnableWhen, Question } from "@/types/questionnaire/question";

import { ChoiceQuestion } from "./ChoiceQuestion";

interface QuestionInputProps {
  question: Question;
  values: QuestionValue[];
  onChange: (value: QuestionValue) => void;
}

export function QuestionInput({
  question,
  values,
  onChange,
}: QuestionInputProps) {
  const value = values.find((v) => v.id === question.id) || {
    id: question.id,
    linkId: question.link_id,
    value: "",
  };

  const isQuestionEnabled = () => {
    if (!question.enable_when?.length) return true;

    const checkCondition = (enableWhen: EnableWhen) => {
      const dependentValue = values.find(
        (v) => v.linkId === enableWhen.question,
      )?.value;

      switch (enableWhen.operator) {
        case "exists":
          return dependentValue !== undefined && dependentValue !== null;
        case "equals":
          return dependentValue === enableWhen.answer;
        case "not_equals":
          return dependentValue !== enableWhen.answer;
        case "greater":
          return (
            dependentValue !== undefined && dependentValue > enableWhen.answer
          );
        case "less":
          return (
            dependentValue !== undefined && dependentValue < enableWhen.answer
          );
        case "greater_or_equals":
          return (
            dependentValue !== undefined && dependentValue >= enableWhen.answer
          );
        case "less_or_equals":
          return (
            dependentValue !== undefined && dependentValue <= enableWhen.answer
          );
        default:
          return true;
      }
    };

    return question.enable_behavior === "any"
      ? question.enable_when.some(checkCondition)
      : question.enable_when.every(checkCondition);
  };

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
    const isEnabled = isQuestionEnabled();
    const commonProps = {
      disabled: !isEnabled,
      "aria-hidden": !isEnabled,
    };

    switch (question.type) {
      case "decimal":
      case "integer":
        return (
          <Input
            type="number"
            value={value.value?.toString() || ""}
            onChange={(e) => handleNumberChange(e.target.value)}
            step={question.type === "decimal" ? "0.01" : "1"}
            {...commonProps}
          />
        );
      case "choice":
        return (
          <ChoiceQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={!isEnabled}
          />
        );
      case "text":
        return (
          <Textarea
            value={value.value?.toString() || ""}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
            className="min-h-[100px]"
            {...commonProps}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value.value?.toString() || ""}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
            {...commonProps}
          />
        );
    }
  };

  const isEnabled = isQuestionEnabled();
  if (!isEnabled && question.disabled_display === "hidden") {
    return null;
  }

  return (
    <div className={`space-y-2 ${!isEnabled ? "opacity-50" : ""}`}>
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
