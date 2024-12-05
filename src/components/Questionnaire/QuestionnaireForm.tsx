import { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";
import { QuestionnaireDetail } from "@/types/questionnaire/questionnaire";

import { QuestionGroup } from "./QuestionTypes/QuestionGroup";

export interface QuestionnaireFormProps {
  questionnaire: QuestionnaireDetail;
  onSubmit: (questionnaireResponse: QuestionnaireResponse[]) => void;
  isSubmitting?: boolean;
}

export function QuestionnaireForm({
  questionnaire,
  onSubmit,
  isSubmitting = false,
}: QuestionnaireFormProps) {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<
    QuestionnaireResponse[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(questionnaireResponses);
  };

  const updateQuestionnaireResponse = (
    questionnaireResponse: QuestionnaireResponse,
  ) => {
    setQuestionnaireResponses((prev) => {
      return prev
        .filter((v) => v.question_id !== questionnaireResponse.question_id)
        .concat(questionnaireResponse);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questionnaire.questions.map((question: Question) => (
        <QuestionGroup
          key={question.id}
          question={question}
          questionnaireResponses={questionnaireResponses}
          updateQuestionnaireResponseCB={updateQuestionnaireResponse}
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
