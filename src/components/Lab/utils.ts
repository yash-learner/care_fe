import { ServiceRequest } from "@/types/emr/serviceRequest";
import { Specimen } from "@/types/emr/specimen";

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

  return "ORD " + serviceRequest.id.slice(0, 8);
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
