import { useQuery } from "@tanstack/react-query";
import { Link } from "raviger";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import Page from "@/components/Common/Page";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { FacilityOrganization } from "@/types/facilityOrganization/facilityOrganization";

import CreateFacilityOrganizationSheet from "./components/CreateFacilityOrganizationSheet";

export default function FacilityOrganizationIndex({
  facilityId,
}: {
  facilityId: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["facilityOrganization", "list", facilityId],
    queryFn: query(routes.facilityOrganization.list, {
      pathParams: { facilityId },
    }),
    enabled: !!facilityId,
  });

  if (isLoading) {
    return (
      <Page title="Organizations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="relative">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </Page>
    );
  }

  if (!data?.results?.length) {
    return (
      <Page title="Organizations">
        <div className="flex justify-end mb-4">
          <CreateFacilityOrganizationSheet facilityId={facilityId} />
        </div>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              No Organizations Found
            </CardTitle>
            <CardDescription className="text-center">
              You don't have access to any organizations yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <CareIcon icon="d-hospital" className="h-12 w-12 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground max-w-sm mb-4">
              Organizations help you manage facilities, users, and resources
              efficiently. Contact your administrator to get access.
            </p>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Facility Organizations" hideBack={true}>
      <div className="flex justify-end mb-4">
        <CreateFacilityOrganizationSheet facilityId={facilityId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {data.results.map((org: FacilityOrganization) => (
          <Card key={org.id} className="relative group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-2">
                  {org.name}
                </CardTitle>
                <CardDescription>{org.org_type}</CardDescription>
              </div>
            </CardHeader>

            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link
                  href={`/facility/${facilityId}/organization/${org.id}`}
                  className="flex items-center justify-center gap-2"
                >
                  View Details
                  <CareIcon icon="l-arrow-right" className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Page>
  );
}
