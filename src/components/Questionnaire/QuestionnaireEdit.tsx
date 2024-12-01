import { useNavigate } from "raviger";
import { useEffect, useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import useQuery from "@/Utils/request/useQuery";
import type {
  AnswerOption,
  Code,
  Question,
  QuestionStatus,
  QuestionType,
  QuestionnaireDetail,
  SubjectType,
} from "@/types/questionnaire";

import Loading from "../Common/Loading";

interface QuestionFormProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: () => void;
  depth?: number;
}

function QuestionForm({
  question,
  onChange,
  onDelete,
  depth = 0,
}: QuestionFormProps) {
  const handleChange = (
    field: keyof Question,
    value: QuestionType | string,
  ) => {
    onChange({ ...question, [field]: value });
  };

  const handleCodeChange = (field: keyof Code, value: string) => {
    const newCode: Code = {
      system: question.code?.system || "",
      code: question.code?.code || "",
      display: question.code?.display || "",
      [field]: value,
    };
    onChange({
      ...question,
      code: newCode,
    });
  };

  const handleSubQuestionChange = (
    index: number,
    updatedQuestion: Question,
  ) => {
    if (question.type === "group" && question.questions) {
      const newQuestions = [...question.questions];
      newQuestions[index] = updatedQuestion;
      onChange({ ...question, questions: newQuestions });
    }
  };

  const addSubQuestion = () => {
    if (question.type === "group") {
      const newQuestion: Question = {
        id: crypto.randomUUID(),
        link_id: crypto.randomUUID(),
        text: "",
        type: "string",
        code: { system: "", code: "", display: "" },
      };
      onChange({
        ...question,
        questions: [...(question.questions || []), newQuestion],
      });
    }
  };

  const deleteSubQuestion = (index: number) => {
    if (question.type === "group" && question.questions) {
      const newQuestions = question.questions.filter(
        (_: Question, i: number) => i !== index,
      );
      onChange({ ...question, questions: newQuestions });
    }
  };

  const addAnswerOption = () => {
    const newOption: AnswerOption = {
      value: "",
      initialSelected: false,
    };
    onChange({
      ...question,
      answer_option: [...(question.answer_option || []), newOption],
    });
  };

  const handleAnswerOptionChange = (index: number, value: string) => {
    if (!question.answer_option) return;

    const newOptions = [...question.answer_option];
    newOptions[index] = { ...newOptions[index], value };
    onChange({
      ...question,
      answer_option: newOptions,
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question</CardTitle>
          {depth > 0 && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <CareIcon icon="l-trash" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={question.text}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={question.type}
              onValueChange={(value: QuestionType) =>
                handleChange("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="integer">Integer</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="choice">Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Code System</Label>
            <Input
              value={question.code?.system || ""}
              onChange={(e) => handleCodeChange("system", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input
              value={question.code?.code || ""}
              onChange={(e) => handleCodeChange("code", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Display</Label>
            <Input
              value={question.code?.display || ""}
              onChange={(e) => handleCodeChange("display", e.target.value)}
            />
          </div>
        </div>

        {question.type === "group" && (
          <div className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Sub Questions</h4>
              <Button size="sm" onClick={addSubQuestion}>
                <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
            <div className="border-l pl-4">
              {question.questions?.map((q, index) => (
                <QuestionForm
                  key={q.id}
                  question={q}
                  onChange={(updatedQuestion) =>
                    handleSubQuestionChange(index, updatedQuestion)
                  }
                  onDelete={() => deleteSubQuestion(index)}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
        )}

        {question.type === "choice" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAnswerOption}
              >
                <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {question.answer_option?.map(
                (option: AnswerOption, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.value.toString()}
                      onChange={(e) =>
                        handleAnswerOptionChange(index, e.target.value)
                      }
                      placeholder="Option value"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newOptions = (
                          question.answer_option || []
                        ).filter((_: AnswerOption, i: number) => i !== index);
                        onChange({
                          ...question,
                          answer_option: newOptions,
                        });
                      }}
                    >
                      <CareIcon icon="l-trash" className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuestionnaireEdit({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<QuestionnaireDetail>>({
    title: "",
    description: "",
    status: "active",
    subject_type: "patient",
    questions: [],
  });

  const { data: detailData, loading: detailLoading } = useQuery(
    id
      ? routes.questionnaire.detail
      : {
          path: "/api/v1/questionnaire/dummy",
          method: "GET",
          TRes: {} as QuestionnaireDetail,
        },
    id ? { pathParams: { id } } : undefined,
  );

  useEffect(() => {
    if (id && detailData) {
      setFormData(detailData);
    }
  }, [id, detailData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (id) {
        await request(routes.questionnaire.update, {
          pathParams: { id },
          body: formData,
        });
      } else {
        await request(routes.questionnaire.create, {
          body: formData,
        });
      }
      navigate("/questionnaire");
    } catch (error) {
      console.error("Failed to save questionnaire:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      link_id: crypto.randomUUID(),
      text: "New Question",
      type: "string",
      code: { system: "", code: "", display: "" },
    };
    setFormData((prev: Partial<QuestionnaireDetail>) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  if (id && detailLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {id ? "Edit Questionnaire" : "Create New Questionnaire"}
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/questionnaire")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <CareIcon
                    icon="l-spinner"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                  Saving...
                </>
              ) : (
                "Save Questionnaire"
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Enter questionnaire title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter questionnaire description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: QuestionStatus) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject Type</Label>
                  <Select
                    value={formData.subject_type}
                    onValueChange={(value: SubjectType) =>
                      setFormData((prev) => ({ ...prev, subject_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions</CardTitle>
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
                  Add New Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!formData.questions?.length ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                  <CareIcon icon="l-file-medical" className="mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-medium">
                    No Questions Added
                  </h3>
                  <p className="mb-4">
                    Start building your questionnaire by adding questions
                  </p>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.questions?.map((question, index) => (
                    <QuestionForm
                      key={question.id}
                      question={question}
                      onChange={(updatedQuestion) => {
                        const newQuestions = [...(formData.questions || [])];
                        newQuestions[index] = updatedQuestion;
                        setFormData((prev) => ({
                          ...prev,
                          questions: newQuestions,
                        }));
                      }}
                      onDelete={() => {
                        const newQuestions = (formData.questions || []).filter(
                          (_, i) => i !== index,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          questions: newQuestions,
                        }));
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
