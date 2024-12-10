import ViewInvestigationSuggestions from "@/components/Facility/Investigations/InvestigationSuggestions";
import ViewInvestigations from "@/components/Facility/Investigations/ViewInvestigations";
import CreateServiceRequest from "@/components/LabTest/CreateServiceRequest";
import { PatientModel } from "@/components/Patient/models";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";

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
  const { data: investigations, loading: investigationLoading } = useQuery(
    routes.getInvestigation,
    {
      pathParams: {
        consultation_external_id: consultationId,
      },
    },
  );

  const { data: investigationSessions, loading: investigationSessionLoading } =
    useQuery(routes.getInvestigationSessions, {
      pathParams: {
        consultation_external_id: consultationId,
      },
    });

  return (
    <>
      <div className="my-4">
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
