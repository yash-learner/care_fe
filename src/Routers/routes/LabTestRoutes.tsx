import { CollectSpecimen } from "@/components/LabTest/CollectSpecimen";
import { LabTest } from "@/components/LabTest/Index";
import { SendSpecimen } from "@/components/LabTest/SendSpecimen";

import { AppRoutes } from "@/Routers/AppRouter";

const LabTestRoutes: AppRoutes = {
  "/lab_tests/order_placed": () => <LabTest />,
  "/lab_tests/specimen_collected": () => <LabTest />,
  "/lab_tests/sent_to_lab": () => <LabTest />,
  "/lab_tests/send_to_lab": () => <SendSpecimen />,
  "/lab_tests/:patientId/orders": ({ patientId }) => <CollectSpecimen />,
};

export default LabTestRoutes;
