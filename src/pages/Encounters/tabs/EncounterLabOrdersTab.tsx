import EncounterLabOrdersList from "@/components/Lab/EncounterLabOrdersList";

import { EncounterTabProps } from "@/pages/Encounters/EncounterShow";

export const EncounterLabOrdersTab = (props: EncounterTabProps) => {
  return (
    <div className="flex flex-col gap-16">
      <EncounterLabOrdersList encounterId={props.encounter.id} />
    </div>
  );
};
