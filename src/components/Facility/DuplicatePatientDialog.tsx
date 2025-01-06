import { useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import DialogModal from "@/components/Common/Dialog";

import { PartialPatientModel } from "@/types/emr/newPatient";

import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  patientList: Array<PartialPatientModel>;
  handleOk: (action: string) => void;
  handleCancel: () => void;
}

const DuplicatePatientDialog = (props: Props) => {
  const { t } = useTranslation();
  const { patientList, handleOk, handleCancel } = props;
  const [action, setAction] = useState("");

  return (
    <DialogModal
      title={t("patient_records_found")}
      show={true}
      onClose={handleCancel}
      className="w-3/4 md:w-1/2"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm leading-relaxed">
            {t("patient_records_found_description")}(
            <span className="font-bold">{patientList[0].phone_number}</span>)
          </p>
        </div>
        <div>
          <div className="max-h-[200px] overflow-auto ">
            <Table>
              <TableHeader>
                <TableRow>
                  {[`${t("patient_name")} / ID`, t("gender")].map(
                    (heading, i) => (
                      <TableHead key={i}>{heading}</TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientList.map((patient, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="font-semibold capitalize">
                          {patient.name}
                        </div>
                        <div className="break-words text-xs">
                          ID : {patient.id}
                        </div>
                      </TableCell>
                      <TableCell>{patient.gender}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center">
            <label
              className="mb-2 ml-0 flex w-full rounded-md bg-primary-500 py-2 pr-2 text-white"
              htmlFor="transfer"
            >
              <input
                type="radio"
                className="m-3 text-green-600 focus:ring-2 focus:ring-green-500"
                id="transfer"
                name="confirm_action"
                value="transfer"
                onChange={(e) => setAction(e.target.value)}
              />
              <p>{t("duplicate_patient_record_confirmation")}</p>
            </label>
          </div>

          <div className="mb-2 flex items-center">
            <label
              className="mb-2 ml-0 flex w-full rounded-md bg-red-500 py-2 pr-2 text-white"
              htmlFor="close"
            >
              <input
                type="radio"
                id="close"
                className="m-3 text-red-600 focus:ring-2 focus:ring-red-500"
                name="confirm_action"
                value="close"
                onChange={(e) => setAction(e.target.value)}
              />
              <p>{t("duplicate_patient_record_rejection")}</p>
            </label>
          </div>

          <p>{t("duplicate_patient_record_birth_unknown")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col justify-between sm:flex-row">
        <Button onClick={handleCancel} className="gap-1" variant={"secondary"}>
          <CareIcon icon="l-times" className="text-lg" />
          {t("close")}
        </Button>
        <Button
          onClick={() => handleOk(action)}
          disabled={!action}
          variant={"primary"}
        >
          <CareIcon icon="l-check" className="text-lg mr-1" />
          {t("continue")}
        </Button>
      </div>
    </DialogModal>
  );
};

export default DuplicatePatientDialog;
