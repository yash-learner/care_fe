import { format, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import Calendar from "@/CAREUI/interactive/Calendar";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Avatar } from "@/components/Common/Avatar";
import Page from "@/components/Common/Page";
import { ScheduleAPIs } from "@/components/Schedule/api";
import { TokenSlot } from "@/components/Schedule/types";

import useMutation from "@/Utils/request/useMutation";
import useQuery from "@/Utils/request/useQuery";
import {
  dateQueryString,
  formatDisplayName,
  getMonthStartAndEnd,
} from "@/Utils/utils";

interface Props {
  facilityId: string;
  patientId: string;
}

export default function AppointmentCreatePage(props: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [reason, setReason] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TokenSlot>();

  const { start, end } = getMonthStartAndEnd(selectedMonth);

  const availableDoctorsQuery = useQuery(
    ScheduleAPIs.appointments.availableDoctors,
    {
      pathParams: {
        facility_id: props.facilityId,
      },
      query: {
        valid_from: dateQueryString(start),
        valid_to: dateQueryString(end),
      },
    },
  );

  const slotsQuery = useQuery(ScheduleAPIs.appointments.slots, {
    pathParams: {
      facility_id: props.facilityId,
    },
    query: {
      doctor_username: selectedDoctor,
      valid_from: dateQueryString(start),
      valid_to: dateQueryString(end),
    },
    prefetch: !!selectedDoctor,
  });

  const createAppointmentMutation = useMutation(
    ScheduleAPIs.appointments.create,
    {
      pathParams: { facility_id: props.facilityId },
      onResponse: ({ res }) => {
        if (res?.ok) {
          toast.success("Appointment created successfully");
        }
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

  const slotsOfDate = filterSlotsByDate(slotsQuery.data ?? [], selectedDate);

  const handleSubmit = () => {
    if (!selectedDoctor) {
      toast.error("Please select a preferred doctor");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a slot");
      return;
    }

    createAppointmentMutation.mutate({
      body: {
        patient: props.patientId,
        doctor_username: selectedDoctor,
        slot_start: selectedSlot.start_datetime,
        reason_for_visit: reason,
      },
    });
  };

  return (
    <Page title="Doctor Consultation">
      <hr className="mt-6 mb-8" />
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-lg font-bold mb-2">Doctor Consultation</h1>
        </div>

        <div className="space-y-8">
          <div>
            <Label className="mb-2">Reason for visit</Label>
            <Textarea
              placeholder="Type the reason for visit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2">Preferred doctor</label>
              <Select
                disabled={availableDoctorsQuery.loading}
                value={selectedDoctor}
                onValueChange={(value) => setSelectedDoctor(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctorsQuery.data?.results.map((doctor) => (
                    <SelectItem key={doctor.username} value={doctor.username}>
                      <div className="flex items-center gap-2">
                        <Avatar
                          imageUrl={doctor.read_profile_picture_url}
                          name={formatDisplayName(doctor)}
                          className="size-6 rounded-full"
                        />
                        <span>{formatDisplayName(doctor)}</span>
                      </div>
                    </SelectItem>
                  ))}
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
              </div>

              <div className="space-y-6">
                {slotsQuery.data ? (
                  <div>
                    <h4 className="mb-3">(Session Name)</h4>
                    <div className="flex flex-wrap gap-2">
                      {slotsOfDate.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={
                            selectedSlot?.id === slot.id
                              ? "outline_primary"
                              : "outline"
                          }
                          onClick={() => {
                            if (selectedSlot?.id === slot.id) {
                              setSelectedSlot(undefined);
                            } else {
                              setSelectedSlot(slot);
                            }
                          }}
                          disabled={!slot.tokens_remaining}
                        >
                          {format(slot.start_datetime, "HH:mm")}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-32 border-2 border-gray-200 border-dashed rounded-lg text-center">
                    <p className="text-gray-400">
                      To view available slots, select a preferred doctor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pointer-events-none">
            <div>
              <Label className="mb-2">Preferred date</Label>
              <DatePicker
                date={
                  selectedSlot?.start_datetime
                    ? new Date(selectedSlot.start_datetime)
                    : undefined
                }
              />
            </div>
            <div>
              <Label className="mb-2">Selected Time Slot</Label>
              <Input
                type="time"
                value={
                  selectedSlot
                    ? format(selectedSlot.start_datetime, "HH:mm")
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!selectedSlot}
              onClick={handleSubmit}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

const filterSlotsByDate = (slots: TokenSlot[], date: Date) => {
  return slots.filter((slot) => {
    const slotDate = parseISO(slot.start_datetime);
    return isSameDay(slotDate, date);
  });
};
