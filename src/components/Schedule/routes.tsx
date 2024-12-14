import AppointmentCreatePage from "@/components/Schedule/AppointmentCreatePage";
import AppointmentTokenPage from "@/components/Schedule/AppointmentTokenPage";
// import AppointmentsPage from "@/components/Schedule/AppointmentsPage";
import SchedulingHomePage from "@/components/Schedule/SchedulingHomePage";

import { AppRoutes } from "@/Routers/AppRouter";

const ScheduleRoutes: AppRoutes = {
  // Schedule Management
  "/schedule": () => <SchedulingHomePage view="schedule" />,
  "/exceptions": () => <SchedulingHomePage view="exceptions" />,

  // Appointments
  // "/appointments": () => <AppointmentsPage />,

  "/facility/:facilityId/patient/:id/appointments/create": ({
    facilityId,
    id,
  }) => <AppointmentCreatePage facilityId={facilityId} patientId={id} />,

  "/facility/:facilityId/patient/:id/appointments/:appointmentId/token": ({
    facilityId,
    id,
    appointmentId,
  }) => (
    <AppointmentTokenPage
      facilityId={facilityId}
      patientId={id}
      appointmentId={appointmentId}
    />
  ),
};

export default ScheduleRoutes;
