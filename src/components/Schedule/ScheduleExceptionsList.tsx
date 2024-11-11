import Callout from "@/CAREUI/display/Callout";
import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";
import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ScheduleExceptionForm from "@/components/Schedule/ScheduleExceptionForm";

export default function ScheduleExceptionsList() {
  return (
    <div>
      <div className="flex items-end justify-between">
        <h4 className="text-lg font-semibold">Schedule Exceptions</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary">Add Exception</Button>
          </SheetTrigger>
          <SheetContent className="flex min-w-full flex-col bg-gray-100 sm:min-w-[45rem]">
            <SheetHeader>
              <SheetTitle>Add Schedule Exceptions</SheetTitle>
              <SheetDescription>
                Configure absences or add availability beyond the regular
                schedule.
              </SheetDescription>
            </SheetHeader>

            <div className="-mx-6 mb-16 overflow-auto px-6 pb-16">
              <div className="rounded-md bg-white p-4 shadow">
                <ScheduleExceptionForm />
                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button variant="primary">Confirm Unavailability</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <ul className="flex flex-col gap-4 py-6">
        <li>
          <ScheduleExceptionItem />
        </li>
        <li>
          <ScheduleExceptionItem />
        </li>
      </ul>
    </div>
  );
}

const ScheduleExceptionItem = () => {
  return (
    <div className="rounded-lg bg-white py-2 shadow">
      <div className="flex items-center justify-between py-2 pr-4">
        <div className="flex">
          <ColoredIndicator className="my-1 mr-2.5 h-5 w-1.5 rounded-r" />
          <div className="flex flex-col">
            <span className="space-x-1 text-lg font-semibold">
              <span className="text-gray-500">Leave on</span>
              <span className="text-gray-700">21 Nov 2024 Thursday</span>
            </span>
            <span className="text-sm text-gray-500">On vacation</span>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <CareIcon icon="l-minus-circle" className="text-base" />
          <span className="ml-2">Remove</span>
        </Button>
      </div>
      <div className="px-4 py-2">
        <Callout className="mt-2" variant="warning" badge="Warning">
          3 booked appointments were cancelled when you marked this leave. These
          may need to be rescheduled.
        </Callout>
      </div>
    </div>
  );
};
