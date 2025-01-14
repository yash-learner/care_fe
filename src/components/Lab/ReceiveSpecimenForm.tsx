import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export const SpecimenIntegrityFormSchema = z.object({
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

interface ReceiveSpecimenFormProps {
  onSubmit: SubmitHandler<SpecimenIntegrityFormData>;
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

export const ReceiveSpecimenForm: React.FC<ReceiveSpecimenFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<SpecimenIntegrityFormData>({
    resolver: zodResolver(SpecimenIntegrityFormSchema),
    defaultValues: Object.fromEntries(
      specimenIntegrityChecks.map((check) => [check.parameter, "No"]),
    ) as SpecimenIntegrityFormData,
  });

  return (
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
                  <FormLabel>{parameter}</FormLabel>
                </div>
                <div className="table-cell px-4 py-2 align-top">
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4 mt-1 space-x-4"
                    >
                      {options.map((option) => (
                        <div
                          key={`${parameter}-${option}`}
                          className="flex items-center gap-2"
                        >
                          <RadioGroupItem
                            id={`${parameter}-${option}`}
                            value={option}
                          />
                          <FormLabel htmlFor={`${parameter}-${option}`}>
                            {option}
                          </FormLabel>
                        </div>
                      ))}
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

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Note (optional)</FormLabel>
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
  );
};
