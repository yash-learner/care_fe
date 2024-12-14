import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import Loading from "@/components/Common/Loading";
import Page from "@/components/Common/Page";
import { FacilityModel } from "@/components/Facility/models";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { formatPatientAge } from "@/Utils/utils";

// TODO: replace this with actual data once Appointment Retrieve API is implemented
const dummy = {
  id: "14881ad0-bd97-47f4-ab2e-a58e1fa9d16d",
  patient: {
    id: "4d228d69-648c-442d-912f-e359f50ed796",
    facility: "af2d0c2f-82b9-48ad-a5d4-be2e0edb1c89",
    facility_object: {
      id: "af2d0c2f-82b9-48ad-a5d4-be2e0edb1c89",
      name: "OHC HQ",
      local_body: 36,
      district: 9,
      state: 1,
      ward_object: {
        id: 2380,
        name: "MUZHAPPALA",
        number: 1,
        local_body: 36,
      },
      local_body_object: {
        id: 36,
        name: "Anjarakandy  Grama Panchayat, Kannur District",
        body_type: 1,
        localbody_code: "G130706",
        district: 9,
      },
      district_object: {
        id: 9,
        name: "Kannur",
        state: 1,
      },
      state_object: {
        id: 1,
        name: "Kerala",
      },
      facility_type: {
        id: 802,
        name: "Family Health Centres",
      },
      read_cover_image_url: null,
      features: [1],
      patient_count: 1,
      bed_count: 0,
    },
    ward_object: {
      id: 2380,
      name: "MUZHAPPALA",
      number: 1,
      local_body: 36,
    },
    local_body_object: {
      id: 36,
      name: "Anjarakandy  Grama Panchayat, Kannur District",
      body_type: 1,
      localbody_code: "G130706",
      district: 9,
    },
    district_object: {
      id: 9,
      name: "Kannur",
      state: 1,
    },
    state_object: {
      id: 1,
      name: "Kerala",
    },
    last_consultation: null,
    blood_group: "A-",
    disease_status: "SUSPECTED",
    source: "CARE",
    assigned_to_object: null,
    created_date: "2024-12-13T21:42:28.201979+05:30",
    modified_date: "2024-12-13T21:42:28.225333+05:30",
    name: "Rithvik Nishad",
    gender: 1,
    phone_number: "+917366666666",
    emergency_phone_number: "+917366666666",
    address: "A",
    permanent_address: "A",
    pincode: 670106,
    date_of_birth: "2001-06-16",
    year_of_birth: 2001,
    death_datetime: null,
    nationality: "India",
    passport_no: "",
    ration_card_category: null,
    is_medical_worker: false,
    contact_with_confirmed_carrier: false,
    contact_with_suspected_carrier: false,
    estimated_contact_date: null,
    past_travel: false,
    countries_travelled: null,
    date_of_return: null,
    present_health: "",
    has_SARI: false,
    is_antenatal: false,
    last_menstruation_start_date: null,
    date_of_delivery: null,
    ward_old: "",
    is_migrant_worker: false,
    number_of_aged_dependents: 0,
    number_of_chronic_diseased_dependents: 0,
    action: 10,
    review_time: null,
    is_active: true,
    date_of_receipt_of_information: "2024-12-13T21:42:28.199993+05:30",
    test_id: "",
    date_of_test: null,
    srf_id: "",
    test_type: 10,
    allow_transfer: true,
    will_donate_blood: null,
    fit_for_blood_donation: null,
    village: "",
    designation_of_health_care_worker: "",
    instituion_of_health_care_worker: "",
    transit_details: null,
    frontline_worker: null,
    date_of_result: null,
    number_of_primary_contacts: null,
    number_of_secondary_contacts: null,
    is_vaccinated: false,
    number_of_doses: 0,
    vaccine_name: null,
    covin_id: null,
    last_vaccinated_date: null,
    cluster_name: null,
    is_declared_positive: false,
    date_declared_positive: null,
    nearest_facility: null,
    ward: 2380,
    local_body: 36,
    district: 9,
    state: 1,
    last_edited: 2,
    assigned_to: null,
  },
  resource: {
    id: "fe97a550-3f3f-45aa-b6cb-6b798066882b",
    name: "Doctor OHC",
  },
  token_slot: {
    id: "bf488db8-1c0d-47aa-9d9a-3ae2a3d17371",
    resource: {
      id: "fe97a550-3f3f-45aa-b6cb-6b798066882b",
      name: "Doctor OHC",
    },
    start_datetime: "2024-12-14T09:00:00+05:30",
    end_datetime: "2024-12-14T09:29:59+05:30",
    tokens_count: 5,
    tokens_remaining: 2,
  },
  reason_for_visit: "a",
};

interface Props {
  facilityId: string;
  appointmentId: string;
}

export default function AppointmentTokenPage(props: Props) {
  const facilityQuery = useQuery({
    queryKey: ["facility", props.facilityId],
    queryFn: query(routes.getPermittedFacility, {
      pathParams: {
        id: props.facilityId,
      },
    }),
  });

  if (!facilityQuery.data) {
    return <Loading />;
  }

  return (
    <Page title="Token">
      <div className="mt-4 py-4 flex justify-center border-t border-gray-200">
        <div className="flex flex-col gap-4 mt-4">
          <div id="section-to-print">
            <TokenCard appointment={dummy} facility={facilityQuery.data} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={print}>
              <CareIcon icon="l-print" className="text-lg mr-2" />
              <span>Print Token</span>
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function TokenCard({
  appointment,
  facility,
}: {
  appointment: typeof dummy;
  facility: FacilityModel;
}) {
  const { patient } = appointment;
  const { t } = useTranslation();
  return (
    <Card className="p-6 shadow-none w-[30rem] boorder border-gray-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">{facility.name}</h3>
          <div className="text-sm text-gray-600">
            <span>
              {facility.local_body_object?.name} - {facility.pincode},{" "}
            </span>
            <span>Ph: {facility.phone_number}</span>
          </div>
        </div>

        <div>
          <div className="text-sm whitespace-nowrap text-center bg-gray-100 px-3 pb-2 pt-6 -mt-6 font-medium text-gray-500">
            <p>GENERAL</p>
            <p>OP TOKEN</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <Label>Name</Label>
          <p className="font-semibold">{patient.name}</p>
          <p className="text-sm text-gray-600 font-medium">
            {formatPatientAge(patient as any, true)},{" "}
            {t(`GENDER__${patient.gender}`)}
          </p>
        </div>

        <div>
          <Label className="text-black font-semibold">Token No.</Label>
          <p className="text-5xl font-bold leading-none">
            {/* TODO: get token number from backend */}
            {Math.floor(Math.random() * 100)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label>Doctor:</Label>
          <p className="text-sm font-semibold">{appointment.resource.name}</p>
        </div>
        <div>
          <Label>UHID:</Label>
          <p className="text-sm font-semibold">
            {/* TODO: get UHID from backend */}
            T10569090824017
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">
            {format(
              appointment.token_slot.start_datetime,
              "dd MMM, yyyy, hh:mm a",
            )}
          </p>
        </div>
        <span className="text-3xl font-barcode whitespace-nowrap select-none">
          {/* TODO: get UHID from backend */}
          T10569090824017
        </span>
      </div>
    </Card>
  );
}
