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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export const specimenIntegrityChecks = [
  "Autolyzed",
  "Clotted",
  "Contaminated",
  "Cool",
  "Frozen",
  "Hemolyzed",
  "Live",
  "Room temperature",
  "Sample not received",
  "Centrifuged",
].map((parameter) => ({ parameter, options: ["Yes", "No"], note: "" }));

const specimenConditionSchema = specimenIntegrityChecks.reduce(
  (schema, { parameter }) => {
    schema[parameter] = z.object({
      value: z.enum(["Yes", "No"]),
      note: z.string().optional(),
    });
    return schema;
  },
  {} as Record<
    string,
    z.ZodObject<{
      value: z.ZodEnum<["Yes", "No"]>;
      note: z.ZodOptional<z.ZodString>;
    }>
  >,
);

export const specimenIntegrityFormSchema = z.object({
  parameters: z.object(specimenConditionSchema),
  additionalNote: z.string().optional(),
});

export type SpecimenIntegrityFormData = z.infer<
  typeof specimenIntegrityFormSchema
>;

interface ReceiveSpecimenFormProps {
  onSubmit: SubmitHandler<SpecimenIntegrityFormData>;
}

export const ReceiveSpecimenForm: React.FC<ReceiveSpecimenFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<SpecimenIntegrityFormData>({
    resolver: zodResolver(specimenIntegrityFormSchema),
    defaultValues: {
      parameters: Object.fromEntries(
        specimenIntegrityChecks.map((check) => [
          check.parameter,
          { value: "No", note: "" },
        ]),
      ) as Record<string, { value: "Yes" | "No"; note: string }>,
      additionalNote: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4 border rounded-md space-y-4"
      >
        <div className="flex space-x-36">
          <Label className="text-base font-medium text-gray-600">
            Specimen Integrity Check
          </Label>

          <Label className="text-base font-medium text-gray-600">
            Note (optional)
          </Label>
        </div>
        {specimenIntegrityChecks.map(({ parameter, options }) => (
          <FormField
            key={parameter}
            control={form.control}
            name={`parameters.${parameter}`}
            render={({ field }) => (
              <FormItem className="table-row">
                <div className="table-cell py-2 pr-4 align-top">
                  <FormLabel>{parameter}</FormLabel>
                </div>
                <div className="table-cell px-4 py-2 align-top">
                  <FormControl>
                    <RadioGroup
                      value={field.value?.value || "No"}
                      onValueChange={(value) =>
                        field.onChange({ ...field.value, value })
                      }
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
                  <FormControl>
                    <Input
                      value={field.value?.note || ""}
                      onChange={(e) =>
                        field.onChange({ ...field.value, note: e.target.value })
                      }
                    />
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
          name="additionalNote"
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
