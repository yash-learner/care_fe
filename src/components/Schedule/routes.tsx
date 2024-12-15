import AppointmentCreatePage from "@/components/Schedule/AppointmentCreatePage";
import AppointmentTokenPage from "@/components/Schedule/AppointmentTokenPage";
import AppointmentsPage from "@/components/Schedule/AppointmentsPage";
import SchedulingHomePage from "@/components/Schedule/SchedulingHomePage";

import { AppRoutes } from "@/Routers/AppRouter";

const ScheduleRoutes: AppRoutes = {
  // Schedule Management
  "/schedule": () => <SchedulingHomePage view="schedule" />,
  "/exceptions": () => <SchedulingHomePage view="exceptions" />,

  // Appointments
  "/appointments": () => <AppointmentsPage />,

  "/facility/:facilityId/patient/:id/appointments/create": ({
    facilityId,
    id,
  }) => <AppointmentCreatePage facilityId={facilityId} patientId={id} />,

  "/facility/:facilityId/patient/:patientId/appointment/:appointmentId/token":
    ({ facilityId, appointmentId }) => (
      <AppointmentTokenPage
        facilityId={facilityId}
        appointmentId={appointmentId}
      />
    ),
};

export default ScheduleRoutes;
