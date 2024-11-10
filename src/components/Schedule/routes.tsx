import SchedulingHomePage from "@/components/Schedule/SchedulingHomePage";

import { AppRoutes } from "@/Routers/AppRouter";

const ScheduleRoutes: AppRoutes = {
  "/schedule": () => <SchedulingHomePage view="schedule" />,
  "/exceptions": () => <SchedulingHomePage view="exceptions" />,
};

export default ScheduleRoutes;
