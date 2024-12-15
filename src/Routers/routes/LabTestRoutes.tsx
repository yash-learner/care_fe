import { CollectSpecimen } from "@/components/LabTest/CollectSpecimen";
import { LabTest } from "@/components/LabTest/Index";
import { ProcessSpecimen } from "@/components/LabTest/ProcessSpecimen";
import { ReceiveSpecimen } from "@/components/LabTest/ReceiveSpecimen";
import { ReviewResult } from "@/components/LabTest/ReviewResult";
import { SendSpecimen } from "@/components/LabTest/SendSpecimen";

import { AppRoutes } from "@/Routers/AppRouter";

const LabTestRoutes: AppRoutes = {
  "/lab_tests/process": () => <ProcessSpecimen />,
  "/lab_tests/:specimenId/process": ({ specimenId }) => (
    <ProcessSpecimen specimenId={specimenId} />
  ),
  "/lab_tests/send_to_lab": () => <SendSpecimen />,
  "/lab_tests/receive_at_lab": () => <ReceiveSpecimen />,
  "/lab_tests/:tab": () => <LabTest />,
  "/lab_tests/:specimenId/collect": ({ specimenId }) => (
    <CollectSpecimen specimenId={specimenId} />
  ),
  "/lab_tests/:diagnosticReportId/review": ({ diagnosticReportId }) => (
    <ReviewResult diagnosticReportId={diagnosticReportId} />
  ),
  "/lab_tests/:diagnosticReportId/result": ({ diagnosticReportId }) => (
    <ReviewResult diagnosticReportId={diagnosticReportId} />
  ),
};

export default LabTestRoutes;
