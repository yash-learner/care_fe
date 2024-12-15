import { useQuery } from "@tanstack/react-query";
import { navigate } from "raviger";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import { PatientModel } from "@/components/Patient/models";

import * as Notification from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { PaginatedResponse } from "@/Utils/request/types";
import { formatDate } from "@/Utils/utils";

export default function PatientSelect({
  facilityId,
  staffUsername,
}: {
  facilityId: string;
  staffUsername: string;
}) {
  const phoneNumber = localStorage.getItem("phoneNumber");
  const selectedSlot = localStorage.getItem("selectedSlot");

  if (!staffUsername) {
    Notification.Error({ msg: "Staff Username Not Found" });
    navigate(`/facility/${facilityId}/`);
  } else if (!phoneNumber) {
    Notification.Error({ msg: "Phone Number Not Found" });
    navigate(`/facility/${facilityId}/appointments/${staffUsername}/otp/send`);
  } else if (!selectedSlot) {
    Notification.Error({ msg: "Selected Slot Not Found" });
    navigate(
      `/facility/${facilityId}/appointments/${staffUsername}/book-appointment`,
    );
  }

  const { data: patientData } = useQuery<PaginatedResponse<PatientModel>>({
    queryKey: ["patient", phoneNumber],
    queryFn: query(routes.otp.getPatient, {
      queryParams: { phone_number: phoneNumber ?? "" },
    }),
    enabled: !!phoneNumber,
  });

  const mockPatientData = [
    {
      id: "T105690908240017",
      name: "Leo Westervelt",
      phone_number: "9876543120",
      date_of_birth: "1996-01-04",
      gender: 1,
      blood_group: "O+",
      nationality: "India",
      is_active: true,
    },
    {
      id: "T105690908240019",
      name: "Tatiana Franci",
      phone_number: "9876543120",
      date_of_birth: "1998-06-02",
      gender: 2,
      blood_group: "B+",
      nationality: "India",
      is_active: true,
    },
    {
      id: "T105690908240032",
      name: "Rayna Passaquindici Arcand",
      phone_number: "9876543120",
      date_of_birth: "1991-05-23",
      gender: 2,
      blood_group: "A+",
      nationality: "India",
      is_active: true,
    },
  ];

  const patients = patientData?.results ?? mockPatientData;

  const renderNoPatientFound = () => {
    return (
      <div className="">
        <span className="text-base font-medium">
          No patients found with this phone number. Please create a new patient
          to proceed with booking appointment.
        </span>
      </div>
    );
  };

  const renderPatientList = () => {
    return (
      <div>
        <div className="flex justify-between gap-4 p-2 text-sm bg-secondary-200 font-medium mb-4 rounded-lg bg-card border">
          <div className="w-2/6">Patient Name/UHID</div>
          <div className="w-1/6">Primary Ph No.</div>
          <div className="w-1/6">Date of birth/Age</div>
          <div className="w-1/6">Sex</div>
        </div>

        <div className="divide-y rounded-lg border bg-card">
          {patients?.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between gap-4 p-4 hover:bg-secondary-100 cursor-pointer"
            >
              <div className="w-2/6">
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-muted-foreground">
                  {patient.id}
                </div>
              </div>
              <div className="self-center w-1/6">{patient.phone_number}</div>
              <div className="self-center w-1/6">
                {formatDate(
                  new Date(patient.date_of_birth ?? ""),
                  "dd MMM yyyy",
                )}
              </div>
              <div className="self-center w-1/6">
                {patient.gender === 1 ? "Male" : "Female"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex px-2 pb-4 justify-start">
        <Button
          variant="outline"
          className="border border-secondary-400"
          onClick={() =>
            navigate(
              `/facility/${facilityId}/appointments/${staffUsername}/book-appointment`,
            )
          }
        >
          <CareIcon icon="l-square-shape" className="h-4 w-4 mr-1" />
          <span className="text-sm underline">Back</span>
        </Button>
      </div>
      <div className="flex flex-col justify-center space-y-4 bg-white rounded-lg shadow-md p-8">
        <h3 className="text-lg font-medium">Select/Register Patient</h3>
        {(patients?.length ?? 0) > 0
          ? renderPatientList()
          : renderNoPatientFound()}
        <Button
          variant="outline_primary"
          className="w-1/2 self-center"
          onClick={() =>
            navigate(
              `/facility/${facilityId}/appointments/${staffUsername}/patient-registration`,
            )
          }
        >
          <span className="text-sm underline">Add New Patient</span>
        </Button>
      </div>
    </div>
  );
}
