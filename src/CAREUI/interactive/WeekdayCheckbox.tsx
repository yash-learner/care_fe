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
  const selected = new Set(props.value ?? []);
  return (
    <ul className="flex justify-between gap-2">
      {Object.values(DAYS_OF_WEEK).map((dayOfWeek) => (
        <li key={dayOfWeek}>
          <Checkbox
            name={`day_of_week_${dayOfWeek}`}
            checked={selected.has(dayOfWeek)}
            onCheckedChange={(checked) => {
              selected[checked ? "add" : "delete"](dayOfWeek);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
