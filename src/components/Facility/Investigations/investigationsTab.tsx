import ViewInvestigationSuggestions from "@/components/Facility/Investigations/InvestigationSuggestions";
import ViewInvestigations from "@/components/Facility/Investigations/ViewInvestigations";
import CreateServiceRequest from "@/components/LabTest/CreateServiceRequest";
import ListEncounterServiceRequests from "@/components/LabTest/ListEncounterServiceRequests";
import { PatientModel } from "@/components/Patient/models";

import routes from "@/Utils/request/api";
import useTanStackQueryInstead from "@/Utils/request/useQuery";

import { ConsultationModel } from "../models";

export interface InvestigationSessionType {
  session_external_id: string;
  session_created_date: string;
}

export default function InvestigationTab(props: {
  consultationId: string;
  patientId: string;
  facilityId: string;
  patientData: PatientModel;
  consultationData: ConsultationModel;
}) {
  const {
    consultationId,
    patientId,
    facilityId,
    patientData,
    consultationData,
  } = props;
  const { data: investigations, loading: investigationLoading } =
    useTanStackQueryInstead(routes.getInvestigation, {
      pathParams: {
        consultation_external_id: consultationId,
      },
    });

  const { data: investigationSessions, loading: investigationSessionLoading } =
    useTanStackQueryInstead(routes.getInvestigationSessions, {
      pathParams: {
        consultation_external_id: consultationId,
      },
    });

  return (
    <>
      <div className="grid gap-4">
        <ListEncounterServiceRequests encounterId={consultationId} />
        <CreateServiceRequest encounter={consultationData} />
      </div>

      <ViewInvestigations
        isLoading={investigationLoading || investigationSessionLoading}
        investigations={investigations?.results || []}
        investigationSessions={investigationSessions || []}
        consultationId={consultationId}
        facilityId={facilityId}
        patientId={patientId}
      />
      <ViewInvestigationSuggestions
        investigations={investigations?.results || []}
        //investigationSessions={investigationSessions}
        consultationId={consultationId}
        logUrl={
          patientData.is_active
            ? `/facility/${facilityId}/patient/${patientId}/consultation/${consultationId}/investigation`
            : undefined
        }
      />
    </>
  );
}
