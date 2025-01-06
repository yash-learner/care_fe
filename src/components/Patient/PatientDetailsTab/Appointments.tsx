import { useQuery } from "@tanstack/react-query";
import { Link } from "raviger";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar } from "@/components/Common/Avatar";
import { PatientProps } from "@/components/Patient/PatientDetailsTab";
import { ScheduleAPIs } from "@/components/Schedule/api";

import query from "@/Utils/request/query";
import { formatDateTime, formatName } from "@/Utils/utils";

export const Appointments = (props: PatientProps) => {
  const { patientData, facilityId, id } = props;
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ["patient-appointments", id],
    queryFn: query(ScheduleAPIs.appointments.list, {
      pathParams: { facility_id: facilityId },
      queryParams: { patient: id, limit: 100 },
    }),
  });

  const appointments = data?.results;

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      booked: "bg-yellow-100 text-yellow-800",
      checked_in: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="mt-4 px-3 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold leading-tight">
          {t("appointments")}
        </h2>
        <Button variant="outline_primary" asChild>
          <Link href={`/facility/${facilityId}/patient/${id}/book-appointment`}>
            <CareIcon icon="l-plus" className="mr-2" />
            {t("schedule_appointment")}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("appointment_type")}</TableHead>
              <TableHead>{t("date_and_time")}</TableHead>
              <TableHead>{t("booked_by")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!appointments ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : appointments.length ? (
              appointments.map((appointment, i) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {i + 1}
                    {appointment.token_slot.availability.name}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(appointment.token_slot.start_datetime)}
                  </TableCell>
                  <TableCell>
                    {appointment.booked_by ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          imageUrl={appointment.booked_by?.profile_picture_url}
                          name={formatName(appointment.booked_by)}
                          className="size-6 rounded-full"
                        />
                        <span>{formatName(appointment.booked_by)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">{t("self_booked")}</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/facility/${facilityId}/patient/${patientData.id}/appointments/${appointment.id}`}
                      >
                        <CareIcon icon="l-eye" className="mr-1" />
                        {t("view")}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t("no_appointments")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
