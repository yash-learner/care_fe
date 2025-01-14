import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { FacilityModel } from "@/components/Facility/models";

import { formatName, formatPatientAge } from "@/Utils/utils";
import { formatAppointmentSlotTime } from "@/pages/Appointments/utils";
import { getFakeTokenNumber } from "@/pages/Scheduling/utils";
import { Appointment } from "@/types/scheduling/schedule";

interface Props {
  id?: string;
  appointment: Appointment;
  facility: FacilityModel;
}

const AppointmentTokenCard = ({ id, appointment, facility }: Props) => {
  const { patient } = appointment;
  const { t } = useTranslation();

  return (
    <Card
      id={id}
      className="p-6 w-[30rem] border border-gray-300 relative hover:scale-105 hover:rotate-1 hover:shadow-xl transition-all duration-300 ease-in-out"
    >
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('/images/care_logo_gray.svg')] bg-center bg-no-repeat bg-[length:60%_auto]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              {facility.name}
            </h3>
            <div className="text-sm text-gray-600">
              <span>{facility.pincode}, </span>
              <span>{`Ph.: ${facility.phone_number}`}</span>
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
            <Label>{t("name")}</Label>
            <p className="font-semibold">{patient.name}</p>
            <p className="text-sm text-gray-600 font-medium">
              {formatPatientAge(patient as any, true)},{" "}
              {t(`GENDER__${patient.gender}`)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <Label className="text-black font-semibold text-sm/none">
                Token No.
              </Label>
              <p className="text-5xl font-bold leading-none">
                {/* TODO: get token number from backend */}
                {getFakeTokenNumber(appointment)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="space-y-2">
            <div>
              <Label>{t("practitioner")}:</Label>
              <p className="text-sm font-semibold">
                {formatName(appointment.user)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">
                {formatAppointmentSlotTime(appointment)}
              </p>
            </div>
          </div>

          <div>
            <QRCodeSVG size={64} value={patient.id} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export { AppointmentTokenCard };
