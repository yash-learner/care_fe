import { MinusCircledIcon, TextAlignLeftIcon } from "@radix-ui/react-icons";
import React from "react";
import { useTranslation } from "react-i18next";

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

import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

import { displayCode } from "@/Utils/utils";
import {
  SERVICE_REQUEST_PRIORITY,
  ServiceRequestCreate,
  ServiceRequestPriority,
} from "@/types/emr/serviceRequest";
import { Code } from "@/types/questionnaire/code";
import { QuestionnaireResponse } from "@/types/questionnaire/form";
import { Question } from "@/types/questionnaire/question";

interface LabOrderQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

type LabOrderFormItem = Omit<ServiceRequestCreate, "subject" | "encounter">;

const LAB_ORDER_INITIAL_VALUE: Omit<LabOrderFormItem, "code"> = {
  status: "draft",
  intent: "order",
  priority: "routine",
  category: "laboratory_procedure",
  authored_on: new Date().toISOString(),
  note: undefined,
};

export function LabOrderQuestion({
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: LabOrderQuestionProps) {
  const { t } = useTranslation();

  const requests =
    (questionnaireResponse.values?.[0]?.value as ServiceRequestCreate[]) || [];

  const handleAddRequest = (code: Code) => {
    const newRequests = [
      ...requests,
      { ...LAB_ORDER_INITIAL_VALUE, code },
    ] as ServiceRequestCreate[];
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "lab_order",
          value: newRequests,
        },
      ],
    });
  };

  const handleRemoveRequest = (index: number) => {
    const newRequests = requests.filter((_, i) => i !== index);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [{ type: "lab_order", value: newRequests }],
    });
  };

  const handleUpdateRequest = (
    index: number,
    updates: Partial<LabOrderFormItem>,
  ) => {
    const newRequests = requests.map((request, i) =>
      i === index ? { ...request, ...updates } : request,
    );

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "lab_order",
          value: newRequests,
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      {requests.length > 0 && (
        <div className="rounded-lg border space-y-4">
          <ul className="space-y-2 divide-y-2 divide-gray-200 divide-dashed">
            {requests.map((request, index) => (
              <li key={index}>
                <LabOrderItem
                  request={request}
                  disabled={disabled}
                  onUpdate={(request) => handleUpdateRequest(index, request)}
                  onRemove={() => handleRemoveRequest(index)}
                  index={index}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <ValueSetSelect
        system="system-lab-order-code"
        placeholder={t("search_lab_order")}
        onSelect={handleAddRequest}
        disabled={disabled}
      />
    </div>
  );
}

const LabOrderItem: React.FC<{
  request: ServiceRequestCreate;
  disabled?: boolean;
  onUpdate: (request: Partial<LabOrderFormItem>) => void;
  onRemove: () => void;
  index: number;
}> = ({ request, disabled, onUpdate, onRemove, index }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 justify-between group focus-within:ring-2 ring-gray-300 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">
          {index + 1}. {displayCode(request.code)}
        </h4>
        <div className="flex items-center gap-2">
          <div>
            <Label className="sr-only">{t("priority")}</Label>
            <Select
              value={request.priority}
              onValueChange={(value: ServiceRequestPriority) =>
                onUpdate({ priority: value })
              }
              disabled={disabled}
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder={t("select_priority")} />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_REQUEST_PRIORITY.map((priority) => (
                  <SelectItem
                    key={priority}
                    value={priority}
                    className="capitalize"
                  >
                    {priority.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
      <div className="flex flex-col gap-4">
        {request.note !== undefined && (
          <div className="grid gap-1.5">
            <Label htmlFor="note">{t("note")}</Label>
            <Textarea
              placeholder={t("additional_information")}
              id="note"
              className="bg-white"
              value={request.note ?? ""}
              onChange={(e) => onUpdate({ note: e.target.value })}
            />
          </div>
        )}

        <div className="flex gap-3 flex-wrap mt-2">
          {request.note === undefined && (
            <Button
              onClick={() =>
                onUpdate({
                  note: "",
                })
              }
              variant="secondary"
              className="flex gap-1.5 items-center"
            >
              <TextAlignLeftIcon className="size-4" />
              {t("add_note")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
