import {
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  DrawingPinIcon,
  MobileIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { differenceInHours, differenceInYears, format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Loading from "@/components/Common/Loading";
import Page from "@/components/Common/Page";
import { FacilityModel } from "@/components/Facility/models";
import { AppointmentTokenCard } from "@/components/Schedule/Appointments/AppointmentTokenCard";
import { formatAppointmentSlotTime } from "@/components/Schedule/Appointments/utils";
import { ScheduleAPIs } from "@/components/Schedule/api";
import { Appointment } from "@/components/Schedule/types";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { formatName, saveElementAsImage } from "@/Utils/utils";

interface Props {
  facilityId: string;
  appointmentId: string;
}

export default function AppointmentDetailsPage(props: Props) {
  const { t } = useTranslation();

  const facilityQuery = useQuery({
    queryKey: ["facility", props.facilityId],
    queryFn: query(routes.getPermittedFacility, {
      pathParams: {
        id: props.facilityId,
      },
    }),
  });

  const appointmentQuery = useQuery({
    queryKey: ["appointment", props.appointmentId],
    queryFn: query(ScheduleAPIs.appointments.retrieve, {
      pathParams: {
        facility_id: props.facilityId,
        id: props.appointmentId,
      },
    }),
  });

  const appointment = appointmentQuery.data;
  const facility = facilityQuery.data;

  if (!facility || !appointment) {
    return <Loading />;
  }

  const { patient } = appointment;
  const appointmentDate = formatAppointmentSlotTime(appointment);

  return (
    <Page
      title={t("appointment_details")}
      crumbsReplacements={{
        [facility.id!]: { name: facility.name },
        [patient.id]: { name: patient.name },
        [appointment.id]: { name: `Appointment on ${appointmentDate}` },
      }}
    >
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row">
          <AppointmentDetails
            appointment={appointmentQuery.data}
            facility={facilityQuery.data}
          />
          <div className="mt-3">
            <div id="appointment-token-card" className="bg-gray-50 p-4">
              <AppointmentTokenCard
                appointment={appointmentQuery.data}
                facility={facilityQuery.data}
              />
            </div>
            <div className="flex justify-end px-6">
              {/* TODO: use navigator.share */}
              <Button
                variant="default"
                onClick={async () => {
                  await saveElementAsImage(
                    "appointment-token-card",
                    `${patient.name}'s Appointment.png`,
                  );
                  toast.success("Appointment card has been saved!");
                }}
              >
                <DownloadIcon className="size-4 mr-2" />
                <span>{t("save")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

const AppointmentDetails = ({
  appointment,
  facility,
}: {
  appointment: Appointment;
  facility: FacilityModel;
}) => {
  const { patient, resource } = appointment;
  const { t } = useTranslation();

  return (
    <div className="container p-6 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="mr-3">{t("schedule_information")}</span>
            <Badge
              variant={
                (
                  {
                    booked: "secondary",
                    checked_in: "primary",
                    in_consultation: "primary",
                    pending: "secondary",
                    arrived: "primary",
                    fulfilled: "default",
                    entered_in_error: "destructive",
                    cancelled: "destructive",
                    noshow: "destructive",
                  } as Record<Appointment["status"], BadgeProps["variant"]>
                )[appointment.status] ?? "outline"
              }
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">
                {format(appointment.token_slot.start_datetime, "MMMM d, yyyy")}
              </p>
              <p className="text-gray-600">
                {appointment.token_slot.availability.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <ClockIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">
                {format(appointment.token_slot.start_datetime, "h:mm a")} -{" "}
                {format(appointment.token_slot.end_datetime, "h:mm a")}
              </p>
              <p className="text-gray-600 capitalize">
                {t("duration")}:{" "}
                {differenceInHours(
                  appointment.token_slot.end_datetime,
                  appointment.token_slot.start_datetime,
                )}{" "}
                {t("hours")}
              </p>
            </div>
          </div>
          <Separator />
          <div className="text-sm">
            <p className="font-medium">{t("reason_for_visit")}</p>
            <p className="text-gray-600">{appointment.reason_for_visit}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("patient_information")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <PersonIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">{appointment.patient.name}</p>
              <p className="text-gray-600">
                {format(appointment.patient.date_of_birth!, "MMMM d, yyyy")} (
                {differenceInYears(
                  new Date(),
                  appointment.patient.date_of_birth!,
                )}{" "}
                {t("years")})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <MobileIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">{appointment.patient.phone_number}</p>
              <p className="text-gray-600">
                {t("emergency")}: {appointment.patient.emergency_phone_number}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <DrawingPinIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">
                {appointment.patient.address || t("no_address_provided")}
              </p>
              <p className="text-gray-600">
                {[
                  patient.ward,
                  patient.local_body,
                  patient.district,
                  patient.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-gray-600">
                {t("pincode")}: {appointment.patient.pincode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("practitioner_information")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="text-sm">
              <p className="font-medium">{formatName(resource)}</p>
              <p className="text-gray-600">{resource.email}</p>
            </div>
            <Separator />
            <div className="text-sm">
              <p className="font-medium">{t("facility")}</p>
              <p className="text-gray-600">{facility.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-600">
        {t("booked_by")} {appointment.booked_by?.first_name}{" "}
        {appointment.booked_by?.last_name} {t("on")}{" "}
        {format(appointment.booked_on, "MMMM d, yyyy 'at' h:mm a")}
      </div>
    </div>
  );
};
