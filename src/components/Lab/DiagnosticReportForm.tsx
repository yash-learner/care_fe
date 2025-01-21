import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";

import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

import { Code } from "@/types/questionnaire/code";

import { LabObservationItem } from "./LabObservationItem";

const observationSchema = z.object({
  main_code: z.object({
    code: z.string().nonempty("Code is required"),
    system: z
      .string()
      .nonempty("System is required")
      .default("http://loinc.org"),
    display: z.string().optional(),
  }),
  value: z.object({
    value_quantity: z.object({
      value: z.string().nonempty("Result is required"),
      code: z.object({
        code: z.string().nonempty("Unit code is required"),
        display: z.string().optional(),
        system: z.string().default("http://unitsofmeasure.org"),
      }),
    }),
  }),
  note: z.string().optional(),
});

const diagnosticReportSchema = z.object({
  observations: z.array(observationSchema),
});

export type DiagnosticReportFormValues = z.infer<typeof diagnosticReportSchema>;

interface DiagnosticReportFormProps {
  question: string;
  defaultValues?: DiagnosticReportFormValues;
  disabled?: boolean;
  isPending?: boolean;
  onSubmit?: (data: DiagnosticReportFormValues) => void;
  onCancel?: () => void;
}

export const DiagnosticReportForm: React.FC<DiagnosticReportFormProps> = ({
  question,
  defaultValues,
  disabled,
  isPending,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const form = useForm<DiagnosticReportFormValues>({
    resolver: zodResolver(diagnosticReportSchema),
    defaultValues: defaultValues || {
      observations: [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "observations",
  });

  const handleAddObservation = (code: Code) => {
    append({
      main_code: {
        code: code.code,
        system: code.system || "http://loinc.org",
        display: code.display,
      },
      value: {
        value_quantity: {
          value: "",
          code: {
            code: "Select Unit",
            system: "http://unitsofmeasure.org",
          },
        },
      },
      note: "",
    });
  };

  const handleFormSubmit = (data: DiagnosticReportFormValues) => {
    onSubmit?.(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 mt-4"
      >
        <h2 className="text-lg font-semibold">{question}</h2>

        <div className="rounded-lg border flex flex-col">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <LabObservationItem
                index={index}
                disabled={disabled}
                onRemove={() => remove(index)}
              />
              <div className="border-l-[2.5px] border-gray-300 w-5 h-12 ms-8 last:hidden" />
            </React.Fragment>
          ))}
        </div>

        <ValueSetSelect
          system="system-observation"
          placeholder={t("search_lab_observation")}
          onSelect={(code) => handleAddObservation(code)}
          disabled={disabled}
        />

        <FormMessage />

        <div className="flex items-center justify-end gap-4 pt-4">
          {onCancel && (
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={onCancel}
              disabled={disabled}
            >
              {t("cancel")}
            </Button>
          )}
          <Button variant="primary" size="lg" type="submit" disabled={disabled}>
            {isPending ? (
              <>
                <span className="mr-2">{t("submitting")}</span>
                <CareIcon icon="l-spinner" className="h-4 w-4 animate-spin" />
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
