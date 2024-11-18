import { Link } from "raviger";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";
import Calendar from "@/CAREUI/interactive/Calendar";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Loading from "@/components/Common/Loading";
import Page from "@/components/Common/Page";
import ScheduleExceptionsList from "@/components/Schedule/ScheduleExceptionsList";
import ScheduleTemplatesList from "@/components/Schedule/ScheduleTemplatesList";
import { ScheduleAPIs } from "@/components/Schedule/api";

import useAuthUser from "@/hooks/useAuthUser";

import useQuery from "@/Utils/request/useQuery";

interface Props {
  view: "schedule" | "exceptions";
}

export default function SchedulingHomePage(props: Props) {
  const { t } = useTranslation();
  const authUser = useAuthUser();

  const templatesQuery = useQuery(ScheduleAPIs.listScheduleTemplates, {
    pathParams: {
      facility_id: authUser.home_facility_object!.id!,
    },
  });

  if (templatesQuery.loading) {
    return <Loading />;
  }

  return (
    <Page title={t("schedule_calendar")}>
      <nav className="mt-6 flex gap-2 border-b border-gray-200">
        {(["schedule", "exceptions"] as const).map((view) => (
          <Link
            key={view}
            className={cn(
              "relative px-3 py-2 font-medium",
              props.view === view ? "text-primary-600" : "text-gray-500",
            )}
            href={`/${view}`}
          >
            {t(view)}
            <span
              className={cn(
                props.view === view ? "opacity-100" : "opacity-0",
                "absolute inset-x-0 -bottom-[.1rem] h-[.2rem] bg-primary-600 transition-opacity duration-200 ease-in-out",
              )}
            />
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2">
        <Calendar
          className="md:order-last"
          renderDay={(date: Date) => {
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="grid h-full cursor-pointer grid-rows-[1fr_auto_1fr] rounded-lg transition-all bg-gray-100 hover:bg-white data-[state=open]:bg-white">
                    <div />
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={cn(
                          "text-base",
                          isToday ? "text-gray-900" : "text-gray-500",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: Math.random() * 2 + 1 }).map(
                          (_) => (
                            <ColoredIndicator
                              id={Math.random().toString()}
                              className="size-1.5 rounded-full"
                            />
                          ),
                        )}
                      </div>
                    </div>
                    <div />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[400px] p-6"
                  align="center"
                  side="bottom"
                  sideOffset={5}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Regular OP Day</h3>
                    <p className="text-sm text-gray-600">
                      {date.toLocaleDateString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Morning Consultations</h4>
                        <p className="text-sm text-gray-600">
                          Outpatient Schedule - 09:00 AM - 12:00 PM
                        </p>
                        <p className="text-sm text-gray-600">
                          5 slots (20 mins.)
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium">IP Rounds</h4>
                        <p className="text-sm text-gray-600">
                          Outpatient Schedule - 12:00 PM - 01:00 PM
                        </p>
                        <p className="text-sm text-gray-600">
                          6 slots (10 mins.)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                      >
                        Edit template
                      </Button>
                      <Button
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                      >
                        Add Exception
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }}
        />

        {props.view === "schedule" && (
          <ScheduleTemplatesList items={templatesQuery.data?.results ?? []} />
        )}
        {props.view === "exceptions" && <ScheduleExceptionsList />}
      </div>
    </Page>
  );
}
