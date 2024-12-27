import { ObservationVisualizer } from "@/components/Common/Charts/ObservationChart";
import PageTitle from "@/components/Common/PageTitle";
import { PainDiagrams } from "@/components/Facility/Consultations/PainDiagrams";

const VITAL_GROUPS = [
  {
    title: "Blood Pressure",
    codes: [
      { code: "8480-6", system: "http://loinc.org", display: "Systolic" },
      { code: "8462-4", system: "http://loinc.org", display: "Diastolic" },
    ],
  },
  {
    title: "Pulse",
    codes: [{ code: "8867-4", system: "http://loinc.org", display: "Pulse" }],
  },
  {
    title: "Temperature",
    codes: [
      {
        code: "8310-5",
        system: "http://loinc.org",
        display: "Temperature",
      },
    ],
  },
  {
    title: "Respiratory Rate",
    codes: [
      {
        code: "9279-1",
        system: "http://loinc.org",
        display: "Respiratory Rate",
      },
    ],
  },
  {
    title: "SpO2",
    codes: [{ code: "2708-6", system: "http://loinc.org", display: "SpO2" }],
  },
  {
    title: "FiO2",
    codes: [{ code: "3151-8", system: "http://loinc.org", display: "FiO2" }],
  },
];

export const PrimaryParametersPlot = ({ patientId }: { patientId: string }) => {
  return (
    <div>
      <div id="vital-section">
        <ObservationVisualizer
          patientId={patientId}
          codeGroups={VITAL_GROUPS}
          gridCols={2}
        />
      </div>
      <div>
        <PageTitle title="Pain Scale" hideBack={true} breadcrumbs={false} />
        <PainDiagrams dailyRound={[]} />
      </div>
    </div>
  );
};
