import LabOrderTabs from "@/components/Lab/LabOrderTabs";
import { LABS_BASE_ROUTE } from "@/components/Lab/constants";

import { AppRoutes } from "@/Routers/AppRouter";

const LabRoutes: AppRoutes = {
  [`${LABS_BASE_ROUTE}`]: () => <LabOrderTabs />,
  [`${LABS_BASE_ROUTE}/:tab`]: () => <LabOrderTabs />,
};

export default LabRoutes;
