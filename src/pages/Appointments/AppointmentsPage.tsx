import careConfig from "@careConfig";
import { CaretDownIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  format,
  formatDate,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
  subDays,
} from "date-fns";
import { Edit3Icon } from "lucide-react";
import { Link, navigate, useQueryParams } from "raviger";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Avatar } from "@/components/Common/Avatar";
import Loading from "@/components/Common/Loading";
import Page from "@/components/Common/Page";

import useAuthUser from "@/hooks/useAuthUser";

import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import {
  dateQueryString,
  formatDisplayName,
  formatName,
  formatPatientAge,
} from "@/Utils/utils";
import {
  formatSlotTimeRange,
  groupSlotsByAvailability,
} from "@/pages/Appointments/utils";
import { getFakeTokenNumber } from "@/pages/Scheduling/utils";
import {
  Appointment,
  AppointmentStatuses,
  TokenSlot,
} from "@/types/scheduling/schedule";
import scheduleApis from "@/types/scheduling/scheduleApis";

interface QueryParams {
  practitioner: string | null;
  slot: string | null;
  date_from: string | null;
  date_to: string | null;
  search: string | null;
}

interface DateRangeDisplayProps {
  dateFrom: string | null;
  dateTo: string | null;
}

function DateRangeDisplay({ dateFrom, dateTo }: DateRangeDisplayProps) {
  const { t } = useTranslation();

  if (!dateFrom && !dateTo) {
    return (
      <span className="text-gray-500">{t("showing_all_appointments")}</span>
    );
  }

  const today = new Date();

  // Case 1: Today only
  if (
    dateFrom === dateQueryString(today) &&
    dateTo === dateQueryString(today)
  ) {
    return (
      <>
        <span className="text-black">{t("today")}</span>
        <span className="pl-1 text-gray-500">
          ({formatDate(dateFrom, "dd MMM yyyy")})
        </span>
      </>
    );
  }

  // Case 2: Pre-defined ranges
  const ranges = [
    {
      label: t("last_week_short"),
      from: subDays(today, 7),
      to: today,
    },
    {
      label: t("yesterday"),
      from: subDays(today, 1),
      to: subDays(today, 1),
    },
    {
      label: t("next_week_short"),
      from: today,
      to: addDays(today, 7),
    },
    {
      label: t("next_month"),
      from: today,
      to: addDays(today, 30),
    },
  ];

  const matchingRange = ranges.find(
    (range) =>
      dateFrom &&
      dateTo &&
      dateQueryString(range.from) === dateFrom &&
      dateQueryString(range.to) === dateTo,
  );

  if (matchingRange && dateFrom && dateTo) {
    return (
      <>
        <span className="text-black">{matchingRange.label}</span>
        <span className="pl-1 text-gray-500">
          ({formatDate(dateFrom, "dd MMM yyyy")} -{" "}
          {formatDate(dateTo, "dd MMM yyyy")})
        </span>
      </>
    );
  }

  // Case 3: Same date with relative labels
  if (dateFrom && dateFrom === dateTo) {
    const date = new Date(dateFrom);
    let relativeDay = null;

    if (isToday(date)) {
      relativeDay = t("today");
    } else if (isTomorrow(date)) {
      relativeDay = t("tomorrow");
    } else if (isYesterday(date)) {
      relativeDay = t("yesterday");
    }

    if (relativeDay) {
      return (
        <>
          <span className="text-black">{relativeDay}</span>
          <span className="pl-1 text-gray-500">
            ({formatDate(dateFrom, "dd MMM yyyy")})
          </span>
        </>
      );
    }

    return (
      <>
        <span>{t("on")} </span>
        <span className="text-black">
          {formatDate(dateFrom, "dd MMM yyyy")}
        </span>
      </>
    );
  }

  // Case 4: Single date (before or after)
  if (dateFrom && !dateTo) {
    return (
      <>
        <span>{t("after")} </span>
        <span className="text-black">
          {formatDate(dateFrom, "dd MMM yyyy")}
        </span>
      </>
    );
  }

  if (!dateFrom && dateTo) {
    return (
      <>
        <span>{t("before")} </span>
        <span className="text-black">{formatDate(dateTo, "dd MMM yyyy")}</span>
      </>
    );
  }

  // Case 5: Date range
  return (
    <span className="text-black">
      {formatDate(dateFrom!, "dd MMM yyyy")} -{" "}
      {formatDate(dateTo!, "dd MMM yyyy")}
    </span>
  );
}

export default function AppointmentsPage(props: { facilityId?: string }) {
  const { t } = useTranslation();
  const authUser = useAuthUser();

  const [qParams, setQParams] = useQueryParams<QueryParams>();

  const facilityId = props.facilityId ?? authUser.home_facility!;

  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const schedulableUsersQuery = useQuery({
    queryKey: ["schedulable-users", facilityId],
    queryFn: query(scheduleApis.appointments.availableUsers, {
      pathParams: { facility_id: facilityId },
    }),
  });

  const resources = schedulableUsersQuery.data?.users;
  const practitioner = resources?.find(
    (r) => r.username === qParams.practitioner,
  );

  useEffect(() => {
    const updates: Partial<QueryParams> = {};

    // Sets the practitioner filter to the current user if they are in the list of
    // schedulable users and no practitioner was selected.
    if (
      !schedulableUsersQuery.isLoading &&
      !qParams.practitioner &&
      schedulableUsersQuery.data?.users.some(
        (r) => r.username === authUser.username,
      )
    ) {
      updates.practitioner = authUser.username;
    }

    // Set default date range if no dates are present
    if (!qParams.date_from && !qParams.date_to) {
      const today = new Date();
      const defaultDays = careConfig.appointments.defaultDateFilter;

      if (defaultDays === 0) {
        // Today only
        updates.date_from = dateQueryString(today);
        updates.date_to = dateQueryString(today);
      } else {
        // Past or future days based on configuration
        const fromDate = defaultDays > 0 ? today : addDays(today, defaultDays);
        const toDate = defaultDays > 0 ? addDays(today, defaultDays) : today;
        updates.date_from = dateQueryString(fromDate);
        updates.date_to = dateQueryString(toDate);
      }
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      setQParams({
        ...qParams,
        ...updates,
      });
    }
  }, [schedulableUsersQuery.isLoading]);

  // Enabled only if filtered by a practitioner and a single day
  const slotsFilterEnabled =
    !!qParams.date_from &&
    !!practitioner &&
    (qParams.date_from === qParams.date_to || !qParams.date_to);

  const slotsQuery = useQuery({
    queryKey: ["slots", facilityId, qParams.practitioner, qParams.date_from],
    queryFn: query(scheduleApis.slots.getSlotsForDay, {
      pathParams: { facility_id: facilityId },
      body: {
        // voluntarily coalesce to empty string since we know query would be
        // enabled only if practitioner and date_from are present
        user: practitioner?.id ?? "",
        day: qParams.date_from ?? "",
      },
    }),
    enabled: slotsFilterEnabled,
  });

  const slots = slotsQuery.data?.results?.filter((s) => s.allocated > 0);
  const slot = slots?.find((s) => s.id === qParams.slot);

  if (schedulableUsersQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Page
      title={t("appointments")}
      hideBack={true}
      breadcrumbs={false}
      options={
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "board" | "list")}
        >
          <TabsList>
            <TabsTrigger value="board">
              <CareIcon icon="l-kanban" className="mr-2" />
              <span>{t("board")}</span>
            </TabsTrigger>
            <TabsTrigger value="list">
              <CareIcon icon="l-list-ul" className="mr-2" />
              <span>{t("list")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      <div className="mt-4 py-4 flex flex-col md:flex-row gap-4 justify-between border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-start">
          <div className="mt-1">
            <Label className="mb-2 text-black">
              {t("select_practitioner")}
            </Label>
            <Popover>
              <PopoverTrigger
                asChild
                disabled={schedulableUsersQuery.isLoading}
              >
                <Button
                  variant="outline"
                  role="combobox"
                  className="min-w-60 justify-start"
                >
                  {practitioner ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        imageUrl={practitioner.profile_picture_url}
                        name={formatName(practitioner)}
                        className="size-6 rounded-full"
                      />
                      <span>{formatName(practitioner)}</span>
                    </div>
                  ) : (
                    <span>{t("show_all")}</span>
                  )}
                  <CaretDownIcon className="ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("search")}
                    className="outline-none border-none ring-0 shadow-none"
                  />
                  <CommandList>
                    <CommandEmpty>
                      {schedulableUsersQuery.isFetching
                        ? t("searching")
                        : t("no_results")}
                    </CommandEmpty>
                    <CommandGroup>
                      <PopoverClose className="w-full">
                        <CommandItem
                          value="all"
                          onSelect={() =>
                            setQParams({
                              ...qParams,
                              practitioner: null,
                              slot: null,
                            })
                          }
                          className="cursor-pointer"
                        >
                          <span>{t("show_all")}</span>
                          {!qParams.practitioner && (
                            <CheckIcon className="ml-auto" />
                          )}
                        </CommandItem>
                      </PopoverClose>
                      {schedulableUsersQuery.data?.users.map((user) => (
                        <PopoverClose className="w-full" key={user.id}>
                          <CommandItem
                            value={formatName(user)}
                            onSelect={() =>
                              setQParams({
                                ...qParams,
                                practitioner: user.username,
                                slot: null,
                              })
                            }
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar
                                imageUrl={user.profile_picture_url}
                                name={formatName(user)}
                                className="size-6 rounded-full"
                              />
                              <span>{formatName(user)}</span>
                              <span className="text-xs text-gray-500 font-medium">
                                {user.user_type}
                              </span>
                            </div>
                            {qParams.practitioner === user.username && (
                              <CheckIcon className="ml-auto" />
                            )}
                          </CommandItem>
                        </PopoverClose>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <div className="flex items-center gap-1 -mt-2">
              <Label>
                <DateRangeDisplay
                  dateFrom={qParams.date_from}
                  dateTo={qParams.date_to}
                />
              </Label>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit3Icon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => {
                          const today = new Date();
                          setQParams({
                            ...qParams,
                            date_from: dateQueryString(subDays(today, 7)),
                            date_to: dateQueryString(today),
                            slot: null,
                          });
                        }}
                      >
                        {t("last_week_short")}
                      </Button>

                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => {
                          const today = new Date();
                          setQParams({
                            ...qParams,
                            date_from: dateQueryString(subDays(today, 1)),
                            date_to: dateQueryString(subDays(today, 1)),
                            slot: null,
                          });
                        }}
                      >
                        {t("yesterday")}
                      </Button>

                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => {
                          const today = new Date();
                          setQParams({
                            ...qParams,
                            date_from: dateQueryString(today),
                            date_to: dateQueryString(today),
                            slot: null,
                          });
                        }}
                      >
                        {t("today")}
                      </Button>

                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => {
                          const today = new Date();
                          setQParams({
                            ...qParams,
                            date_from: dateQueryString(today),
                            date_to: dateQueryString(addDays(today, 7)),
                            slot: null,
                          });
                        }}
                      >
                        {t("next_week_short")}
                      </Button>

                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => {
                          const today = new Date();
                          setQParams({
                            ...qParams,
                            date_from: dateQueryString(today),
                            date_to: dateQueryString(addDays(today, 30)),
                            slot: null,
                          });
                        }}
                      >
                        {t("next_month")}
                      </Button>
                    </div>

                    <DateRangePicker
                      date={{
                        from: qParams.date_from
                          ? new Date(qParams.date_from)
                          : undefined,
                        to: qParams.date_to
                          ? new Date(qParams.date_to)
                          : undefined,
                      }}
                      onChange={(date) =>
                        setQParams({
                          ...qParams,
                          date_from: date?.from
                            ? dateQueryString(date.from)
                            : null,
                          date_to: date?.to ? dateQueryString(date?.to) : null,
                          slot: null,
                        })
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {slotsFilterEnabled && !!slots?.length && (
              <SlotFilter
                slots={slots}
                selectedSlot={slot}
                onSelect={(slot) => {
                  if (slot === "all") {
                    setQParams({ ...qParams, slot: null });
                  } else {
                    setQParams({ ...qParams, slot });
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Input
            className="w-[300px]"
            placeholder={t("search")}
            value={qParams.search ?? ""}
            onChange={(e) => setQParams({ ...qParams, search: e.target.value })}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <CareIcon icon="l-filter" className="mr-2" />
                <span>{t("filter")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-11">
              <div>
                <Label className="mb-2">{t("date")}</Label>
                <DateRangePicker
                  date={{
                    from: qParams.date_from
                      ? new Date(qParams.date_from)
                      : undefined,
                    to: qParams.date_to ? new Date(qParams.date_to) : undefined,
                  }}
                  onChange={(date) =>
                    setQParams({
                      ...qParams,
                      date_from: date?.from ? dateQueryString(date.from) : null,
                      date_to: date?.to ? dateQueryString(date?.to) : null,
                    })
                  }
                />
              </div>
              <div className="flex justify-end bg-gray-100 mt-6 -m-4 py-3 px-4 rounded-md">
                <Button
                  variant="outline"
                  onClick={() =>
                    setQParams({
                      date_from: null,
                      date_to: null,
                      slot: null,
                      search: null,
                      practitioner: null,
                    })
                  }
                >
                  <ReloadIcon className="mr-2" />
                  {t("clear_all_filters")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {viewMode === "board" ? (
        <ScrollArea>
          <div className="flex w-max space-x-4">
            {(
              [
                "booked",
                "checked_in",
                "in_consultation",
                "fulfilled",
                "noshow",
              ] as const
            ).map((status) => (
              <AppointmentColumn
                key={status}
                status={status}
                facilityId={facilityId}
                slot={slot?.id}
                practitioner={practitioner?.id ?? null}
                date_from={qParams.date_from}
                date_to={qParams.date_to}
                search={qParams.search?.toLowerCase()}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <AppointmentRow
          facilityId={facilityId}
          practitioner={practitioner?.id ?? null}
          slot={qParams.slot}
          date_from={qParams.date_from}
          date_to={qParams.date_to}
          search={qParams.search?.toLowerCase()}
        />
      )}
    </Page>
  );
}

function AppointmentColumn(props: {
  facilityId: string;
  status: Appointment["status"];
  practitioner: string | null;
  slot?: string | null;
  date_from: string | null;
  date_to: string | null;
  search?: string;
}) {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: [
      "appointments",
      props.facilityId,
      props.status,
      props.practitioner,
      props.slot,
      props.date_from,
      props.date_to,
    ],
    queryFn: query(scheduleApis.appointments.list, {
      pathParams: { facility_id: props.facilityId },
      queryParams: {
        status: props.status,
        limit: 100,
        slot: props.slot,
        user: props.practitioner ?? undefined,
        date_after: props.date_from,
        date_before: props.date_to,
      },
    }),
  });

  let appointments = data?.results ?? [];

  if (props.search) {
    appointments = appointments.filter(({ patient }) =>
      patient.name.toLowerCase().includes(props.search!),
    );
  }

  return (
    <div
      className={cn(
        "bg-gray-100 py-4 rounded-lg w-[20rem] overflow-y-hidden",
        !data && "animate-pulse",
      )}
    >
      <div className="flex px-3 items-center gap-3 mb-4">
        <h2 className="font-semibold capitalize text-base px-1">
          {t(props.status)}
        </h2>
        <span className="bg-gray-200 px-2 py-1 rounded-md text-sm">
          {data?.count ?? "..."}
        </span>
      </div>
      {appointments.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-18rem)]">
          <p className="text-gray-500">{t("no_appointments")}</p>
        </div>
      ) : (
        <ScrollArea>
          <ul className="space-y-3 px-3 pb-4 pt-1 h-[calc(100vh-18rem)]">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <Link
                  href={`/facility/${props.facilityId}/patient/${appointment.patient.id}/appointments/${appointment.id}`}
                  className="text-inherit"
                >
                  <AppointmentCard appointment={appointment} />
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
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
          <h3 className="font-semibold text-base group-hover:text-primary-700 transition-all duration-200 ease-in-out">
            {patient.name}
          </h3>
          <p className="text-sm text-gray-700">
            {formatPatientAge(patient as any, true)},{" "}
            {t(`GENDER__${patient.gender}`)}
          </p>
        </div>

        <div className="bg-gray-100 px-2 py-1 rounded text-center">
          <p className="text-[10px] uppercase">{t("token")}</p>
          {/* TODO: replace this with token number once that's ready... */}
          <p className="font-bold text-2xl uppercase">
            {getFakeTokenNumber(appointment)}
          </p>
        </div>
      </div>
    </div>
  );
}
function AppointmentRow(props: {
  facilityId: string;
  practitioner: string | null;
  slot: string | null;
  date_from: string | null;
  date_to: string | null;
  search?: string;
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Appointment["status"]>("booked");

  const { data } = useQuery({
    queryKey: [
      "appointments",
      props.facilityId,
      status,
      props.practitioner,
      props.slot,
      props.date_from,
      props.date_to,
    ],
    queryFn: query(scheduleApis.appointments.list, {
      pathParams: { facility_id: props.facilityId },
      queryParams: {
        status: status,
        limit: 100,
        slot: props.slot,
        user: props.practitioner ?? undefined,
        date_after: props.date_from,
        date_before: props.date_to,
      },
    }),
  });

  let appointments = data?.results ?? [];

  if (props.search) {
    appointments = appointments.filter(({ patient }) =>
      patient.name.toLowerCase().includes(props.search!),
    );
  }
  return (
    <>
      <div className={cn(!data && "animate-pulse")}>
        <Tabs
          value={status}
          onValueChange={(value) => setStatus(value as Appointment["status"])}
        >
          <TabsList>
            <TabsTrigger value="booked">{t("booked")}</TabsTrigger>
            <TabsTrigger value="checked_in">{t("checked_in")}</TabsTrigger>
            <TabsTrigger value="in_consultation">
              {t("in_consultation")}
            </TabsTrigger>
            <TabsTrigger value="fulfilled">{t("fulfilled")}</TabsTrigger>
            <TabsTrigger value="noshow">{t("noshow")}</TabsTrigger>
          </TabsList>
        </Tabs>
        {appointments.length === 0 ? (
          <div className="flex mt-2 bg-white justify-center items-center h-[calc(100vh-22rem)]">
            <p className="text-gray-500">{t("no_appointments")}</p>
          </div>
        ) : (
          <Table className="p-2 border-separate border-spacing-y-3 min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8 font-semibold text-black text-xs">
                  {t("patient")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("room_apt")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("consulting_doctor")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("labels")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("triage_category")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("current_status")}
                </TableHead>
                <TableHead className="font-semibold text-black text-xs">
                  {t("token_no")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="shadow rounded-lg cursor-pointer group"
                  onClick={() =>
                    navigate(
                      `/facility/${props.facilityId}/patient/${appointment.patient.id}/appointments/${appointment.id}`,
                    )
                  }
                >
                  <AppointmentRowItem
                    appointment={appointment}
                    facilityId={props.facilityId}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

function AppointmentRowItem({
  appointment,
  facilityId,
}: {
  appointment: Appointment;
  facilityId: string;
}) {
  const { patient } = appointment;
  const { t } = useTranslation();

  return (
    <>
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white rounded-l-lg">
        <span className="flex flex-row items-center gap-2">
          <CareIcon
            icon="l-draggabledots"
            className="size-4 invisible group-hover:visible"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold">{patient.name}</span>
            <span className="text-xs text-gray-500">
              {formatPatientAge(patient as any, true)},{" "}
              {t(`GENDER__${patient.gender}`)}
            </span>
          </span>
        </span>
      </TableCell>
      {/* TODO: Replace with relevant information */}
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white">
        <p>{"Need Room Information"}</p>
      </TableCell>
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white">
        {formatDisplayName(appointment.user)}
      </TableCell>
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white">
        <p>{"Need Labels"}</p>
      </TableCell>
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white">
        <p>{"Need Triage Category"}</p>
      </TableCell>
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white">
        <AppointmentStatusDropdown
          appointment={appointment}
          facilityId={facilityId}
        />
      </TableCell>
      {/* TODO: replace this with token number once that's ready... */}
      <TableCell className="py-6 group-hover:bg-gray-100 bg-white rounded-r-lg">
        {getFakeTokenNumber(appointment)}
      </TableCell>
    </>
  );
}

const AppointmentStatusDropdown = ({
  appointment,
  facilityId,
}: {
  appointment: Appointment;
  facilityId: string;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentStatus = appointment.status;
  const hasStarted = isPast(appointment.token_slot.start_datetime);

  const { mutate: updateAppointment } = useMutation({
    mutationFn: mutate(scheduleApis.appointments.update, {
      pathParams: {
        facility_id: facilityId,
        id: appointment.id,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", facilityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointment.id],
      });
    },
  });

  // Get available status options based on current status
  const getAvailableStatuses = () => {
    if (
      ["fulfilled", "cancelled", "entered_in_error"].includes(currentStatus)
    ) {
      return [currentStatus];
    }

    if (currentStatus === "booked") {
      return ["booked", "checked_in", "in_consultation", "noshow", "cancelled"];
    }

    if (currentStatus === "checked_in") {
      return ["checked_in", "in_consultation", "noshow", "cancelled"];
    }

    if (currentStatus === "in_consultation") {
      return ["in_consultation", "fulfilled", "cancelled"];
    }

    return AppointmentStatuses;
  };

  return (
    <div className="w-32">
      <Select
        value={currentStatus}
        onValueChange={(value) =>
          updateAppointment({ status: value as Appointment["status"] })
        }
      >
        <SelectTrigger>
          <CareIcon icon="l-schedule" className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getAvailableStatuses().map((status) => (
            <SelectItem
              key={status}
              value={status}
              disabled={
                !hasStarted &&
                ["checked_in", "in_consultation", "fulfilled"].includes(status)
              }
            >
              {t(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface SlotFilterProps {
  slots: TokenSlot[];
  disableInline?: boolean;
  disabled?: boolean;
  selectedSlot: TokenSlot | undefined;
  onSelect: (slot: string) => void;
}

export const SlotFilter = ({
  slots,
  selectedSlot,
  onSelect,
  ...props
}: SlotFilterProps) => {
  const { t } = useTranslation();

  if (slots.length <= 3 && !props.disableInline) {
    return (
      <Tabs value={selectedSlot?.id ?? "all"} onValueChange={onSelect}>
        <TabsList>
          <TabsTrigger
            value="all"
            className="uppercase"
            disabled={props.disabled}
          >
            {t("all")}
          </TabsTrigger>
          {slots.map((slot) => (
            <TabsTrigger
              key={slot.id}
              value={slot.id}
              disabled={props.disabled}
            >
              {format(slot.start_datetime, "h:mm a").replace(":00", "")}
              {" - "}
              {format(slot.end_datetime, "h:mm a").replace(":00", "")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  }

  const slotsByAvailability = groupSlotsByAvailability(slots);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="min-w-60 justify-start"
          disabled={props.disabled}
        >
          {selectedSlot ? (
            <div className="flex items-center gap-2">
              <span>{formatSlotTimeRange(selectedSlot)}</span>
            </div>
          ) : (
            <span>{t("show_all_slots")}</span>
          )}
          <CaretDownIcon className="ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t("search")}
            className="outline-none border-none ring-0 shadow-none"
          />
          <CommandList>
            <CommandEmpty>{t("no_slots_found")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => onSelect("all")}
                className="cursor-pointer"
              >
                <span>{t("show_all")}</span>
                {selectedSlot === undefined && (
                  <CheckIcon className="ml-auto" />
                )}
              </CommandItem>
            </CommandGroup>
            {slotsByAvailability.map(({ availability, slots }) => (
              <>
                <CommandSeparator />
                <CommandGroup
                  key={availability.name}
                  heading={availability.name}
                >
                  {slots.map((slot) => (
                    <CommandItem
                      key={slot.id}
                      value={formatSlotTimeRange(slot)}
                      onSelect={() => onSelect(slot.id)}
                      className="cursor-pointer"
                    >
                      <span>{formatSlotTimeRange(slot)}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {slot.allocated} / {availability.tokens_per_slot}
                      </span>
                      {selectedSlot?.id === slot.id && (
                        <CheckIcon className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
