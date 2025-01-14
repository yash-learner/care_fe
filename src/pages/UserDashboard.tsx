import { ChevronRight, ClipboardList, LogOut, Settings } from "lucide-react";
import { Link } from "raviger";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar } from "@/components/Common/Avatar";

import useAuthUser, { useAuthContext } from "@/hooks/useAuthUser";

import { getOrgLabel } from "@/types/organization/organization";

export default function UserDashboard() {
  const user = useAuthUser();
  const { signOut } = useAuthContext();
  const facilities = user.facilities || [];
  const organizations = user.organizations || [];

  return (
    <div className="container mx-auto space-y-4 md:space-y-8 max-w-5xl px-4 py-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 bg-card p-4 md:p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar
            name={user.first_name}
            imageUrl={user.read_profile_picture_url}
            className="h-14 w-14 md:h-16 md:w-16"
          />
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            asChild
          >
            <Link
              href={`/users/${user.username}`}
              className="gap-2 text-inherit"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          {user.is_superuser && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/questionnaire" className="gap-2 text-inherit">
                <ClipboardList className="h-4 w-4" />
                Questionnaires
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Facilities Section */}
      {facilities.length > 0 && (
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-lg font-semibold px-1">Your Facilities</h2>
          <div
            className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            data-cy="facility-list"
          >
            {facilities.map((facility) => (
              <Link key={facility.id} href={`/facility/${facility.id}`}>
                <Card className="transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="flex items-center gap-3 p-3 md:p-4">
                    <Avatar
                      name={facility.name}
                      className="h-12 w-12 md:h-14 md:w-14"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-sm md:text-base">
                        {facility.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        View facility details
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Organizations Section */}
      {organizations.length > 0 && (
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-lg font-semibold px-1">Your Organizations</h2>
          <div
            className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            data-cy="organization-list"
          >
            {organizations.map((org) => (
              <Link key={org.id} href={`/organization/${org.id}`}>
                <Card className="transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="flex items-center gap-3 p-3 md:p-4">
                    <Avatar
                      name={org.name}
                      className="h-12 w-12 md:h-14 md:w-14"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-sm md:text-base">
                        {org.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {getOrgLabel(org.org_type, org.metadata)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
