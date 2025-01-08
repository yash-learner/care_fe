import React from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

import { LabObservation } from "@/types/emr/observation";
import { Code } from "@/types/questionnaire/code";

import { LabObservationItem } from "./LabObservationItem";

interface LabObservationQuestionProps {
  question: string; // Assuming it's a simple string; adjust if using a more complex type
  observations: LabObservation[];
  setObservations: React.Dispatch<React.SetStateAction<LabObservation[]>>;
  disabled?: boolean;
}
export const LabObservationQuestion: React.FC<LabObservationQuestionProps> = ({
  question,
  observations,
  setObservations,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const handleAddObservation = (code: Code) => {
    setObservations((prev) => [
      ...prev,
      {
        code,
        result: { value: "" },
        unit: "x10³/μL",
        note: "",
      },
    ]);
  };
  const handleRemoveObservation = (index: number) => {
    setObservations((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpdateObservation = (
    index: number,
    updates: Partial<LabObservation>,
  ) => {
    setObservations((prev) =>
      prev.map((obs, i) => (i === index ? { ...obs, ...updates } : obs)),
    );
  };
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">
        {question}
        {/* If you have a required flag, include it here */}
        {/* {required && <span className="ml-1 text-red-500">*</span>} */}
      </Label>
      {observations.length > 0 && (
        <div className="rounded-lg border space-y-4 flex flex-col">
          {/* <ul className="space-y-2 divide-y-2 divide-gray-200 divide-dashed"> */}
          {observations.map((observation, index) => (
            <>
              <div className="">
                <LabObservationItem
                  key={index}
                  observation={observation}
                  index={index}
                  disabled={disabled}
                  onUpdate={(updates) =>
                    handleUpdateObservation(index, updates)
                  }
                  onRemove={() => handleRemoveObservation(index)}
                />
              </div>
              <div className="border-l-[2.5px] border-gray-300 w-5 h-12 ms-8 last:hidden" />
            </>
          ))}
          {/* </ul> */}
        </div>
      )}
      <ValueSetSelect
        system="system-observation"
        placeholder={t("search_lab_observation_code")}
        onSelect={handleAddObservation}
        // You can pass a selected value if needed
        // value={...}
        disabled={disabled}
      />
    </div>
  );
};
// // components/LabObservationQuestion.tsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import { v4 as uuid } from "uuid";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";
// import { Observation } from "@/types/emr/observation";
// import { Code } from "@/types/questionnaire/code";
// import { LabObservationItem } from "./LabObservationItem";
// interface LabObservationQuestionProps {
//   question: string; // Could be a simple string or a more complex type
//   observations: Observation[];
//   setObservations: React.Dispatch<React.SetStateAction<Observation[]>>;
//   disabled?: boolean;
// }
// export const LabObservationQuestion: React.FC<LabObservationQuestionProps> = ({
//   question,
//   observations,
//   setObservations,
//   disabled = false,
// }) => {
//   const { t } = useTranslation();
//   // When the user selects a code from ValueSetSelect, add a new observation
//   const handleAddObservation = (code: Code) => {
//     setObservations((prev) => [
//       ...prev,
//       {
//         id: uuid(),
//         main_code: code,
//         value_type: "QUANTITY", // You can adjust if you have different types
//         value: {
//           quantity_value: null,
//           value: "",
//           unit: "x10³/μL", // Default unit
//         },
//         status: "final",
//         effective_datetime: new Date().toISOString(),
//         subject_type: "patient", // or "encounter", depending on your use case
//         note: "",
//       },
//     ]);
//   };
//   const handleRemoveObservation = (index: number) => {
//     setObservations((prev) => prev.filter((_, i) => i !== index));
//   };
//   const handleUpdateObservation = (
//     index: number,
//     updates: Partial<Observation>,
//   ) => {
//     setObservations((prev) =>
//       prev.map((obs, i) => (i === index ? { ...obs, ...updates } : obs)),
//     );
//   };
//   return (
//     <div className="space-y-4">
//       <Label className="text-base font-medium">{question}</Label>
//       {observations.length > 0 && (
//         <div className="rounded-lg border space-y-4">
//           <ul className="space-y-2 divide-y-2 divide-gray-200 divide-dashed">
//             {observations.map((observation, index) => (
//               <li key={observation.id}>
//                 <LabObservationItem
//                   observation={observation}
//                   index={index}
//                   disabled={disabled}
//                   onUpdate={(updates) =>
//                     handleUpdateObservation(index, updates)
//                   }
//                   onRemove={() => handleRemoveObservation(index)}
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <ValueSetSelect
//         system="system-observation"
//         placeholder={t("search_lab_observation_code")}
//         onSelect={handleAddObservation}
//         disabled={disabled}
//       />
//     </div>
//   );
// };

// import React from "react";
// import { useTranslation } from "react-i18next";
// import { v4 as uuid } from "uuid";

// import { Label } from "@/components/ui/label";

// import ValueSetSelect from "@/components/Questionnaire/ValueSetSelect";

// import { Observation } from "@/types/emr/observation";
// import { Code } from "@/types/questionnaire/code";

// import { LabObservationItem } from "./LabObservationItem";

// interface LabObservationQuestionProps {
//   /**
//    * A simple string to describe the question or section title.
//    */
//   question: string;
//   /**
//    * An array of Observations that follow the structure from `observation.ts`.
//    */
//   observations: Observation[];
//   /**
//    * A state setter to update the array of Observations.
//    */
//   setObservations: React.Dispatch<React.SetStateAction<Observation[]>>;
//   /**
//    * Disable all controls if true.
//    */
//   disabled?: boolean;
// }

// export const LabObservationQuestion: React.FC<LabObservationQuestionProps> = ({
//   question,
//   observations,
//   setObservations,
//   disabled = false,
// }) => {
//   const { t } = useTranslation();

//   /**
//    * Handle adding a new Observation based on the selected `Code` from `ValueSetSelect`.
//    */
//   const handleAddObservation = (code: Code) => {
//     setObservations((prev) => [
//       ...prev,
//       {
//         // Required fields for creating a new Observation
//         id: uuid(),
//         status: "final", // or "preliminary" if needed
//         category: {},
//         main_code: code, // maps to "main_code"
//         subject_type: "patient", // typically "patient"
//         encounter: null,
//         effective_datetime: new Date().toISOString(),
//         data_entered_by_id: 0, // update with real user ID in parent if needed
//         performer: {},

//         /**
//          * For a numeric result, you typically set `value_type` to "QUANTITY",
//          * and place the numeric value in `value.quantity_value`.
//          */
//         value_type: "QUANTITY",
//         // value: {
//         //   quantity_value: 0, // your numeric result placeholder
//         //   unit: "x10³/μL", // default unit placeholder
//         //   text: "", // string version of the numeric result
//         // },
//         value: "",

//         note: "", // any additional note
//         body_site: {},
//         method: {},
//         reference_range: {
//           low: null,
//           high: null,
//           text: null,
//           unit: null,
//         },
//         interpretation: "",
//         parent: null,
//         questionnaire_response: null,
//       },
//     ]);
//   };

//   /**
//    * Removes an Observation at a given index.
//    */
//   const handleRemoveObservation = (index: number) => {
//     setObservations((prev) => prev.filter((_, i) => i !== index));
//   };

//   /**
//    * Updates an Observation at a given index with `updates`.
//    */
//   const handleUpdateObservation = (
//     index: number,
//     updates: Partial<Observation>,
//   ) => {
//     setObservations((prev) =>
//       prev.map((obs, i) => (i === index ? { ...obs, ...updates } : obs)),
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {/* Section Title */}
//       <Label className="text-base font-medium">{question}</Label>

//       {/* Existing Observations List */}
//       {observations.length > 0 && (
//         <div className="rounded-lg border space-y-4">
//           <ul className="space-y-2 divide-y-2 divide-gray-200 divide-dashed">
//             {observations.map((observation, index) => (
//               <li key={observation.id}>
//                 <LabObservationItem
//                   observation={observation}
//                   index={index}
//                   disabled={disabled}
//                   onUpdate={(updates) =>
//                     handleUpdateObservation(index, updates)
//                   }
//                   onRemove={() => handleRemoveObservation(index)}
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* "Add Observation" Select */}
//       <ValueSetSelect
//         system="system-observation"
//         placeholder={t("search_lab_observation_code")}
//         onSelect={handleAddObservation}
//         disabled={disabled}
//       />
//     </div>
//   );
// };
