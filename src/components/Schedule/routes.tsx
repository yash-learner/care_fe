import { Redirect } from "raviger";

import AppointmentCreatePage from "@/components/Schedule/AppointmentCreatePage";
import AppointmentTokenPage from "@/components/Schedule/AppointmentTokenPage";
import AppointmentsPage from "@/components/Schedule/AppointmentsPage";

import useAuthUser from "@/hooks/useAuthUser";

import { AppRoutes } from "@/Routers/AppRouter";

const HomeFacilityRedirect = ({ suffix }: { suffix: string }) => {
  const authUser = useAuthUser();
  const facilityId = authUser.home_facility!;

  return <Redirect to={`/facility/${facilityId}${suffix}`} />;
};

const ScheduleRoutes: AppRoutes = {
  // Appointments
  "/appointments": () => <HomeFacilityRedirect suffix="/appointments" />,
  "/facility/:facilityId/appointments": ({ facilityId }) => (
    <AppointmentsPage facilityId={facilityId} />
  ),

  "/facility/:facilityId/patient/:patientId/book-appointment": ({
    facilityId,
    patientId,
  }) => <AppointmentCreatePage facilityId={facilityId} patientId={patientId} />,

  "/facility/:facilityId/patient/:patientId/appointment/:appointmentId/token":
    ({ facilityId, appointmentId }) => (
      <AppointmentTokenPage
        facilityId={facilityId}
        appointmentId={appointmentId}
      />
    ),
};

export default ScheduleRoutes;
