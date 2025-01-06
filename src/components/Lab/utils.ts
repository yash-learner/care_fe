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
