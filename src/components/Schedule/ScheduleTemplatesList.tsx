import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";
import CareIcon from "@/CAREUI/icons/CareIcon";

import ScheduleTemplateForm from "@/components/Schedule/ScheduleTemplateForm";
import { ScheduleTemplate } from "@/components/Schedule/schemas";

interface Props {
  items: ScheduleTemplate[];
}

export default function ScheduleTemplatesList(props: Props) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <h4 className="text-lg font-semibold">Schedule Templates</h4>
        <ScheduleTemplateForm />
      </div>
      <ul className="flex flex-col gap-4 py-6">
        {props.items.map((template) => (
          <li key={template.id}>
            <ScheduleTemplateItem {...template} />
          </li>
        ))}
      </ul>
      {props.items.length === 0 && (
        <div className="flex flex-col items-center text-center text-gray-500 py-10">
          <CareIcon icon="l-calendar-slash" className="size-10 mb-2" />
          <p>No schedule templates found</p>
          <p>Create a schedule template to get started</p>
        </div>
      )}
    </div>
  );
}

const ScheduleTemplateItem = (props: ScheduleTemplate) => {
  return (
    <div className="rounded-lg bg-white py-2 shadow">
      <div className="flex items-center justify-between py-2 pr-4">
        <div className="flex">
          <ColoredIndicator
            className="my-1 mr-2.5 h-5 w-1.5 rounded-r"
            id={props.id}
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{props.name}</span>
            <span className="text-sm text-gray-700">Scheduled for Monday</span>
          </div>
        </div>
        <div>menu</div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <ul className="flex flex-col gap-2">
          {props.availability.map((slot) => (
            <li className="w-full">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <span>{slot.name}</span>
                    <p className="text-gray-600">
                      <span className="text-sm">{slot.slot_type}</span>
                      <span className="px-2 text-gray-300">|</span>
                      <span className="text-sm">5 slots (20 mins.)</span>
                    </p>
                  </div>
                  <span className="text-sm">
                    {slot.start_time} - {slot.end_time}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {/* <li className="w-full">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <span>Morning Consultations</span>
                  <p className="text-gray-600">
                    <span className="text-sm">Outpatient Schedule</span>
                    <span className="px-2 text-gray-300">|</span>
                    <span className="text-sm">5 slots (20 mins.)</span>
                  </p>
                </div>
                <span className="text-sm">09:00 AM - 12:00 PM</span>
              </div>
            </div>
          </li> */}
        </ul>
        <span className="text-sm text-gray-500">
          Valid from <strong className="font-semibold">01 Nov 2024</strong> till{" "}
          <strong className="font-semibold">31 Jan 2025</strong>
        </span>
      </div>
    </div>
  );
};
