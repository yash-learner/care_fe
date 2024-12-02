import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";

interface AppointmentTokenProps {
  className?: string;
  name: string;
  age: number;
  gender: string;
  tokenNumber: number;
  doctorName: string;
  uhid: string;
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  appointmentTime: string;
  opDays: string;
  type: "GENERAL" | "PRIORITY";
}

export default function AppointmentToken(props: AppointmentTokenProps) {
  return (
    <Card className={cn("p-6 print:shadow-none", props.className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">
            {props.facilityName}
          </h3>
          <p className="text-base text-gray-600">
            {props.facilityAddress}, Ph: {props.facilityPhone}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="text-base font-medium text-gray-600">
              {props.type}
              <br />
              OP TOKEN
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <p className="text-base text-gray-600">Name:</p>
          <p className="text-xl font-medium">
            {props.name}
            <br />
            {props.age} Y, {props.gender}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base text-gray-600">Token No.</p>
          <p className="text-[5rem] font-bold leading-none">
            {props.tokenNumber}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <p className="text-base text-gray-600">Doctor/Dep.:</p>
          <p className="text-base font-medium">{props.doctorName}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-base text-gray-600">UHID:</p>
          <p className="text-base font-medium">{props.uhid}</p>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-base text-gray-600">OP Days [{props.opDays}]</p>
        <div className="mt-2 h-12">
          <div className="h-full w-full bg-black" />
        </div>
      </div>

      <div className="mt-2 text-base text-gray-600">
        {props.appointmentTime}
      </div>
    </Card>
  );
}
