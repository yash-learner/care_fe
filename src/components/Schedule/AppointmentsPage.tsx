import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Link } from "raviger";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Page from "@/components/Common/Page";
import { ScheduleAPIs } from "@/components/Schedule/api";
import {
  filterAvailabilitiesByDayOfWeek,
  getFakeTokenNumber,
} from "@/components/Schedule/helpers";
import { Appointment, ScheduleAvailability } from "@/components/Schedule/types";
import { formatAvailabilityTime } from "@/components/Users/UserAvailabilityTab";

import useAuthUser from "@/hooks/useAuthUser";

import query from "@/Utils/request/query";
import { formatName, formatPatientAge } from "@/Utils/utils";

export default function AppointmentsPage() {
  const authUser = useAuthUser();
  const facilityId = authUser.home_facility!;

  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [selectedResource, setSelectedResource] = useState<string>();
  const [selectedSlot, setSelectedSlot] = useState<ScheduleAvailability>();

  const availableResourcesQuery = useQuery({
    queryKey: ["availableResources", facilityId],
    queryFn: query(ScheduleAPIs.appointments.availableDoctors, {
      pathParams: { facility_id: facilityId },
    }),
  });

  useEffect(() => {
    if (availableResourcesQuery.data?.users.length && !selectedResource) {
      setSelectedResource(availableResourcesQuery.data?.users[0].id);
    }
  }, [availableResourcesQuery.data, selectedResource]);

  const selectedResourceObj = availableResourcesQuery.data?.users.find(
    (r) => r.id === selectedResource,
  );

  const slots = useSlots(facilityId, selectedResourceObj?.id);

  return (
    <Page title="Out Patient (OP) Appointments" collapseSidebar>
      <div className="mt-4 py-4 flex flex-col md:flex-row gap-4 justify-between border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div>
            <Label className="mb-2 text-black">Select Doctor</Label>
            <Select
              value={selectedResourceObj?.id}
              onValueChange={(value) => {
                const resource = availableResourcesQuery.data?.users.find(
                  (r) => r.id === value,
                );
                setSelectedResource(resource?.id);
              }}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Show all" />
              </SelectTrigger>
              <SelectContent>
                {availableResourcesQuery.data?.users.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      {/* <Avatar
                        imageUrl={doctor.read_profile_picture_url}
                        name={formatName(doctor)}
                        className="size-6 rounded-full"
                      /> */}
                      <span>{formatName(doctor)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2">
              <span className="text-black">Today</span>
              <span className="pl-1 text-gray-500">
                ({formatDate(new Date(), "dd MMM yyyy")})
              </span>
            </Label>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1 max-w-min">
              <Button
                variant={selectedSlot ? "ghost" : "outline"}
                onClick={() => setSelectedSlot(undefined)}
                className={cn(!selectedSlot && "shadow", "hover:bg-white")}
              >
                ALL
              </Button>
              {slots?.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? "outline" : "ghost"}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    selectedSlot?.id === slot.id && "shadow",
                    "hover:bg-white",
                  )}
                >
                  {formatAvailabilityTime(slot.availability)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Input className="w-[300px]" placeholder="Search" />
          {/* <Button variant="outline">Filter</Button> */}
          <div className="flex border rounded-lg">
            <Button
              variant="ghost"
              className={cn(
                "rounded-r-none",
                viewMode === "board" && "bg-gray-100",
              )}
              onClick={() => setViewMode("board")}
            >
              Board
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "rounded-l-none",
                viewMode === "list" && "bg-gray-100",
              )}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea>
        <div className="flex w-max space-x-4">
          <AppointmentColumn category="scheduled" facilityId={facilityId} />
          <AppointmentColumn category="checked-in" facilityId={facilityId} />
          <AppointmentColumn
            category="in-consultation"
            facilityId={facilityId}
          />
          <AppointmentColumn category="completed" facilityId={facilityId} />
          <AppointmentColumn category="no-show" facilityId={facilityId} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Page>
  );
}

function AppointmentColumn(props: { category: string; facilityId: string }) {
  const { data } = useQuery({
    queryKey: ["appointments", props.facilityId, props.category],
    queryFn: query(ScheduleAPIs.appointments.list, {
      pathParams: { facility_id: props.facilityId },
      // TODO: unlock this once BE is ready
      //   queryParams: {
      //     category: _category,
      //     doctor_username: props.doctorUsername,
      //   },
    }),
  });

  const appointments = data?.results ?? [];

  return (
    <div
      className={cn(
        "bg-gray-100 py-4 px-3 rounded-lg w-[20rem] h-[calc(100vh-17rem)]",
        !data && "animate-pulse",
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-semibold capitalize text-base px-1">
          {props.category.replace("-", " ")}
        </h2>
        <span className="bg-gray-200 px-2 py-1 rounded-md text-sm">
          {data?.count ?? "..."}
        </span>
      </div>
      <ScrollArea>
        <ul className="space-y-3 px-0.5 pb-4 pt-1">
          {appointments.map((appointment) => (
            <li>
              <Link
                href={`/facility/${props.facilityId}/patient/${appointment.patient.id}/encounters`}
                className="text-inherit"
              >
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              </Link>
            </li>
          ))}
        </ul>
        {appointments.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No appointments</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { patient } = appointment;
  const { t } = useTranslation();

  return (
    <div className="bg-white p-3 rounded shadow group hover:ring-1 hover:ring-primary-700 hover:ring-offset-1 hover:ring-offset-white hover:shadow-md transition-all duration-100 ease-in-out">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-base group-hover:underline underline-offset-2 group-hover:text-primary-700 transition-all duration-200 ease-in-out">
            {patient.name}
          </h3>
          <p className="text-sm text-gray-700">
            {formatPatientAge(patient as any, true)},{" "}
            {t(`GENDER__${patient.gender}`)}
          </p>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded text-center">
          <p className="text-[10px]">TOKEN</p>
          {/* TODO: replace this with token number once that's ready... */}
          <p className="font-bold text-2xl uppercase">
            {getFakeTokenNumber(appointment)}
          </p>
        </div>
      </div>
    </div>
  );
}
const useSlots = (facilityId: string, username?: string) => {
  const templatesQuery = useQuery({
    queryKey: ["slots", facilityId, username],
    queryFn: query(ScheduleAPIs.templates.list, {
      pathParams: { facility_id: facilityId },
      queryParams: {
        doctor_username: username!,
      },
    }),
    enabled: !!username,
  });

  if (!templatesQuery.data) {
    return null;
  }

  const today = new Date();

  return (
    templatesQuery.data.results
      // .filter((t) => isDateInRange(today, t.valid_from, t.valid_to)) // TODO: uncomment this, temp hack.
      .flatMap((t) => filterAvailabilitiesByDayOfWeek(t.availabilities, today))
  );
};
