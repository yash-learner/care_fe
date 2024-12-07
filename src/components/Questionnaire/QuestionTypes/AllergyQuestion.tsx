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

interface AllergyQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export interface AllergyRow {
  substance: string;
  criticality: string;
  manifestations: string;
  verification_status: string;
  comment?: string;
}

const CRITICALITY = ["Low", "Medium", "High"];
const VERIFICATION_STATUS = [
  "Confirmed",
  "Suspected",
  "Refuted",
  "Entered in Error",
];

export function AllergyQuestion({
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: AllergyQuestionProps) {
  const allergies = (questionnaireResponse.values[0] || []) as AllergyRow[];

  const updateAllergy = (
    index: number,
    field: keyof AllergyRow,
    value: string,
  ) => {
    const updatedAllergies = [...allergies];
    updatedAllergies[index] = {
      ...updatedAllergies[index],
      [field]: value,
    };

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [updatedAllergies] as unknown as ResponseValue[],
    });
  };

  const addAllergy = () => {
    const newAllergy: AllergyRow = {
      substance: "",
      criticality: "",
      manifestations: "",
      verification_status: "",
      comment: "",
    };

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [allergies.concat(newAllergy)] as unknown as ResponseValue[],
    });
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = allergies.filter((_, i) => i !== index);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [updatedAllergies] as unknown as ResponseValue[],
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium">Substance</th>
              <th className="p-3 text-left text-sm font-medium">Criticality</th>
              <th className="p-3 text-left text-sm font-medium">
                Manifestations
              </th>
              <th className="p-3 text-left text-sm font-medium">
                Verification Status
              </th>
              <th className="p-3 text-left text-sm font-medium">Comment</th>
              <th className="w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {allergies.map((allergy, index) => (
              <tr key={index} className="bg-white">
                <td className="p-3">
                  <Input
                    value={allergy.substance}
                    onChange={(e) =>
                      updateAllergy(index, "substance", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Type to add allergy type"
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={allergy.criticality}
                    onValueChange={(value) =>
                      updateAllergy(index, "criticality", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CRITICALITY.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input
                    value={allergy.manifestations}
                    onChange={(e) =>
                      updateAllergy(index, "manifestations", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Select"
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={allergy.verification_status}
                    onValueChange={(value) =>
                      updateAllergy(index, "verification_status", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {VERIFICATION_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input
                    value={allergy.comment}
                    onChange={(e) =>
                      updateAllergy(index, "comment", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Add comment"
                  />
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAllergy(index)}
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
        onClick={addAllergy}
        disabled={disabled}
      >
        <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
        Add Allergy Record
      </Button>
    </div>
  );
}
