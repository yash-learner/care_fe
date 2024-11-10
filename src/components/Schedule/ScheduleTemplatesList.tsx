import ColoredIndicator from "@/CAREUI/display/ColoredIndicator";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ScheduleTemplateForm from "@/components/Schedule/ScheduleTemplateForm";

export default function ScheduleTemplatesList() {
  return (
    <div>
      <div className="flex items-end justify-between">
        <h4 className="text-lg font-semibold">Schedule Templates</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary">Create Template</Button>
          </SheetTrigger>
          <SheetContent className="min-w-full bg-gray-100 sm:min-w-[45rem]">
            <SheetHeader>
              <SheetTitle>Create Schedule Template</SheetTitle>
            </SheetHeader>

            <div className="py-6">
              <ScheduleTemplateForm />
            </div>

            <SheetFooter className="absolute inset-x-0 bottom-0 border-t bg-white p-6">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>

              <SheetClose asChild>
                <Button variant="primary">Save & Generate Slots</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <ul className="flex flex-col gap-4 py-6">
        <li>
          <ScheduleTemplateItem />
        </li>
        <li>
          <ScheduleTemplateItem />
        </li>
      </ul>
    </div>
  );
}

const ScheduleTemplateItem = () => {
  return (
    <div className="rounded-lg bg-white py-2 shadow">
      <div className="flex items-center justify-between py-2 pr-4">
        <div className="flex">
          <ColoredIndicator
            className="my-1 mr-2.5 h-5 w-1.5 rounded-r"
            id="a6a72-8c43-4eea-88cd-79c9d0070fee"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Regular OP Day</span>
            <span className="text-sm text-gray-700">Scheduled for Monday</span>
          </div>
        </div>
        <div>menu</div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <ul className="flex flex-col gap-2">
          <li className="w-full">
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
          </li>
          <li className="w-full">
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
          </li>
        </ul>
        <span className="text-sm text-gray-500">
          Valid from <strong className="font-semibold">01 Nov 2024</strong> till{" "}
          <strong className="font-semibold">31 Jan 2025</strong>
        </span>
      </div>
    </div>
  );
};
