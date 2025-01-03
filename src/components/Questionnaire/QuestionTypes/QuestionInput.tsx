import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import { FollowUpAppointmentQuestion } from "@/components/Questionnaire/QuestionTypes/FollowUpAppointmentQuestion";

import { QuestionValidationError } from "@/types/questionnaire/batch";
import type {
  QuestionnaireResponse,
  ResponseValue,
} from "@/types/questionnaire/form";
import type { EnableWhen, Question } from "@/types/questionnaire/question";

import { AllergyQuestion } from "./AllergyQuestion";
import { BooleanQuestion } from "./BooleanQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { DateTimeQuestion } from "./DateTimeQuestion";
import { DiagnosisQuestion } from "./DiagnosisQuestion";
import { EncounterQuestion } from "./EncounterQuestion";
import { MedicationRequestQuestion } from "./MedicationRequestQuestion";
import { MedicationStatementQuestion } from "./MedicationStatementQuestion";
import { NotesInput } from "./NotesInput";
import { NumberQuestion } from "./NumberQuestion";
import { SymptomQuestion } from "./SymptomQuestion";
import { TextQuestion } from "./TextQuestion";

interface QuestionInputProps {
  question: Question;
  questionnaireResponses: QuestionnaireResponse[];
  encounterId?: string;
  updateQuestionnaireResponseCB: (
    questionnaireResponse: QuestionnaireResponse,
  ) => void;
  errors: QuestionValidationError[];
  clearError: () => void;
  disabled?: boolean;
  facilityId: string;
}

export function QuestionInput({
  question,
  questionnaireResponses,
  encounterId,
  updateQuestionnaireResponseCB,
  errors,
  clearError,
  disabled,
  facilityId,
}: QuestionInputProps) {
  const questionnaireResponse = questionnaireResponses.find(
    (v) => v.question_id === question.id,
  );

  if (!questionnaireResponse) {
    return null;
  }

  const isQuestionEnabled = () => {
    if (!question.enable_when?.length) return true;

    const checkCondition = (enableWhen: EnableWhen) => {
      const dependentValue = questionnaireResponses.find(
        (v) => v.link_id === enableWhen.question,
      )?.values[0];

      // Early return if no dependent value exists
      if (!dependentValue?.value) return false;

      switch (enableWhen.operator) {
        case "exists":
          return dependentValue !== undefined && dependentValue !== null;
        case "equals":
          return dependentValue.value === enableWhen.answer;
        case "not_equals":
          return dependentValue.value !== enableWhen.answer;
        case "greater":
          return (
            typeof dependentValue.value === "number" &&
            dependentValue.value > enableWhen.answer
          );
        case "less":
          return (
            typeof dependentValue.value === "number" &&
            dependentValue.value < enableWhen.answer
          );
        case "greater_or_equals":
          return (
            typeof dependentValue.value === "number" &&
            dependentValue.value >= enableWhen.answer
          );
        case "less_or_equals":
          return (
            typeof dependentValue.value === "number" &&
            dependentValue.value <= enableWhen.answer
          );
        default:
          return true;
      }
    };

    return question.enable_behavior === "any"
      ? question.enable_when.some(checkCondition)
      : question.enable_when.every(checkCondition);
  };

  const handleAddValue = () => {
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [...questionnaireResponse.values, { type: "string", value: "" }],
    });
  };

  const removeValue = (index: number) => {
    const updatedValues = questionnaireResponse.values.filter(
      (_, i) => i !== index,
    );
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: updatedValues,
    });
  };

  const renderSingleInput = (index: number = 0) => {
    const isEnabled = isQuestionEnabled();

    const commonProps = {
      classes: question.styling_metadata?.classes,
      question,
      questionnaireResponse,
      updateQuestionnaireResponseCB,
      disabled: !isEnabled || disabled,
      clearError,
      index,
    };

    switch (question.type) {
      case "dateTime":
        return <DateTimeQuestion {...commonProps} />;

      case "decimal":
      case "integer":
        return <NumberQuestion {...commonProps} />;

      case "choice":
        return <ChoiceQuestion {...commonProps} />;

      case "text":
      case "string":
        return <TextQuestion {...commonProps} />;

      case "boolean":
        return <BooleanQuestion {...commonProps} />;

      case "structured":
        switch (question.structured_type) {
          case "medication_request":
            return <MedicationRequestQuestion {...commonProps} />;
          case "medication_statement":
            return <MedicationStatementQuestion {...commonProps} />;
          case "allergy_intolerance":
            return <AllergyQuestion {...commonProps} />;
          case "symptom":
            return <SymptomQuestion {...commonProps} />;
          case "diagnosis":
            return <DiagnosisQuestion {...commonProps} />;
          case "follow_up_appointment":
            return <FollowUpAppointmentQuestion {...commonProps} />;
          case "encounter":
            if (encounterId) {
              return (
                <EncounterQuestion
                  {...commonProps}
                  encounterId={encounterId}
                  facilityId={facilityId}
                />
              );
            }
            return null;
        }
        return null;

      case "display":
        return null;

      default:
        return <TextQuestion {...commonProps} />;
    }
  };

  const renderInput = () => {
    const values = !questionnaireResponse.values.length
      ? [{ value: "", type: "string" } as ResponseValue]
      : questionnaireResponse.values;

    return (
      <div className="space-y-2">
        {values.map((value, index) => {
          const removeButton = question.repeats &&
            questionnaireResponse.values.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeValue(index)}
                className="h-10 w-10"
                disabled={disabled}
              >
                <CareIcon icon="l-trash" className="h-4 w-4" />
              </Button>
            );

          return (
            <div key={index} className="mt-2 gap-2">
              <div>{renderSingleInput(index)}</div>
              {removeButton}
            </div>
          );
        })}
        {question.repeats && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddValue}
            className="mt-2"
            disabled={!isQuestionEnabled() || disabled}
          >
            <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
            Add Another
          </Button>
        )}
      </div>
    );
  };

  const isEnabled = isQuestionEnabled();
  if (!isEnabled && question.disabled_display === "hidden") {
    return null;
  }

  const error = errors.find((e) => e.question_id === question.id)?.error;

  return (
    <div className="space-y-2">
      {renderInput()}
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      {/* Notes are not available for structured questions */}
      {!question.structured_type && (
        <NotesInput
          questionnaireResponse={questionnaireResponse}
          updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
          disabled={!isEnabled}
        />
      )}
    </div>
  );
}
