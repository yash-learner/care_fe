import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar } from "@/components/Common/Avatar";

import { PatientUserContextType } from "@/Providers/PatientUserProvider";
import { classNames } from "@/Utils/utils";

import { useSidebar } from "../sidebar";

interface PatientSwitcherProps {
  patientUserContext: PatientUserContextType;
  className?: string;
}

export function PatientSwitcher({
  patientUserContext,
  className,
}: PatientSwitcherProps) {
  const { t } = useTranslation();
  const { open } = useSidebar();

  return (
    <div
      className={classNames(
        "mx-2 mt-4 mb-2 flex flex-wrap flex-row",
        className,
      )}
    >
      <Select
        disabled={patientUserContext.patients?.length === 0}
        value={
          patientUserContext.selectedPatient
            ? patientUserContext.selectedPatient.id
            : "Book "
        }
        onValueChange={(value) => {
          const patient = patientUserContext.patients?.find(
            (patient) => patient.id === value,
          );
          if (patient) {
            patientUserContext.setSelectedPatient(patient);
            localStorage.setItem("selectedPatient", JSON.stringify(patient));
          }
        }}
      >
        <SelectTrigger>
          <SelectValue
            asChild
            placeholder={
              patientUserContext.patients?.length === 0
                ? t("no_patients")
                : t("select_patient")
            }
          >
            <>
              {open && (
                <div className="flex flex-row justify-between items-center gap-2 w-full text-primary-800">
                  <Avatar
                    name={patientUserContext.selectedPatient?.name}
                    className="h-4 w-4"
                  />
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <span className="font-semibold truncate max-w-32">
                      {patientUserContext.selectedPatient?.name}
                    </span>
                    <span className="text-xs text-secondary-600">
                      {t("switch")}
                    </span>
                  </div>
                </div>
              )}
              {!open && (
                <div className="flex flex-row items-center -ml-1.5">
                  <Avatar
                    name={patientUserContext.selectedPatient?.name}
                    className="h-4 w-4"
                  />
                </div>
              )}
            </>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {patientUserContext.patients?.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              <div className="flex flex-row items-center gap-2">
                <Avatar name={patient.name} className="h-4 w-4" />
                {patient.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
