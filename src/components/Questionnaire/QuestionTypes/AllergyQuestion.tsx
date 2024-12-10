"use client";

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
import { AllergyIntolerance } from "@/types/questionnaire/allergyIntolerance";
import { QuestionnaireResponse } from "@/types/questionnaire/form";
import { Question } from "@/types/questionnaire/question";

interface AllergyQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function AllergyQuestion({
  question,
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: AllergyQuestionProps) {
  const [allergies, setAllergies] = useState<AllergyIntolerance[]>(() => {
    return (
      (questionnaireResponse.values?.[0]?.value as AllergyIntolerance[]) || []
    );
  });

  const allergySearch = useQuery(routes.valueset.expand, {
    pathParams: { system: "system-allergy-code" },
    body: { count: 10 },
    prefetch: false,
  });

  const handleAddAllergy = () => {
    const newAllergies = [
      ...allergies,
      { code: { code: "", display: "", system: "" } },
    ];
    setAllergies(newAllergies);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "allergy_intolerance",
          value: newAllergies,
        },
      ],
    });
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = allergies.filter((_, i) => i !== index);
    setAllergies(newAllergies);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "allergy_intolerance",
          value: newAllergies,
        },
      ],
    });
  };

  const updateAllergy = (
    index: number,
    updates: Partial<AllergyIntolerance>,
  ) => {
    const newAllergies = allergies.map((allergy, i) =>
      i === index ? { ...allergy, ...updates } : allergy,
    );
    setAllergies(newAllergies);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "allergy_intolerance",
          value: newAllergies,
        },
      ],
    });
  };

  console.log(allergies);

  return (
    <div className="space-y-4">
      <Label>{question.text}</Label>
      <div className="rounded-lg border p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Substance</TableHead>
                <TableHead className="w-[150px]">Clinical Status</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[150px]">Criticality</TableHead>
                <TableHead className="w-[150px]">Verification</TableHead>
                <TableHead className="w-[150px]">Last Occurrence</TableHead>
                <TableHead className="w-[200px]">Note</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allergies.map((allergy, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild disabled={disabled}>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between truncate"
                        >
                          {allergy.code.display || "Search allergies..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command filter={() => 1}>
                          <CommandInput
                            placeholder="Search allergies..."
                            className="my-1"
                            onValueChange={(search) =>
                              allergySearch.refetch({ body: { search } })
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              {allergySearch.loading
                                ? "Loading..."
                                : "No allergies found"}
                            </CommandEmpty>
                            <CommandGroup>
                              {allergySearch.data?.results.map((option) => (
                                <CommandItem
                                  key={option.code}
                                  value={option.code}
                                  onSelect={() => {
                                    updateAllergy(index, {
                                      code: {
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
                    <Select
                      value={allergy.clinicalStatus}
                      onValueChange={(value) =>
                        updateAllergy(index, { clinicalStatus: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={allergy.category}
                      onValueChange={(value) =>
                        updateAllergy(index, { category: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="biologic">Biologic</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={allergy.criticality}
                      onValueChange={(value) =>
                        updateAllergy(index, { criticality: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Criticality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="unable-to-assess">
                          Unable to Assess
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={allergy.verificationStatus}
                      onValueChange={(value) =>
                        updateAllergy(index, { verificationStatus: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                        <SelectItem value="presumed">Presumed</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="refuted">Refuted</SelectItem>
                        <SelectItem value="entered-in-error">
                          Entered in Error
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <input
                      type="date"
                      className="w-full rounded-md border p-2"
                      value={allergy.lastOccurrence || ""}
                      onChange={(e) =>
                        updateAllergy(index, { lastOccurrence: e.target.value })
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <input
                      type="text"
                      className="w-full rounded-md border p-2"
                      placeholder="Note"
                      value={allergy.note || ""}
                      onChange={(e) =>
                        updateAllergy(index, { note: e.target.value })
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[50px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveAllergy(index)}
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
          onClick={handleAddAllergy}
          disabled={disabled}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Allergy
        </Button>
      </div>
    </div>
  );
}
