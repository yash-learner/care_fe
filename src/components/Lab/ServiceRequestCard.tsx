import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

import { displayCode, displayUserName, formatDateTime } from "@/Utils/utils";
import { ServiceRequest } from "@/types/emr/serviceRequest";

import { Card, CardContent } from "../ui/card";
import { displayPriority, getPriorityColor } from "./utils";

export const ServiceRequestCard: React.FC<{
  serviceRequest: ServiceRequest;
}> = ({ serviceRequest }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 px-4">
            <h3 className="text-sm font-semibold text-gray-500">Test</h3>
            <p className="font-semibold">{displayCode(serviceRequest.code)}</p>
          </div>

          <div className="w-full md:w-1/2 md:border-l border-gray-300 grid gap-4 px-4 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Order Placed by
              </h3>
              <p className="font-semibold">
                {displayUserName(serviceRequest.requester)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Order Date/Time
              </h3>
              <p className="font-semibold">
                {formatDateTime(serviceRequest.authored_on)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">Priority</h3>
              <Badge
                className={cn(
                  "capitalize text-sm font-semibold",
                  getPriorityColor(serviceRequest.priority),
                )}
                variant="outline"
              >
                {displayPriority(serviceRequest.priority)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 px-2 pt-4">
          <h3 className="text-sm font-semibold text-gray-500">Note:</h3>
          <p>{serviceRequest.note ?? "No notes were recorded."}</p>
        </div>
      </CardContent>
    </Card>
  );
};
