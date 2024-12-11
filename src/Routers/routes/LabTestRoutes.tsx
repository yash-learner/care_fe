import { CollectSpecimen } from "@/components/LabTest/CollectSpecimen";
import { LabTest } from "@/components/LabTest/Index";
import { ProcessSpecimen } from "@/components/LabTest/ProcessSpecimen";
import { ReceiveSpecimen } from "@/components/LabTest/ReceiveSpecimen";
import { SendSpecimen } from "@/components/LabTest/SendSpecimen";

import { AppRoutes } from "@/Routers/AppRouter";

const LabTestRoutes: AppRoutes = {
  "/lab_tests/order_placed": () => <LabTest />,
  "/lab_tests/process_specimen": () => <ProcessSpecimen />,
  "/lab_tests/specimen_collected": () => <LabTest />,
  "/lab_tests/sent_to_lab": () => <LabTest />,
  "/lab_tests/send_to_lab": () => <SendSpecimen />,
  "/lab_tests/receive_at_lab": () => <ReceiveSpecimen />,
  "/lab_tests/received_at_lab": () => <LabTest />,
  "/lab_tests/:specimenId/collect": ({ specimenId }) => (
    <CollectSpecimen specimenId={specimenId} />
  ),
};

export default LabTestRoutes;
