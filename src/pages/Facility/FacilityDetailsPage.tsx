import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";

import { Avatar } from "@/components/Common/Avatar";
import { LoginHeader } from "@/components/Common/LoginHeader";
import { FacilityModel } from "@/components/Facility/models";
import { UserAssignedModel } from "@/components/Users/models";

import useAppHistory from "@/hooks/useAppHistory";
import useFilters from "@/hooks/useFilters";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { PaginatedResponse } from "@/Utils/request/types";

import { FeatureBadge } from "./Utils";
import { UserCard } from "./components/UserCard";

interface Props {
  id: string;
}

export function FacilityDetailsPage({ id }: Props) {
  const { t } = useTranslation();
  const { goBack } = useAppHistory();
  const { data: facilityResponse, isLoading } = useQuery<FacilityModel>({
    queryKey: ["facility", id],
    queryFn: query(routes.getAnyFacility, {
      pathParams: { id },
    }),
  });

  const { Pagination } = useFilters({
    limit: 18,
  });

  const { data: docResponse, error: docError } = useQuery<
    PaginatedResponse<UserAssignedModel>
  >({
    queryKey: [routes.getScheduleAbleFacilityUsers, id],
    queryFn: query(routes.getScheduleAbleFacilityUsers, {
      pathParams: { facility_id: id },
      silent: true,
    }),
  });

  if (docError) {
    toast.error(t("error_fetching_users_data"));
  }

  const users = docResponse?.results ?? [];

  const facility = facilityResponse;

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
          <h2 className="text-xl font-semibold mb-4">
            {t("facility_not_found")}
          </h2>
          <Button
            variant="outline"
            className="border border-secondary-400"
            onClick={() => goBack("/facilities")}
          >
            {t("back_to_facilities")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center pb-4">
        <Button
          variant="outline"
          className="border border-secondary-400"
          onClick={() => goBack("/facilities")}
        >
          <CareIcon icon="l-arrow-left" className="h-4 w-4 mr-1" />
          <span className="text-sm underline">{t("back")}</span>
        </Button>
        <LoginHeader />
      </div>
      <Card className="overflow-hidden bg-white">
        <div className="flex flex-col sm:flex-row  m-6">
          <div className="h-64 w-64 shrink-0 overflow-hidden rounded-lg">
            <Avatar
              imageUrl={facility.read_cover_image_url}
              name={facility.name || ""}
            />
          </div>

          <div className="px-4 space-y-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{facility.name}</h1>
              <p className="text-lg text-muted-foreground">
                {[facility.address].filter(Boolean).join(", ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {facility.features?.map((featureId) => (
                <FeatureBadge key={featureId} featureId={featureId as number} />
              ))}
            </div>

            {facility.description && (
              <div className="mt-4">
                <Markdown content={facility.description} />
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="mt-6">
        {users.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5 lg:grid-cols-2">
              {users?.map((user) => (
                <UserCard key={user.username} user={user} facilityId={id} />
              ))}
            </div>
            <Pagination totalCount={users.length ?? 0} />
          </>
        )}
        {users.length === 0 && (
          <div className="h-full space-y-2 rounded-lg bg-white p-7 shadow">
            <div className="flex w-full items-center justify-center text-xl font-bold text-secondary-500">
              No users Found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
