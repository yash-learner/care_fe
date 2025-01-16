import { LABS_BASE_ROUTE } from "@/components/Lab/constants";
import { CollectSpecimen } from "@/components/Lab/pages/CollectSpecimen";
import LabOrderTabs from "@/components/Lab/pages/LabOrderTabs";
import { ProcessSpecimen } from "@/components/Lab/pages/ProcessSpecimen";
import { ReceiveSpecimen } from "@/components/Lab/pages/ReceiveSpecimen";
import { Results } from "@/components/Lab/pages/Results";
import { ReviewResult } from "@/components/Lab/pages/ReviewResult";
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
  [`${LABS_BASE_ROUTE}/:diagnosticReportId/review`]: ({
    diagnosticReportId,
  }) => <ReviewResult diagnosticReportId={diagnosticReportId} />,

  [`${LABS_BASE_ROUTE}/:diagnosticReportId/result`]: ({
    diagnosticReportId,
  }) => <Results diagnosticReportId={diagnosticReportId} />,
};

export default LabRoutes;
