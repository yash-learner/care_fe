import React from "react";
import { useTranslation } from "react-i18next";

import {
  displayPatientId,
  displayPatientName,
  formatPatientAge,
} from "@/Utils/utils";
import { Patient } from "@/types/emr/newPatient";

export const PatientDetails: React.FC<{
  patient: Patient;
}> = ({ patient }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-4">
      <div>
        <p className="text-sm">{t("patient_name_uhid")}</p>
        <p className="font-semibold ">
          {displayPatientName(patient)} / {displayPatientId(patient)}
        </p>
      </div>
      <div>
        <p className="text-sm">
          {t("age")} / {t("sex")}
        </p>
        <p className="font-semibold capitalize">
          {formatPatientAge(patient, true)} / {patient?.gender}
        </p>
      </div>
      <div>
        <p className="text-sm">Phone Number</p>
        <p className="font-semibold">{patient?.phone_number}</p>
      </div>
    </div>
  );
};
