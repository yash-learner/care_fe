import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

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
              <input
                className="relative float-left size-[1.125rem] appearance-none rounded-sm border-[0.125rem] border-solid border-[rgba(0,0,0,0.25)] bg-white outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:absolute checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-1 checked:after:block checked:after:h-[0.8125rem] checked:after:w-1.5 checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-3.5 focus:after:w-3.5 focus:after:rounded-sm focus:after:bg-white focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-1 checked:focus:after:h-[0.8125rem] checked:focus:after:w-1.5 checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
                type="checkbox"
                id={`day_of_week_checkbox_${day}`}
                checked={isChecked}
                onChange={(e) => handleChange(e.target.checked)}
              />
              <label
                htmlFor={`day_of_week_checkbox_${day}`}
                className="text-xs font-semibold uppercase"
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
