import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";
import {
  MEDICATION_REQUEST_CATEGORY,
  MEDICATION_REQUEST_INTENT,
  MEDICATION_REQUEST_PRIORITY,
  MEDICATION_REQUEST_STATUS,
  MedicationRequest,
  MedicationRequestCategory,
  MedicationRequestIntent,
  MedicationRequestPriority,
  MedicationRequestStatus,
} from "@/types/emr/medicationRequest";
import { QuestionnaireResponse } from "@/types/questionnaire/form";
import { Question } from "@/types/questionnaire/question";

interface MedicationQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function MedicationQuestion({
  question,
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: MedicationQuestionProps) {
  const [medications, setMedications] = useState<MedicationRequest[]>(() => {
    return (
      (questionnaireResponse.values?.[0]?.value as MedicationRequest[]) || []
    );
  });

  const medicationSearch = useQuery(routes.valueset.expand, {
    pathParams: { system: "system-medication" },
    body: { count: 10 },
    prefetch: false,
  });

  const handleAddMedication = () => {
    const newMedications: MedicationRequest[] = [
      ...medications,
      {
        status: "active",
        intent: "plan",
        category: "inpatient",
        priority: "urgent",
        do_not_perform: false,
        medication: undefined,
        authored_on: new Date().toISOString(),
        dosage_instruction: [],
      },
    ];
    setMedications(newMedications);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "medication_request",
          value: newMedications,
        },
      ],
    });
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [{ type: "medication_request", value: newMedications }],
    });
  };

  const handleUpdateMedication = (
    index: number,
    updates: Partial<MedicationRequest>,
  ) => {
    const newMedications = medications.map((medication, i) =>
      i === index ? { ...medication, ...updates } : medication,
    );
    setMedications(newMedications);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "medication_request",
          value: newMedications,
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <Label>{question.text}</Label>
      <div className="rounded-lg border p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Medication</TableHead>
                <TableHead className="w-[150px]">Dosage</TableHead>
                <TableHead className="w-[150px]">Intent</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[150px]">Priority</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[200px]">Note</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild disabled={disabled}>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between truncate"
                        >
                          {medication.medication?.display ||
                            "Search medications..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command filter={() => 1}>
                          <CommandInput
                            placeholder="Search allergies..."
                            className="my-1"
                            onValueChange={(search) =>
                              medicationSearch.refetch({ body: { search } })
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              {medicationSearch.loading
                                ? "Loading..."
                                : "No medications found"}
                            </CommandEmpty>
                            <CommandGroup>
                              {medicationSearch.data?.results.map((option) => (
                                <CommandItem
                                  key={option.code}
                                  value={option.code}
                                  onSelect={() => {
                                    handleUpdateMedication(index, {
                                      medication: {
                                        code: option.code,
                                        display: option.display || "",
                                        system: option.system || "",
                                      },
                                    });
                                  }}
                                >
                                  <span>{option.display}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <input
                      type="number"
                      className="w-full rounded-md border p-2"
                      placeholder="Dosage"
                      value={
                        medication.dosage_instruction[0]?.dose_and_rate?.[0]
                          ?.dose_quantity?.value || ""
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={medication.intent}
                      onValueChange={(value) =>
                        handleUpdateMedication(index, {
                          intent: value as MedicationRequestIntent,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Intent" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICATION_REQUEST_INTENT.map((intent) => (
                          <SelectItem
                            key={intent}
                            value={intent}
                            className="capitalize"
                          >
                            {intent.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={medication.category}
                      onValueChange={(value) =>
                        handleUpdateMedication(index, {
                          category: value as MedicationRequestCategory,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICATION_REQUEST_CATEGORY.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="capitalize"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={medication.priority}
                      onValueChange={(value) =>
                        handleUpdateMedication(index, {
                          priority: value as MedicationRequestPriority,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICATION_REQUEST_PRIORITY.map((priority) => (
                          <SelectItem
                            key={priority}
                            value={priority}
                            className="capitalize"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={medication.status}
                      onValueChange={(value) =>
                        handleUpdateMedication(index, {
                          status: value as MedicationRequestStatus,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICATION_REQUEST_STATUS.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="capitalize"
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <input
                      type="text"
                      className="w-full rounded-md border p-2"
                      placeholder="Note"
                      value={medication.note || ""}
                      onChange={(e) =>
                        handleUpdateMedication(index, { note: e.target.value })
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[50px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveMedication(index)}
                      disabled={disabled}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={handleAddMedication}
          disabled={disabled}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>
    </div>
  );
}
