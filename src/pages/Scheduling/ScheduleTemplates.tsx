import { format, parseISO } from "date-fns";
import { Edit3Icon } from "lucide-react";
import { useQueryParams } from "raviger";
import { Trans, useTranslation } from "react-i18next";

import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";
import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import Loading from "@/components/Common/Loading";
import { formatAvailabilityTime } from "@/components/Users/UserAvailabilityTab";

import EditScheduleTemplateSheet from "@/pages/Scheduling/components/EditScheduleTemplateSheet";
import {
  getDaysOfWeekFromAvailabilities,
  getSlotsPerSession,
} from "@/pages/Scheduling/utils";
import { ScheduleTemplate } from "@/types/scheduling/schedule";

interface Props {
  items?: ScheduleTemplate[];
  facilityId: string;
  userId: string;
}

export default function ScheduleTemplates({
  items,
  facilityId,
  userId,
}: Props) {
  const { t } = useTranslation();
  if (items == null) {
    return <Loading />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center text-center text-gray-500 py-64">
        <CareIcon icon="l-calendar-slash" className="size-10 mb-3" />
        <p>{t("no_schedule_templates_found")}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((template) => (
        <li key={template.id}>
          <ScheduleTemplateItem
            template={template}
            facilityId={facilityId}
            userId={userId}
          />
        </li>
      ))}
    </ul>
  );
}

const ScheduleTemplateItem = ({
  template,
  facilityId,
  userId,
}: {
  template: ScheduleTemplate;
  facilityId: string;
  userId: string;
}) => {
  const { t } = useTranslation();
  const [qParams, setQParams] = useQueryParams<{ edit: string | null }>();

  return (
    <div className="rounded-lg bg-white py-2 shadow">
      <div className="flex items-center justify-between py-2 pr-4">
        <div className="flex">
          <ColoredIndicator
            className="my-1 mr-2.5 h-5 w-1.5 rounded-r"
            id={template.id}
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{template.name}</span>
            <span className="text-sm text-gray-700">
              {t("schedule_for")}
              {": "}
              <strong className="font-medium">
                {getDaysOfWeekFromAvailabilities(template.availabilities)
                  .map((day) => t(`DAYS_OF_WEEK_SHORT__${day}`))
                  .join(", ")}
              </strong>
            </span>
          </div>
        </div>

        <div>
          <EditScheduleTemplateSheet
            template={template}
            facilityId={facilityId}
            userId={userId}
            open={qParams.edit === template.id}
            onOpenChange={(open) =>
              setQParams({ ...qParams, edit: open ? template.id : null })
            }
            trigger={
              <Button variant="ghost" size="icon">
                <Edit3Icon className="size-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <ul className="flex flex-col gap-2">
          {template.availabilities.map((slot) => (
            <li key={slot.id} className="w-full">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <span>{slot.name}</span>
                    <p className="text-gray-600">
                      <span className="text-sm">
                        {t(`SCHEDULE_AVAILABILITY_TYPE__${slot.slot_type}`)}
                      </span>
                      {slot.slot_type === "appointment" && (
                        <>
                          <span className="px-2 text-gray-300">|</span>
                          <span className="text-sm">
                            {Math.floor(
                              getSlotsPerSession(
                                slot.availability[0].start_time,
                                slot.availability[0].end_time,
                                slot.slot_size_in_minutes,
                              ) ?? 0,
                            )}{" "}
                            slots of {slot.slot_size_in_minutes} mins.
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="text-sm">
                    {formatAvailabilityTime(slot.availability)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <span className="text-sm text-gray-500">
          <Trans
            i18nKey="schedule_valid_from_till_range"
            values={{
              from_date: format(
                parseISO(template.valid_from),
                "EEE, dd MMM yyyy",
              ),
              to_date: format(parseISO(template.valid_to), "EEE, dd MMM yyyy"),
            }}
            components={{ strong: <strong className="font-semibold" /> }}
          />
        </span>
      </div>
    </div>
  );
};
