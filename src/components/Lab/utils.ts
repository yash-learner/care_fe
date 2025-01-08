import { ServiceRequest } from "@/types/emr/serviceRequest";
import { Specimen } from "@/types/emr/specimen";

import { ProgressBarStep } from "../Common/ServiceRequestTimeline";

export const displaySpecimenId = (specimen?: Specimen) => {
  if (!specimen) return "N/A";

  return (
    "SPC " +
    (specimen.accession_identifier ??
      specimen.identifier ??
      specimen.id.slice(0, 8))
  );
};

export const displayServiceRequestId = (serviceRequest?: ServiceRequest) => {
  if (!serviceRequest) return "N/A";

  return "ORD " + serviceRequest?.id?.slice(0, 8);
};

export const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "routine":
      return "bg-blue-100 text-blue-800";
    case "asap":
      return "bg-yellow-100 text-yellow-800";
    case "urgent":
      return "bg-orange-100 text-orange-800";
    case "stat":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export type SpecimenStatus = ProgressBarStep["status"];

export const getSpecimenCollectedStatus = (
  specimen: Specimen,
): SpecimenStatus => {
  if (specimen.collected_at) return "collected";
  return "pending";
};

export const getSpecimenDispatchedStatus = (
  specimen: Specimen,
): SpecimenStatus => {
  if (specimen.dispatched_at) return "dispatched";
  return "pending";
};

export const getSpecimenReceivedStatus = (
  specimen: Specimen,
): SpecimenStatus => {
  if (specimen?.received_at) return "received";
  return "pending";
};

export const getOverallStepStatus = (
  subSteps: ProgressBarStep["subSteps"],
  previousStepStatus?: ProgressBarStep["status"],
): SpecimenStatus => {
  console.log(subSteps, previousStepStatus, "subSteps");

  if (
    subSteps?.every(
      (subStep) =>
        subStep.status === "collected" ||
        subStep.status === "dispatched" ||
        subStep.status === "received",
    )
  ) {
    return "completed";
  }
  if (
    subSteps?.some(
      (subStep) =>
        subStep.status === "collected" ||
        subStep.status === "dispatched" ||
        subStep.status === "received",
    )
  ) {
    return "active";
  }
  if (
    subSteps?.every(
      (subStep) =>
        (previousStepStatus === "completed" && subStep.status === "pending") ||
        subStep.status === "dispatched" ||
        subStep.status === "received",
    )
  ) {
    return "pending";
  }
  return "notStarted";
};
