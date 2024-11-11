import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import Callout from "@/CAREUI/display/Callout";
import CareIcon from "@/CAREUI/icons/CareIcon";
import WeekdayCheckbox from "@/CAREUI/interactive/WeekdayCheckbox";
import { DayOfWeekValue } from "@/CAREUI/interactive/WeekdayCheckbox";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  valid_from: z.date({
    required_error: "Valid from date is required",
  }),
  valid_to: z.date({
    required_error: "Valid to date is required",
  }),
  weekdays: z.array(z.number() as unknown as z.ZodType<DayOfWeekValue>),
  sessions: z.array(
    z.object({
      name: z.string().min(1, "Session name is required"),
      appointment_type: z.string().min(1, "Appointment type is required"),
      start_time: z.string().min(1, "Start time is required"),
      end_time: z.string().min(1, "End time is required"),
      tokens_allowed: z.number().min(1, "Tokens must be greater than 0"),
    }),
  ),
});

export default function ScheduleTemplateForm() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      valid_from: undefined,
      valid_to: undefined,
      weekdays: [],
      sessions: [
        {
          name: "",
          appointment_type: "",
          start_time: "",
          end_time: "",
          tokens_allowed: 0,
        },
      ],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="Regular OP Day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valid_from"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid From</FormLabel>
                <DatePicker
                  date={field.value}
                  onChange={(date) => field.onChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_to"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid Till</FormLabel>
                <DatePicker
                  date={field.value}
                  onChange={(date) => field.onChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel className="text-lg font-semibold">
            Weekly Schedule
          </FormLabel>
          <span className="block text-sm">
            Select the weekdays for applying the{" "}
            <strong className="font-medium">Regular OP Day</strong> template to
            schedule appointments
          </span>
          <div className="py-2">
            <FormField
              control={form.control}
              name="weekdays"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <WeekdayCheckbox
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          {form.watch("sessions")?.map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between pb-6">
                <div className="flex items-center gap-2">
                  <CareIcon icon="l-clock" className="text-lg text-blue-600" />
                  <span className="font-semibold">
                    {form.watch(`sessions.${index}.name`) || "Untitled Session"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    const sessions = form.getValues("sessions");
                    sessions.splice(index, 1);
                    form.setValue("sessions", sessions);
                  }}
                >
                  <CareIcon icon="l-trash" className="text-base" />
                  <span className="ml-2">Remove</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name={`sessions.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Title</FormLabel>
                      <FormControl>
                        <Input placeholder="IP Rounds" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sessions.${index}.appointment_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "EMERGENCY",
                            "OP_SCHEDULE",
                            "IP_SCHEDULE",
                            "OPERATION_THEATRE",
                            "FOLLOW_UP_VISIT",
                            "SPECIALIST_REFERRAL",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {t(`SCHEDULE_APPOINTMENT_TYPE__${type}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sessions.${index}.start_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sessions.${index}.end_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex items-start gap-4">
                <FormField
                  control={form.control}
                  name={`sessions.${index}.tokens_allowed`}
                  render={({ field }) => (
                    <FormItem className="w-[180px]">
                      <FormLabel>Tokens Allowed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Callout variant="alert" badge="Info" className="mt-3">
                  Allocating 10 tokens in this schedule provides approximately 6
                  minutes for each patient
                </Callout>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline_primary"
          onClick={() => {
            const sessions = form.getValues("sessions");
            form.setValue("sessions", [
              ...sessions,
              {
                name: "",
                appointment_type: "",
                start_time: "",
                end_time: "",
                tokens_allowed: 0,
              },
            ]);
          }}
        >
          <CareIcon icon="l-plus" className="text-lg" />
          <span>Add another Session</span>
        </Button>
      </form>
    </Form>
  );
}
