import { useState } from "react";

import type { QuestionValue } from "@/types/questionnaire/form";

export function useQuestionnaireForm() {
  const [values, setValues] = useState<Record<string, QuestionValue>>({});

  const handleChange = (id: string, value: QuestionValue) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const resetForm = () => setValues({});

  return {
    values,
    handleChange,
    resetForm,
  };
}
