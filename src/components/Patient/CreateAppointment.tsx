import { useState } from "react";

import { cn } from "@/lib/utils";

import Calendar from "@/CAREUI/interactive/Calendar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import Page from "@/components/Common/Page";
import { ScheduleAPIs } from "@/components/Schedule/api";

import useQuery from "@/Utils/request/useQuery";
import { Time } from "@/Utils/types";

interface Props {
  facilityId: string;
  id: string;
}

interface TimeSlot {
  time: Time;
  isAvailable: boolean;
}

const morningSlots: TimeSlot[] = [
  { time: "09:00", isAvailable: true },
  { time: "09:30", isAvailable: false },
  { time: "10:00", isAvailable: true },
  { time: "10:30", isAvailable: true },
  { time: "11:00", isAvailable: true },
  { time: "11:30", isAvailable: true },
  { time: "12:00", isAvailable: true },
];

const afternoonSlots: TimeSlot[] = [
  { time: "01:00", isAvailable: false },
  { time: "01:30", isAvailable: true },
  { time: "02:00", isAvailable: true },
  { time: "02:30", isAvailable: true },
  { time: "03:00", isAvailable: true },
  { time: "03:30", isAvailable: true },
  { time: "04:00", isAvailable: true },
];

export default function CreateAppointment(props: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<Time>();

  // TODO: wire this, hardcoded for now just for testing.
  const _availableDoctorsQuery = useQuery(
    ScheduleAPIs.appointments.availableDoctors,
    {
      pathParams: {
        facility_id: props.facilityId,
      },
      query: {
        valid_from: "2024-12-01",
        valid_to: "2024-12-31",
      },
    },
  );

  // TODO: wire this, hardcoded for now just for testing.
  const _availableSlotsQuery = useQuery(
    ScheduleAPIs.appointments.availableSlots,
    {
      pathParams: {
        facility_id: props.facilityId,
      },
      query: {
        doctor_username: "doctordev",
        valid_from: "2024-12-01",
        valid_to: "2024-12-31",
      },
    },
  );

  const renderDay = (date: Date) => {
    const isSelected = date.toDateString() === selectedDate?.toDateString();

    return (
      <button
        onClick={() => setSelectedDate(date)}
        className={cn(
          "h-full w-full hover:bg-gray-50 rounded-lg",
          isSelected ? "bg-white ring-2 ring-primary-500" : "bg-gray-100",
        )}
      >
        <span>{date.getDate()}</span>
      </button>
    );
  };

  return (
    <Page title="Doctor Consultation">
      <hr className="mt-6 mb-8" />
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-lg font-bold mb-2">Doctor Consultation</h1>
          <p className="text-gray-600 max-w-xl">
            Provide the patient's personal details, including name, date of
            birth, gender, and contact information for accurate identification
            and communication.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2">Reason for visit</label>
            <Textarea placeholder="Type the reason for visit" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Preferred doctor</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                  <SelectItem value="dr-wilson">Dr. Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Calendar
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                renderDay={renderDay}
                className="mb-6"
                highlightToday={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Available Time Slots</h3>
                <div className="flex items-center gap-2">
                  <Checkbox id="priority" />
                  <label htmlFor="priority">Show Priority Slots</label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3">Morning Slots</h4>
                  <div className="flex flex-wrap gap-2">
                    {morningSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          selectedTime === slot.time ? "primary" : "outline"
                        }
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.isAvailable}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Afternoon Slots</h4>
                  <div className="flex flex-wrap gap-2">
                    {afternoonSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          selectedTime === slot.time ? "default" : "outline"
                        }
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.isAvailable}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">Schedule Appointment</Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
