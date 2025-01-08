import { LABS_BASE_ROUTE } from "@/components/Lab/constants";
import { CollectSpecimen } from "@/components/Lab/pages/CollectSpecimen";
import LabOrderTabs from "@/components/Lab/pages/LabOrderTabs";
import { ProcessSpecimen } from "@/components/Lab/pages/ProcessSpecimen";
import { ReceiveSpecimen } from "@/components/Lab/pages/ReceiveSpecimen";
import SendSpecimen from "@/components/Lab/pages/SendSpecimen";

import { AppRoutes } from "@/Routers/AppRouter";

const LabRoutes: AppRoutes = {
  [`${LABS_BASE_ROUTE}/process`]: () => <ProcessSpecimen />,
  [`${LABS_BASE_ROUTE}/send_to_lab`]: () => <SendSpecimen />,
  [`${LABS_BASE_ROUTE}/receive_at_lab`]: () => <ReceiveSpecimen />,
  [`${LABS_BASE_ROUTE}`]: () => <LabOrderTabs />,
  [`${LABS_BASE_ROUTE}/:tab`]: () => <LabOrderTabs />,
  [`${LABS_BASE_ROUTE}/:encounterId/collect`]: ({ encounterId }) => (
    <CollectSpecimen encounterId={encounterId} />
  ),
  [`${LABS_BASE_ROUTE}/:specimenId/process`]: ({ specimenId }) => (
    <ProcessSpecimen specimenId={specimenId} />
  ),
};

export default LabRoutes;
