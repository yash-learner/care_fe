import { LabTest } from "@/components/LabTest/Index";

import { AppRoutes } from "@/Routers/AppRouter";

const LabTestRoutes: AppRoutes = {
  "/lab_tests": () => <LabTest />,
};

export default LabTestRoutes;
