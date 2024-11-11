import { useState } from "react";
import { useTranslation } from "react-i18next";

import Callout from "@/CAREUI/display/Callout";

import CheckBoxFormField from "@/components/Form/FormFields/CheckBoxFormField";
import DateFormField from "@/components/Form/FormFields/DateFormField";
import RadioFormField from "@/components/Form/FormFields/RadioFormField";
import { SelectFormField } from "@/components/Form/FormFields/SelectFormField";
import TextAreaFormField from "@/components/Form/FormFields/TextAreaFormField";
import TextFormField from "@/components/Form/FormFields/TextFormField";
import { FieldChangeEvent } from "@/components/Form/FormFields/Utils";

const EXCEPTION_TYPES = ["UNAVAILABLE", "MODIFY_SCHEDULE"] as const;

export default function ScheduleExceptionForm() {
  const { t } = useTranslation();

  const [state, setState] = useState<{
    exception_type: (typeof EXCEPTION_TYPES)[number];
    appointment_type?: string;
    from_date?: Date;
    to_date?: Date;
    start_time?: Date;
    end_time?: Date;
    reason?: string;
    unavailable_all_day?: boolean;
  }>({ exception_type: "UNAVAILABLE" });

  const handleChange = ({ name, value }: FieldChangeEvent<unknown>) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  return (
    <div>
      <RadioFormField
        name="exception_type"
        label="Exception Type"
        required
        options={["UNAVAILABLE", "MODIFY_SCHEDULE"]}
        optionLabel={(o) => t(`SCHEDULE_EXCEPTION_TYPE__${o}`)}
        optionValue={(o) => o}
        value={state.exception_type}
        onChange={handleChange}
      />

      {state.exception_type === "MODIFY_SCHEDULE" && (
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
          value={state.appointment_type}
          onChange={handleChange}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <DateFormField
          name="from_date"
          label={
            state.exception_type === "UNAVAILABLE"
              ? "Unavailable From"
              : "Valid From"
          }
          required
          value={state.from_date}
          onChange={handleChange}
        />
        <DateFormField
          name="to"
          label={
            state.exception_type === "UNAVAILABLE"
              ? "Unavailable Until"
              : "Valid Till"
          }
          required
          value={state.to_date}
          onChange={handleChange}
        />
      </div>

      {state.exception_type === "UNAVAILABLE" && (
        <CheckBoxFormField
          name="unavailable_all_day"
          label="All Day Unavailable"
          value={state.unavailable_all_day}
          onChange={handleChange}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <DateFormField
          name="start_time"
          disabled={state.unavailable_all_day}
          label={
            state.exception_type === "UNAVAILABLE"
              ? "From (Unavailable Time)"
              : "Start Time"
          }
          required
          value={state.start_time}
          onChange={handleChange}
        />
        <DateFormField
          name="end_time"
          disabled={state.unavailable_all_day}
          label={
            state.exception_type === "UNAVAILABLE"
              ? "To (Unavailable Time)"
              : "End Time"
          }
          required
          value={state.end_time}
          onChange={handleChange}
        />
      </div>

      {state.exception_type === "UNAVAILABLE" && (
        <TextAreaFormField
          name="reason"
          label="Reason (Optional)"
          placeholder="Type your reason here"
          required
          value={state.reason}
          onChange={handleChange}
        />
      )}

      {state.exception_type === "MODIFY_SCHEDULE" && (
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
          <Callout className="mt-8" variant="alert" badge="Info">
            Allocating 10 tokens in this schedule provides approximately 6
            minutes for each patient
          </Callout>
        </div>
      )}

      {state.exception_type === "MODIFY_SCHEDULE" && (
        <Callout variant="warning" badge="Warning" className="mt-2">
          You have 7 unbooked and 3 booked OP appointments for this day. Saving
          this configuration will overwrite all existing appointments.
        </Callout>
      )}
    </div>
  );
}
