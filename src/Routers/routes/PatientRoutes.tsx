import FileUploadPage from "@/components/Patient/FileUploadPage";
import { patientTabs } from "@/components/Patient/PatientDetailsTab";
import { PatientHome } from "@/components/Patient/PatientHome";
import PatientIndex from "@/components/Patient/PatientIndex";
import PatientRegistration from "@/components/Patient/PatientRegistration";

import { AppRoutes } from "@/Routers/AppRouter";
import { EncounterList } from "@/pages/Encounters/EncounterList";
import VerifyPatient from "@/pages/Patients/VerifyPatient";

const PatientRoutes: AppRoutes = {
  "/facility/:facilityId/patients": ({ facilityId }) => (
    <PatientIndex facilityId={facilityId} />
  ),
  "/facility/:facilityId/encounters": ({ facilityId }) => (
    <EncounterList facilityId={facilityId} />
  ),
  "/facility/:facilityId/patients/verify": ({ facilityId }) => (
    <VerifyPatient facilityId={facilityId} />
  ),
  "/patient/:id": ({ id }) => <PatientHome id={id} page="demography" />,
  "/facility/:facilityId/patient/create": ({ facilityId }) => (
    <PatientRegistration facilityId={facilityId} />
  ),
  "/facility/:facilityId/patient/:id": ({ facilityId, id }) => (
    <PatientHome facilityId={facilityId} id={id} page="demography" />
  ),
  ...patientTabs.reduce((acc: AppRoutes, tab) => {
    acc["/facility/:facilityId/patient/:id/" + tab.route] = ({
      facilityId,
      id,
    }) => <PatientHome facilityId={facilityId} id={id} page={tab.route} />;
    return acc;
  }, {}),
  "/facility/:facilityId/patient/:id/update": ({ facilityId, id }) => (
    <PatientRegistration facilityId={facilityId} patientId={id} />
  ),
  "/facility/:facilityId/patient/:patientId/files": ({
    facilityId,
    patientId,
  }) => (
    <FileUploadPage
      facilityId={facilityId}
      patientId={patientId}
      type="patient"
    />
  ),
};

export default PatientRoutes;
