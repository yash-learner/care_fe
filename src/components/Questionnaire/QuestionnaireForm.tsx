import { ChangeEvent, useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import type {
  QuestionValue,
  QuestionnaireFormProps,
} from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { QuestionGroup } from "./QuestionTypes/QuestionGroup";

export function QuestionnaireForm({
  questionnaire,
  onSubmit,
  isSubmitting = false,
}: QuestionnaireFormProps) {
  const [values, setValues] = useState<Record<string, QuestionValue>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Object.values(values));
  };

  const handleChange = (id: string, value: QuestionValue) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questionnaire.questions.map((question: Question) => (
        <QuestionGroup
          key={question.id}
          question={question}
          values={values}
          onChange={handleChange}
        />
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CareIcon
                icon="l-spinner"
                className="mr-2 h-4 w-4 animate-spin"
              />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
