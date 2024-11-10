import { Link } from "raviger";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import Calendar from "@/CAREUI/interactive/Calendar";

import Page from "@/components/Common/Page";
import ScheduleExceptionsList from "@/components/Schedule/ScheduleExceptionsList";
import ScheduleTemplatesList from "@/components/Schedule/ScheduleTemplatesList";

interface Props {
  view: "schedule" | "exceptions";
}

export default function SchedulingHomePage(props: Props) {
  const { t } = useTranslation();

  return (
    <Page title={t("schedule_calendar")}>
      <nav className="mt-6 flex gap-2 border-b border-gray-200">
        {(["schedule", "exceptions"] as const).map((view) => (
          <Link
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
        <Calendar className="md:order-last" />

        {props.view === "schedule" && <ScheduleTemplatesList />}
        {props.view === "exceptions" && <ScheduleExceptionsList />}
      </div>
    </Page>
  );
}
