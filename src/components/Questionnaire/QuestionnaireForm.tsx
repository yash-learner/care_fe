import { useEffect, useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Loading from "@/components/Common/Loading";

import { Error, Success } from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import useMutation from "@/Utils/request/useMutation";
import useQuery from "@/Utils/request/useQuery";
import {
  DetailedValidationError,
  QuestionValidationError,
  ValidationErrorResponse,
} from "@/types/questionnaire/batch";
import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";
import { QuestionnaireDetail } from "@/types/questionnaire/questionnaire";

import { QuestionGroup } from "./QuestionTypes/QuestionGroup";

interface QuestionnaireFormState {
  questionnaire: QuestionnaireDetail;
  responses: QuestionnaireResponse[];
  errors: QuestionValidationError[];
}

export interface QuestionnaireFormProps {
  questionnaireSlug?: string;
  resourceId: string;
  encounterId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function QuestionnaireForm({
  questionnaireSlug,
  resourceId,
  encounterId,
  onSubmit,
  onCancel,
}: QuestionnaireFormProps) {
  const [questionnaireForms, setQuestionnaireForms] = useState<
    QuestionnaireFormState[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: questionnaireData,
    loading: isQuestionnaireLoading,
    error: questionnaireError,
  } = useQuery(routes.questionnaire.detail, {
    pathParams: { id: questionnaireSlug ?? "" },
    prefetch: !!questionnaireSlug,
  });

  const {
    data: questionnaireList,
    loading: listLoading,
    error: listError,
  } = useQuery(routes.questionnaire.list);

  const {
    mutate: submitBatch,
    isProcessing,
    error: submitError,
  } = useMutation(routes.batchRequest, {});

  useEffect(() => {
    if (questionnaireData) {
      setQuestionnaireForms([
        {
          questionnaire: questionnaireData,
          responses: [],
          errors: [],
        },
      ]);
    }
  }, [questionnaireData]);

  if (questionnaireSlug && isQuestionnaireLoading) {
    return <Loading />;
  }

  if (questionnaireSlug && questionnaireError) {
    return (
      <Alert variant="destructive">
        <CareIcon icon="l-exclamation-circle" className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load questionnaire. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const clearErrors = (questionnaireId: string) => {
    setQuestionnaireForms((prev) =>
      prev.map((form) =>
        form.questionnaire.id === questionnaireId
          ? { ...form, errors: [] }
          : form,
      ),
    );
  };

  const updateQuestionnaireResponse = (
    questionnaireId: string,
    response: QuestionnaireResponse,
  ) => {
    setQuestionnaireForms((prev) =>
      prev.map((form) =>
        form.questionnaire.id === questionnaireId
          ? {
              ...form,
              responses: form.responses
                .filter((r) => r.question_id !== response.question_id)
                .concat(response),
              errors: form.errors.filter(
                (e) => e.question_id !== response.question_id,
              ),
            }
          : form,
      ),
    );
  };

  const handleSubmissionError = (results: ValidationErrorResponse[]) => {
    const updatedForms = [...questionnaireForms];
    const errorMessages: string[] = [];
    console.log("results", results);

    results.forEach((result, index) => {
      const form = updatedForms[index];

      result.data.errors.forEach(
        (error: QuestionValidationError | DetailedValidationError) => {
          // Handle question-specific errors
          if ("question_id" in error) {
            form.errors.push({
              question_id: error.question_id,
              error: error.error,
            } as QuestionValidationError);
            console.log("form", form.errors);
            updatedForms[index] = form;
          }

          // Handle form-level errors
          else if ("loc" in error) {
            const fieldName = error.loc[0];
            errorMessages.push(
              `Error in ${form.questionnaire.title}: ${fieldName} - ${error.msg}`,
            );
          }
          // Handle generic errors
          else {
            errorMessages.push(`Error in ${form.questionnaire.title}`);
          }
        },
      );
    });
    setQuestionnaireForms(updatedForms);
  };

  const handleSubmit = async () => {
    const hasErrors = questionnaireForms.some((form) => form.errors.length > 0);

    if (hasErrors) {
      return;
    }

    const response = await submitBatch({
      body: {
        requests: questionnaireForms.map((form) => ({
          url: `/api/v1/questionnaire/${form.questionnaire.slug}/submit/`,
          method: "POST",
          body: {
            resource_id: resourceId,
            encounter: encounterId,
            results: form.responses.map((response) => ({
              question_id: response.question_id,
              values: response.values.map((value) => ({
                ...(value.code
                  ? { code: value.code }
                  : { value: String(value.value || "") }),
              })),
              note: response.note,
              body_site: response.body_site,
              method: response.method,
            })),
          },
        })),
      },
    });

    if (!response.data) {
      if (response.error) {
        handleSubmissionError(
          response.error.results as ValidationErrorResponse[],
        );
        Error({ msg: "Failed to submit questionnaire" });
      }
    } else {
      Success({ msg: "Questionnaire submitted successfully" });
      onSubmit?.();
    }
  };

  const addQuestionnaire = (selected: QuestionnaireDetail) => {
    setQuestionnaireForms((prev) => {
      if (prev.some((form) => form.questionnaire.id === selected.id))
        return prev;
      return [...prev, { questionnaire: selected, responses: [], errors: [] }];
    });
    setIsOpen(false);
  };

  const removeQuestionnaire = (id: string) => {
    if (id !== questionnaireData?.id) {
      setQuestionnaireForms((prev) =>
        prev.filter((form) => form.questionnaire.id !== id),
      );
    }
  };

  const availableQuestionnaires =
    questionnaireList?.results?.filter(
      (item) =>
        !questionnaireForms.some((form) => form.questionnaire.id === item.id),
    ) || [];

  const filteredQuestionnaires = availableQuestionnaires.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={listLoading}
            >
              {listLoading ? (
                <>
                  <CareIcon
                    icon="l-spinner"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                  Loading...
                </>
              ) : (
                <span className="text-muted-foreground">
                  {questionnaireForms.length === 0
                    ? "Add a questionnaire to get started"
                    : "Add another questionnaire"}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          {!listLoading && !listError && (
            <PopoverContent className="w-[600px] p-0" align="start">
              <div className="flex items-center border-b px-3">
                <CareIcon
                  icon="l-search"
                  className="mr-2 h-4 w-4 shrink-0 text-muted-foreground"
                />
                <input
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Search forms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[400px] overflow-y-auto p-0">
                {filteredQuestionnaires.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    No forms found
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {filteredQuestionnaires.map((item) => (
                      <button
                        key={item.id}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => addQuestionnaire(item)}
                      >
                        <div className="flex items-center space-x-3">
                          <CareIcon icon="l-file-export" className="h-4 w-4" />
                          <div className="space-y-1 text-left">
                            <div>{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>

      {listError && (
        <Alert variant="destructive">
          <CareIcon icon="l-exclamation-circle" className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load questionnaire list. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {questionnaireForms.map((form) => (
          <div key={form.questionnaire.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                {form.questionnaire.title}
              </h2>
              {form.questionnaire.id !== questionnaireData?.id && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestionnaire(form.questionnaire.id)}
                >
                  Remove
                </Button>
              )}
            </div>
            {form.questionnaire.questions.map((question: Question) => (
              <div key={question.id} className="rounded-lg border bg-card p-4">
                <QuestionGroup
                  question={question}
                  questionnaireResponses={form.responses}
                  updateQuestionnaireResponseCB={(response) =>
                    updateQuestionnaireResponse(form.questionnaire.id, response)
                  }
                  errors={form.errors}
                  clearError={() => clearErrors(form.questionnaire.id)}
                />
              </div>
            ))}
          </div>
        ))}

        {questionnaireForms.length > 0 && (
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </form>
      {submitError && (
        <Alert variant="destructive" className="mt-4">
          Failed to submit questionnaire
        </Alert>
      )}
    </div>
  );
}
