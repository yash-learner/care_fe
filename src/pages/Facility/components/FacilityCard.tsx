import { navigate } from "raviger";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { FacilityModel } from "@/components/Facility/models";

interface Props {
  facility: FacilityModel;
}

export function FacilityCard({ facility }: Props) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{facility.name}</h3>
          <p className="text-sm text-gray-500">
            {[
              facility.address,
              facility.local_body_object?.name,
              facility.district_object?.name,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/facility/${facility.id}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
