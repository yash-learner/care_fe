import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "raviger";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";
import Calendar from "@/CAREUI/interactive/Calendar";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Loading from "@/components/Common/Loading";

import useSlug from "@/hooks/useSlug";

import query from "@/Utils/request/query";
import {
  dateQueryString,
  formatTimeShort,
  humanizeStrings,
} from "@/Utils/utils";
import ScheduleExceptions from "@/pages/Scheduling/ScheduleExceptions";
import ScheduleTemplates from "@/pages/Scheduling/ScheduleTemplates";
import CreateScheduleExceptionSheet from "@/pages/Scheduling/components/CreateScheduleExceptionSheet";
import CreateScheduleTemplateSheet from "@/pages/Scheduling/components/CreateScheduleTemplateSheet";
import {
  computeAppointmentSlots,
  filterAvailabilitiesByDayOfWeek,
  getSlotsPerSession,
  isDateInRange,
} from "@/pages/Scheduling/utils";
import {
  AvailabilityDateTime,
  ScheduleException,
  ScheduleTemplate,
} from "@/types/scheduling/schedule";
import scheduleApis from "@/types/scheduling/scheduleApis";
import { UserBase } from "@/types/user/user";

type Props = {
  userData: UserBase;
};

type AvailabilityTabQueryParams = {
  tab?: "schedule" | "exceptions" | null;
  sheet?: "create_template" | "add_exception" | null;
  valid_from?: string | null;
  valid_to?: string | null;
};

export default function UserAvailabilityTab({ userData: user }: Props) {
  const { t } = useTranslation();
  const [qParams, setQParams] = useQueryParams<AvailabilityTabQueryParams>();
  const view = qParams.tab || "schedule";
  const [month, setMonth] = useState(new Date());

  const facilityId = useSlug("facility");

  const templatesQuery = useQuery({
    queryKey: ["user-schedule-templates", { facilityId, userId: user.id }],
    queryFn: query(scheduleApis.templates.list, {
      pathParams: { facility_id: facilityId! },
      queryParams: { user: user.id },
    }),
    enabled: !!facilityId,
  });

  const exceptionsQuery = useQuery({
    queryKey: ["user-schedule-exceptions", { facilityId, userId: user.id }],
    queryFn: query(scheduleApis.exceptions.list, {
      pathParams: { facility_id: facilityId! },
      queryParams: { user: user.id },
    }),
  });

  if (!templatesQuery.data || !exceptionsQuery.data) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 py-4 lg:grid-cols-2">
      <Calendar
        className="lg:order-last"
        month={month}
        onMonthChange={setMonth}
        renderDay={(date: Date) => {
          const isToday = date.toDateString() === new Date().toDateString();

          // TODO: handle for "Closed" schedule type once we have it...
          const templates = templatesQuery.data?.results.filter(
            (template) =>
              isDateInRange(date, template.valid_from, template.valid_to) &&
              filterAvailabilitiesByDayOfWeek(template.availabilities, date)
                .length > 0,
          );

          const unavailableExceptions =
            exceptionsQuery.data?.results.filter((exception) =>
              isDateInRange(date, exception.valid_from, exception.valid_to),
            ) ?? [];

          const isFullDayUnavailable = unavailableExceptions.some(
            (exception) =>
              exception.start_time.startsWith("00:00") &&
              exception.end_time.startsWith("23:59"),
          );

          return (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "grid h-full cursor-pointer grid-rows-[1fr_auto_1fr] rounded-lg transition-all bg-gray-100 hover:bg-white data-[state=open]:bg-white",
                    templatesQuery.isLoading &&
                      "opacity-50 pointer-events-none",
                    "transition-all duration-200 ease-in-out",
                    "relative overflow-hidden",
                  )}
                >
                  {unavailableExceptions.length > 0 && (
                    <div
                      className={cn(
                        "absolute top-0 left-0 right-0 z-10",
                        isFullDayUnavailable ? "h-full" : "h-1/4",
                      )}
                      style={diagonalStripes}
                    />
                  )}
                  <div />
                  <div className="flex flex-col items-center gap-2 relative z-20">
                    <span
                      className={cn(
                        "text-base",
                        isToday ? "text-gray-900" : "text-gray-500",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <div className="flex justify-center gap-0.5">
                      {templates
                        ?.slice(0, 5)
                        .map((template) => (
                          <ColoredIndicator
                            key={template.id}
                            id={template.id}
                            className="size-1.5 rounded-full"
                          />
                        ))}
                    </div>
                  </div>
                  <div />
                </div>
              </PopoverTrigger>
              <DayDetailsPopover
                date={date}
                templates={templates}
                unavailableExceptions={unavailableExceptions}
                setQParams={setQParams}
              />
            </Popover>
          );
        }}
      />

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1 max-w-min">
            <Button
              variant={view === "schedule" ? "outline" : "ghost"}
              onClick={() => setQParams({ tab: "schedule" })}
              className={cn(view === "schedule" && "shadow", "hover:bg-white")}
            >
              {t("schedule")}
            </Button>
            <Button
              variant={view === "exceptions" ? "outline" : "ghost"}
              onClick={() => setQParams({ tab: "exceptions" })}
              className={cn(
                view === "exceptions" && "shadow",
                "hover:bg-white",
              )}
            >
              {t("exceptions")}
            </Button>
          </div>
          {view === "schedule" && (
            <CreateScheduleTemplateSheet
              facilityId={facilityId}
              userId={user.id}
            />
          )}
          {view === "exceptions" && (
            <CreateScheduleExceptionSheet
              facilityId={facilityId}
              userId={user.id}
            />
          )}
        </div>

        <div>
          <ScrollArea className="h-[calc(100vh-24rem)] -mr-3 pr-3 pb-4">
            {view === "schedule" && (
              <ScheduleTemplates
                facilityId={facilityId}
                userId={user.id}
                items={
                  templatesQuery.isLoading
                    ? undefined
                    : templatesQuery.data.results
                }
              />
            )}

            {view === "exceptions" && (
              <ScheduleExceptions
                items={
                  exceptionsQuery.isLoading
                    ? undefined
                    : exceptionsQuery.data?.results
                }
                facilityId={facilityId}
                userId={user.id}
              />
            )}

            <div className="h-10" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function DayDetailsPopover({
  date,
  templates,
  unavailableExceptions,
  setQParams,
}: {
  date: Date;
  templates: ScheduleTemplate[];
  unavailableExceptions: ScheduleException[];
  setQParams: (params: AvailabilityTabQueryParams) => void;
}) {
  const { t } = useTranslation();

  return (
    <PopoverContent className="p-6" align="center" sideOffset={5}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {date.toLocaleDateString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setQParams({
              tab: "exceptions",
              sheet: "add_exception",
              valid_from: dateQueryString(date),
              valid_to: dateQueryString(date),
            })
          }
        >
          {t("add_exception")}
        </Button>
      </div>

      <ScrollArea className="h-[22rem]">
        {templates.map((template) => (
          <div key={template.id} className="border-t pt-3 mt-3">
            <div className="flex items-center">
              <ColoredIndicator
                className="mr-2 size-3 rounded"
                id={template.id}
              />
              <h3 className="text-lg font-semibold">{template.name}</h3>
            </div>

            <div className="pl-5 py-2 space-y-4">
              {template.availabilities.map((availability) => (
                <ScheduleTemplateAvailabilityItem
                  key={availability.id}
                  availability={availability}
                  unavailableExceptions={unavailableExceptions}
                  date={date}
                />
              ))}
            </div>
          </div>
        ))}

        {unavailableExceptions.length > 0 && (
          <div className="space-y-3 mt-2">
            {unavailableExceptions.map((exception) => (
              <div key={exception.id} className="flex items-start">
                <div
                  className="mr-2 mt-1 w-3 h-8 rounded bg-yellow-200"
                  style={diagonalStripes}
                />
                <div>
                  <p className="text-sm text-black font-medium">
                    {t("exception")}: {exception.reason}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span>{formatTimeShort(exception.start_time)}</span>
                    <span className="px-2 text-gray-300">-</span>
                    <span>{formatTimeShort(exception.end_time)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </PopoverContent>
  );
}

function ScheduleTemplateAvailabilityItem({
  availability,
  unavailableExceptions,
  date,
}: {
  availability: ScheduleTemplate["availabilities"][0];
  unavailableExceptions: ScheduleException[];
  date: Date;
}) {
  const { t } = useTranslation();

  if (availability.slot_type !== "appointment") {
    return (
      <div key={availability.id}>
        <h4 className="font-medium text-base">{availability.name}</h4>
        <p className="text-sm text-gray-600">
          <span>
            {t(`SCHEDULE_AVAILABILITY_TYPE__${availability.slot_type}`)}
          </span>
          <span className="px-2 text-gray-300">|</span>
          <span className="text-sm">
            {/* TODO: handle multiple days of week */}
            {formatAvailabilityTime(availability.availability)}
          </span>
        </p>
      </div>
    );
  }

  const intendedSlots = getSlotsPerSession(
    availability.availability[0].start_time,
    availability.availability[0].end_time,
    availability.slot_size_in_minutes,
  );

  const computedSlots = computeAppointmentSlots(
    availability,
    unavailableExceptions,
    date,
  );

  const availableSlots = computedSlots.filter(
    (slot) => slot.isAvailable,
  ).length;

  const exceptions = [
    ...new Set(computedSlots.flatMap((slot) => slot.exceptions)),
  ];
  const hasExceptions = exceptions.length > 0;

  return (
    <div key={availability.id}>
      <h4 className="font-medium text-base">{availability.name}</h4>
      <p className="text-sm text-gray-600">
        <span>
          {t(`SCHEDULE_AVAILABILITY_TYPE__${availability.slot_type}`)}
        </span>
        <span className="px-2 text-gray-300">|</span>
        <span className="text-sm">
          {formatAvailabilityTime(availability.availability)}
        </span>
      </p>
      {availability.slot_type === "appointment" && (
        <p className="text-sm text-gray-600">
          {availableSlots === intendedSlots ? (
            t("session_slots_info", {
              slots: availableSlots,
              minutes: availability.slot_size_in_minutes,
            })
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer underline">
                  <Trans
                    i18nKey="session_slots_info_striked"
                    components={{
                      s: <s />,
                    }}
                    values={{
                      intended_slots: intendedSlots,
                      actual_slots: availableSlots,
                      minutes: availability.slot_size_in_minutes,
                    }}
                  />
                </span>
              </TooltipTrigger>
              {hasExceptions && (
                <TooltipContent className="max-w-xs" side="bottom">
                  <p className="font-medium mb-1">
                    {t("exceptions")}:{" "}
                    {humanizeStrings(exceptions.map((e) => e.reason))}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </p>
      )}
    </div>
  );
}

const diagonalStripes = {
  backgroundImage: `repeating-linear-gradient(
      -45deg,
      rgb(243 244 246), /* gray-100 */
      rgb(243 244 246) 4px,
      rgb(229 231 235) 4px, /* gray-200 */
      rgb(229 231 235) 8px
    )`,
};

// TODO: remove this in favour of supporting flexible day of week availability
export const formatAvailabilityTime = (
  availability: AvailabilityDateTime[],
) => {
  const startTime = availability[0].start_time;
  const endTime = availability[0].end_time;
  return `${formatTimeShort(startTime)} - ${formatTimeShort(endTime)}`;
};
