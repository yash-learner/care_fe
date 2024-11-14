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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ScheduleSlotTypes } from "@/components/Schedule/schemas";

import { Time } from "@/Utils/types";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  valid_from: z.date({
    required_error: "Valid from date is required",
  }),
  valid_to: z.date({
    required_error: "Valid to date is required",
  }),
  weekdays: z.array(z.number() as unknown as z.ZodType<DayOfWeekValue>),
  availability: z.array(
    z.object({
      name: z.string().min(1, "Session name is required"),
      slot_type: z.enum(ScheduleSlotTypes),
      start_time: z
        .string()
        .min(1, "Start time is required") as unknown as z.ZodType<Time>,
      end_time: z
        .string()
        .min(1, "End time is required") as unknown as z.ZodType<Time>,
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
      availability: [
        {
          name: "",
          slot_type: undefined,
          start_time: undefined,
          end_time: undefined,
          tokens_allowed: 0,
        },
      ],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({
      doctor_username: "",
      valid_from: values.valid_from.toISOString(),
      valid_to: values.valid_to.toISOString(),
      name: values.name,
      availability: values.availability.map((availability) => ({
        ...availability,
        id: "",
        slot_size_in_minutes: 0,
        tokens_per_slot: 0,
        days_of_week: values.weekdays,
      })),
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="primary">Create Template</Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-full flex-col bg-gray-100 sm:min-w-[45rem]">
        <SheetHeader>
          <SheetTitle>Create Schedule Template</SheetTitle>
        </SheetHeader>

        <div className="-mx-6 mb-16 overflow-auto px-6 pb-16 pt-6">
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
                  <strong className="font-medium">Regular OP Day</strong>{" "}
                  template to schedule appointments
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
                {form.watch("availability")?.map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg bg-white p-4 shadow"
                  >
                    <div className="flex items-center justify-between pb-6">
                      <div className="flex items-center gap-2">
                        <CareIcon
                          icon="l-clock"
                          className="text-lg text-blue-600"
                        />
                        <span className="font-semibold">
                          {form.watch(`availability.${index}.name`) ||
                            "Untitled Session"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          const availability = form.getValues("availability");
                          availability.splice(index, 1);
                          form.setValue("availability", availability);
                        }}
                      >
                        <CareIcon icon="l-trash" className="text-base" />
                        <span className="ml-2">Remove</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name={`availability.${index}.name`}
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
                        name={`availability.${index}.slot_type`}
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
                                {ScheduleSlotTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {t(`SCHEDULE_SLOT_TYPE__${type}`)}
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
                        name={`availability.${index}.start_time`}
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
                        name={`availability.${index}.end_time`}
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
                        name={`availability.${index}.tokens_allowed`}
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
                        Allocating 10 tokens in this schedule provides
                        approximately 6 minutes for each patient
                      </Callout>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline_primary"
                onClick={() => {
                  const availability = form.getValues("availability");
                  form.setValue("availability", [
                    ...availability,
                    {
                      name: "",
                      slot_type: "OP_SCHEDULE",
                      start_time: "00:00",
                      end_time: "00:00",
                      tokens_allowed: 0,
                    },
                  ]);
                }}
              >
                <CareIcon icon="l-plus" className="text-lg" />
                <span>Add another Session</span>
              </Button>

              <SheetFooter className="absolute inset-x-0 bottom-0 border-t bg-white p-6">
                <SheetClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </SheetClose>

                <Button variant="primary" type="submit">
                  Save & Generate Slots
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
