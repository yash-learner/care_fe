import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import request from "@/Utils/request/request";
import { displayCode, formatDateTime } from "@/Utils/utils";
import { CodeableConcept } from "@/types/emr/base";
import { Specimen } from "@/types/emr/specimen";

import { SpecimenInfoCard } from "../SpecimenInfoCard";
import { displaySpecimenId } from "../utils";

export const ReceiveSpecimen: React.FC = () => {
  const [scannedSpecimen, setScannedSpecimen] = React.useState<Specimen>();
  const [note, setNote] = React.useState<string>();
  const [approvedSpecimens, setApprovedSpecimens] = React.useState<Specimen[]>(
    [],
  );

  const { mutate: receiveAtLab } = useMutation({
    mutationFn: mutate(routes.labs.specimen.ReceiveAtLab, {
      pathParams: {
        id: scannedSpecimen?.id ?? "",
      },
    }),
    onSuccess: (data: Specimen) => {
      setApprovedSpecimens((prev) => [...prev, data]);
      setScannedSpecimen(undefined);
      setNote(undefined);
      form.reset();
    },
    onError: (err: any) => {
      console.error("Error receiving specimen:", err);
    },
  });

  const CONDITION_CODE_SYSTEM = "http://terminology.hl7.org/CodeSystem/v2-0493";

  const specimenConditionMap: Record<
    string,
    { code: string; display: string }
  > = {
    Autolyzed: { code: "AUT", display: "Autolyzed" },
    Clotted: { code: "CLOT", display: "Clotted" },
    Contaminated: { code: "CON", display: "Contaminated" },
    Cool: { code: "COOL", display: "Cool" },
    Frozen: { code: "FROZ", display: "Frozen" },
    Hemolyzed: { code: "HEM", display: "Hemolyzed" },
    Live: { code: "LIVE", display: "Live" },
    "Room temperature": { code: "ROOM", display: "Room temperature" },
    "Sample not received": { code: "SNR", display: "Sample not received" },
    Centrifuged: { code: "CFU", display: "Centrifuged" },
  };

  const SpecimenIntegrityFormSchema = z.object({
    Autolyzed: z.enum(["Yes", "No"]),
    Clotted: z.enum(["Yes", "No"]),
    Contaminated: z.enum(["Yes", "No"]),
    Cool: z.enum(["Yes", "No"]),
    Frozen: z.enum(["Yes", "No"]),
    Hemolyzed: z.enum(["Yes", "No"]),
    Live: z.enum(["Yes", "No"]),
    "Room temperature": z.enum(["Yes", "No"]),
    "Sample not received": z.enum(["Yes", "No"]),
    Centrifuged: z.enum(["Yes", "No"]),
    note: z.string().optional(),
  });

  type SpecimenIntegrityFormData = z.infer<typeof SpecimenIntegrityFormSchema>;

  function createSpecimenConditionArray(
    formData: SpecimenIntegrityFormData,
  ): CodeableConcept[] {
    const condition: CodeableConcept[] = [];

    // For each property of the form data...
    Object.entries(formData).forEach(([param, value]) => {
      if (param === "note") return; // skip the note field
      if (value === "Yes") {
        // Only add condition if user said "Yes"
        const { code, display } = specimenConditionMap[param] ?? {};
        if (!code) return; // If no mapping found, skip

        condition.push({
          coding: [
            {
              system: CONDITION_CODE_SYSTEM,
              code,
              display,
            },
          ],
          text: display, // e.g., "Clotted"
        });
      }
    });

    return condition;
  }

  const specimenIntegrityChecks = [
    { parameter: "Autolyzed", options: ["Yes", "No"] },
    { parameter: "Clotted", options: ["Yes", "No"] },
    { parameter: "Contaminated", options: ["Yes", "No"] },
    { parameter: "Cool", options: ["Yes", "No"] },
    { parameter: "Frozen", options: ["Yes", "No"] },
    { parameter: "Hemolyzed", options: ["Yes", "No"] },
    { parameter: "Live", options: ["Yes", "No"] },
    { parameter: "Room temperature", options: ["Yes", "No"] },
    { parameter: "Sample not received", options: ["Yes", "No"] },
    { parameter: "Centrifuged", options: ["Yes", "No"] },
  ];

  const form = useForm<SpecimenIntegrityFormData>({
    resolver: zodResolver(SpecimenIntegrityFormSchema),
    defaultValues: Object.fromEntries(
      specimenIntegrityChecks.map((check) => [check.parameter, "No"]),
    ) as any,
  });

  const onSubmit = (data: SpecimenIntegrityFormData) => {
    // 1) Convert “Yes” answers to Specimen.condition
    const newConditions = createSpecimenConditionArray(data);

    const newNote = data.note?.trim() || undefined;

    const updated: Specimen = {
      ...scannedSpecimen!,
      condition: newConditions,
      note: newNote,
    };

    receiveAtLab({
      note: data.note,
      condition: newConditions,
    });
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-5 py-1">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight">Receive Specimen at Lab</h2>
      <div className="flex flex-col bg-white shadow-sm rounded-sm p-4 gap-5">
        {scannedSpecimen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
                  Success
                </span>
                <span className="text-green-900 font-semibold">
                  Barcode Scanned Successfully
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 bg-white">
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Specimen id
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {displaySpecimenId(scannedSpecimen)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Specimen type
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {displayCode(scannedSpecimen.type)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Date of collection
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {formatDateTime(scannedSpecimen.collected_at)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Patient Name, ID
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.subject.name}
                </p>
                <p className="text-sm text-gray-600">
                  {scannedSpecimen.subject.id || "T105690908240017"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.request.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-md">
              <div className="mt-4 bg-gray-50 rounded-sm p-4 flex flex-col gap-4">
                <div className="rounded-md space-y-4">
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-normal text-gray-600">
                        Test
                      </h3>
                      <p className="text-base font-medium text-gray-900">
                        {scannedSpecimen.type.display ??
                          scannedSpecimen.type.code}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-normal text-gray-600">
                        Tube Type
                      </h3>
                      <p className="text-base font-medium text-gray-900">
                        Not Specified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-md">
                      <CareIcon
                        icon="l-info-circle"
                        className="h-6 w-6 text-blue-600"
                      />
                    </div>
                    <p className="ml-4 text-sm font-medium text-blue-800">
                      {scannedSpecimen.request?.note || "No note provided"}
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-4 border rounded-md space-y-4"
                  >
                    <Label className="text-base font-medium text-gray-600">
                      Specimen Integrity Check
                    </Label>
                    {specimenIntegrityChecks.map(({ parameter, options }) => (
                      <FormField
                        key={parameter}
                        control={form.control}
                        name={parameter as keyof SpecimenIntegrityFormData}
                        render={({ field }) => (
                          <FormItem className="table-row">
                            <div className="table-cell py-2 pr-4 align-top">
                              <FormLabel className="">{parameter}</FormLabel>
                            </div>
                            <div className="table-cell px-4 py-2 align-top">
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="flex gap-4 mt-1 space-x-4"
                                >
                                  {options.map((option) => {
                                    const id = `${parameter}-${option}`;
                                    return (
                                      <div
                                        key={id}
                                        className="flex items-center gap-2"
                                      >
                                        <RadioGroupItem
                                          id={id}
                                          value={option}
                                        />
                                        <FormLabel htmlFor={id} className="">
                                          {option}
                                        </FormLabel>
                                      </div>
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                            </div>
                            <div className="table-cell px-4 py-2 align-top">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}

                    {/* Optional note field */}
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Note (optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your note..."
                              {...field}
                              className="resize-none mt-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" disabled type="button">
                        Reject Specimen
                      </Button>
                      <Button variant="primary" type="submit">
                        Accept Specimen
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-normal text-gray-900">Barcode</Label>
            <Input
              type="text"
              placeholder="Scan Barcode/Enter number"
              className="text-center"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const barcode = e.currentTarget.value;

                  const { res, data } = await request(
                    routes.labs.specimen.get,
                    {
                      pathParams: {
                        id: barcode,
                      },
                    },
                  );

                  if (!res?.ok || !data) {
                    return;
                  }

                  setScannedSpecimen(data);
                }
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Received at Lab
        </Label>

        <div className="flex flex-col gap-4 mt-6">
          {approvedSpecimens.map((specimen) => (
            <ReceiveSpecimenCollapsible key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReceiveSpecimenCollapsible: React.FC<{
  specimen: Specimen;
}> = ({ specimen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
        <div
          className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4`}
        >
          <div className="flex items-center gap-4 justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Specimen id
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {specimen.identifier ?? specimen.id}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-900 rounded">
                  Received at Lab
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <div className="">
                      {isOpen ? (
                        <ChevronUpIcon className="h-6 w-8" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-8" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
          {/* Expanded Content */}
          <CollapsibleContent>
            <SpecimenInfoCard specimen={specimen} />
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};
