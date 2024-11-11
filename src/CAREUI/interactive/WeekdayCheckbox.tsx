import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
} as const;

export type DayOfWeekValue = (typeof DAYS_OF_WEEK)[keyof typeof DAYS_OF_WEEK];

interface Props {
  value?: DayOfWeekValue[];
  onChange: (value: DayOfWeekValue[]) => void;
}

export default function WeekdayCheckbox(props: Props) {
  const { t } = useTranslation();
  const checkedDays = new Set(props.value ?? []);

  return (
    <ul className="flex justify-between">
      {Object.values(DAYS_OF_WEEK).map((day) => {
        const isChecked = checkedDays.has(day);

        const handleChange = (checked: boolean) => {
          const result = new Set(checkedDays);
          result[checked ? "add" : "delete"](day);
          props.onChange([...result]);
        };

        return (
          <li key={day}>
            <div
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-8 py-6 transition-all duration-200 ease-in-out",
                isChecked
                  ? "border-primary-500 bg-white shadow"
                  : "border-gray-300",
              )}
              onClick={() => handleChange(!isChecked)}
            >
              <Checkbox
                id={`day_of_week_checkbox_${day}`}
                checked={isChecked}
                onCheckedChange={handleChange}
                className="border-gray-500 data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500"
              />
              <label
                htmlFor={`day_of_week_checkbox_${day}`}
                className="cursor-pointer text-xs font-semibold uppercase"
              >
                {t(`DAYS_OF_WEEK_SHORT__${day}`)}
              </label>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
