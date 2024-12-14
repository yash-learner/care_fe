import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Page from "@/components/Common/Page";

const data = {
  name: "Vishwanathan Bhaskarapillai T",
  age: 58,
  gender: "Male",
  tokenNumber: 77,
  doctorName: "Dr. Lee (Orthopedist)",
  uhid: "T105690908240017",
  facilityName: "FAMILY HEALTH CENTRE",
  facilityAddress: "AYYAMPUZHA, ERNAKULAM- 683581",
  facilityPhone: "4842695825",
  appointmentTime: "09 Aug, 2024, 12:47 PM",
  opDays: "MON, TUE, WED, ",
  type: "GENERAL",
} as const;

interface Props {
  facilityId: string;
  patientId: string;
  appointmentId: string;
}

export default function AppointmentTokenPreview(_props: Props) {
  return (
    <Page
      title="Token"
      // breadcrumbs={[
      //   { text: "Home", href: "/" },
      //   { text: "Patients", href: "/patients" },
      //   { text: "Details of Patient" },
      // ]}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="p-6 print:shadow-none">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight">
                {data.facilityName}
              </h3>
              <p className="text-base text-gray-600">
                {data.facilityAddress}, Ph: {data.facilityPhone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="text-base font-medium text-gray-600">
                  {data.type}
                  <br />
                  OP TOKEN
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start justify-between">
            <div>
              <p className="text-base text-gray-600">Name:</p>
              <p className="text-xl font-medium">
                {data.name}
                <br />
                {data.age} Y, {data.gender}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base text-gray-600">Token No.</p>
              <p className="text-[5rem] font-bold leading-none">
                {data.tokenNumber}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <p className="text-base text-gray-600">Doctor/Dep.:</p>
              <p className="text-base font-medium">{data.doctorName}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-base text-gray-600">UHID:</p>
              <p className="text-base font-medium">{data.uhid}</p>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-base text-gray-600">OP Days [{data.opDays}]</p>
            <div className="mt-2 h-12">
              <div className="h-full w-full bg-black" />
            </div>
          </div>

          <div className="mt-2 text-base text-gray-600">
            {data.appointmentTime}
          </div>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => window.print()}>
            Print Token
          </Button>
        </div>
      </div>
    </Page>
  );
}
