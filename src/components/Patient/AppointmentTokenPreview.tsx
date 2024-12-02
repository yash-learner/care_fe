import { Button } from "@/components/ui/button";

import Page from "@/components/Common/Page";
import AppointmentToken from "@/components/Schedule/AppointmentToken";

const MOCK_TOKEN_DATA = {
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
        <AppointmentToken {...MOCK_TOKEN_DATA} />

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => window.print()}>
            Print Token
          </Button>
        </div>
      </div>
    </Page>
  );
}
