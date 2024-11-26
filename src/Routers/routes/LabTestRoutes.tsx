import { LabTest } from "@/components/LabTest/Index";

import { AppRoutes } from "@/Routers/AppRouter";

const LabTestRoutes: AppRoutes = {
  "/lab_tests/order_placed": () => <LabTest />,
  "/lab_tests/specimen_collected": () => <LabTest />,
  "/lab_tests/sent_to_lab": () => <LabTest />,
};

export default LabTestRoutes;
