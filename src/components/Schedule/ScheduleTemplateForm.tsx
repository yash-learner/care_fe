import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";
import WeekdayCheckbox from "@/CAREUI/interactive/WeekdayCheckbox";

import { Button } from "@/components/ui/button";

import DateFormField from "@/components/Form/FormFields/DateFormField";
import { FieldLabel } from "@/components/Form/FormFields/FormField";
import { SelectFormField } from "@/components/Form/FormFields/SelectFormField";
import TextFormField from "@/components/Form/FormFields/TextFormField";

export default function ScheduleTemplateForm() {
  return (
    <div>
      <TextFormField
        name="name"
        label="Template Name"
        required
        placeholder="Regular OP Day"
        onChange={() => {}}
      />
      <div className="grid grid-cols-2 gap-4">
        <DateFormField
          name="valid_from"
          label="Valid From"
          required
          onChange={() => {}}
        />
        <DateFormField
          name="valid_to"
          label="Valid Till"
          required
          onChange={() => {}}
        />
      </div>
      <div>
        <FieldLabel className="text-lg font-semibold" noPadding>
          Weekly Schedule
        </FieldLabel>
        <span className="text-sm">
          Select the weekdays for applying the{" "}
          <strong className="font-medium">Regular OP Day</strong> template to
          schedule appointments
        </span>
        <div className="py-2">
          <WeekdayCheckbox value={[3, 7]} onChange={() => {}} />
        </div>

        <ul className="space-y-4 pb-2 pt-12">
          <li>
            <ScheduleAvailabilityForm />
          </li>
          <li>
            <ScheduleAvailabilityForm />
          </li>
          <li>
            <ScheduleAvailabilityForm />
          </li>
        </ul>

        <div className="pt-2">
          <Button variant="outline_primary">
            <CareIcon icon="l-plus" className="text-lg" />
            <span>Add another Session</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const ScheduleAvailabilityForm = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between pb-4">
        <div className="space-x-2">
          <CareIcon icon="l-clock" className="text-lg text-blue-600" />
          <span className="font-semibold">Morning Consultations</span>
        </div>
        <Button variant="secondary" size="sm">
          <CareIcon icon="l-minus-circle" className="text-base" />
          <span className="ml-2">Remove</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextFormField
          name="name"
          label="Session Title"
          placeholder="Morning Consultations"
          required
          onChange={() => {}}
        />
        <SelectFormField
          name="appointment_type"
          label="Appointment Type"
          required
          options={[
            "EMERGENCY",
            "OP_SCHEDULE",
            "IP_SCHEDULE",
            "OPERATION_THEATRE",
            "FOLLOW_UP_VISIT",
            "SPECIALIST_REFERRAL",
          ]}
          optionLabel={(option) => t(`SCHEDULE_APPOINTMENT_TYPE__${option}`)}
          optionValue={(o) => o}
          onChange={() => {}}
        />
        <DateFormField
          name="start_time"
          label="Start Time"
          required
          onChange={() => {}}
        />
        <DateFormField
          name="end_time"
          label="End Time"
          required
          onChange={() => {}}
        />
      </div>
      <div className="flex gap-4">
        <TextFormField
          name="tokens_allowed"
          label="Tokens Allowed"
          type="number"
          min={0}
          placeholder="10"
          required
          onChange={() => {}}
        />
        <div className="mt-8 flex h-min gap-2 rounded-md bg-purple-50 px-2 py-1.5 text-sm/tight text-purple-500">
          <div className="h-min rounded-full border border-purple-300 bg-white px-2 py-0.5">
            <span className="font-medium">Info</span>
          </div>
          <span className="font-medium">
            Allocating 10 tokens in this schedule provides approximately 6
            minutes for each patient
          </span>
        </div>
      </div>
    </div>
  );
};
