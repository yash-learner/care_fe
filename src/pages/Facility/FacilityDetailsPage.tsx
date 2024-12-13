import { useQuery } from "@tanstack/react-query";
import { navigate } from "raviger";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { FacilityModel } from "@/components/Facility/models";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { RequestResult } from "@/Utils/request/types";

interface Props {
  id: string;
}

export function FacilityDetailsPage({ id }: Props) {
  const { data: facilityResponse, isLoading } = useQuery<
    RequestResult<FacilityModel>
  >({
    queryKey: ["facility", id],
    queryFn: () =>
      request(routes.getAnyFacility, {
        pathParams: { id },
      }),
  });

  const facility = facilityResponse?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <CareIcon icon="l-spinner" className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Facility Not Found</h2>
          <Button onClick={() => navigate("/facilities")}>
            Back to Facilities
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{facility.name}</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/facilities")}>
            Back to List
          </Button>
        </div>

        <div className="space-y-4">
          {/* Add more facility details here */}
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-gray-600">
              {[
                facility.address,
                facility.local_body_object?.name,
                facility.district_object?.name,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
