import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  QuestionnaireResponse,
  ResponseValue,
} from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

interface MedicationQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export interface MedicationRow {
  medicine: string;
  route: string;
  dosage: string;
  frequency: string;
  days?: string;
  notes?: string;
}

const ROUTES = ["Oral", "IV", "IM", "SC", "Topical", "Other"];
const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Four times a day",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
];

export function MedicationQuestion({
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: MedicationQuestionProps) {
  const medications = (questionnaireResponse.values[0] ||
    []) as MedicationRow[];

  const updateMedication = (
    index: number,
    field: keyof MedicationRow,
    value: string,
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [updatedMedications] as unknown as ResponseValue[],
    });
  };

  const addMedication = () => {
    const newMedication: MedicationRow = {
      medicine: "",
      route: "",
      dosage: "",
      frequency: "",
      days: "",
      notes: "",
    };

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [medications.concat(newMedication)] as unknown as ResponseValue[],
    });
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [updatedMedications] as unknown as ResponseValue[],
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium">Medicine</th>
              <th className="p-3 text-left text-sm font-medium">Route</th>
              <th className="p-3 text-left text-sm font-medium">Dosage</th>
              <th className="p-3 text-left text-sm font-medium">Frequency</th>
              <th className="p-3 text-left text-sm font-medium">Days</th>
              <th className="p-3 text-left text-sm font-medium">Notes</th>
              <th className="w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {medications.map((medication, index) => (
              <tr key={index} className="bg-white">
                <td className="p-3">
                  <Input
                    value={medication.medicine}
                    onChange={(e) =>
                      updateMedication(index, "medicine", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Search medicines..."
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={medication.route}
                    onValueChange={(value) =>
                      updateMedication(index, "route", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUTES.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input
                    value={medication.dosage}
                    onChange={(e) =>
                      updateMedication(index, "dosage", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="e.g., 500mg"
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={medication.frequency}
                    onValueChange={(value) =>
                      updateMedication(index, "frequency", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input
                    value={medication.days}
                    onChange={(e) =>
                      updateMedication(index, "days", e.target.value)
                    }
                    type="number"
                    min="1"
                    disabled={disabled}
                    placeholder="No. of days"
                  />
                </td>
                <td className="p-3">
                  <Input
                    value={medication.notes}
                    onChange={(e) =>
                      updateMedication(index, "notes", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Add notes"
                  />
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMedication(index)}
                    disabled={disabled}
                  >
                    <CareIcon icon="l-trash" className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addMedication}
        disabled={disabled}
      >
        <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
        Add Medication
      </Button>
    </div>
  );
}
