import { LABS_BASE_ROUTE } from "@/components/Lab/constants";
import { CollectSpecimen } from "@/components/Lab/pages/CollectSpecimen";
import LabOrderTabs from "@/components/Lab/pages/LabOrderTabs";

import { AppRoutes } from "@/Routers/AppRouter";

const LabRoutes: AppRoutes = {
  [`${LABS_BASE_ROUTE}`]: () => <LabOrderTabs />,
  [`${LABS_BASE_ROUTE}/:tab`]: () => <LabOrderTabs />,
  [`${LABS_BASE_ROUTE}/:encounterId/collect`]: ({ encounterId }) => (
    <CollectSpecimen encounterId={encounterId} />
  ),
};

export default LabRoutes;
