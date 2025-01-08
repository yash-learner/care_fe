import { DashboardIcon } from "@radix-ui/react-icons";
import { Link, usePathParams } from "raviger";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FacilityNav } from "@/components/ui/sidebar/facility-nav";
import { FacilitySwitcher } from "@/components/ui/sidebar/facility-switcher";
import {
  FacilityNavUser,
  PatientNavUser,
} from "@/components/ui/sidebar/nav-user";
import { OrgNav } from "@/components/ui/sidebar/org-nav";
import { OrganizationSwitcher } from "@/components/ui/sidebar/organization-switcher";
import { PatientNav } from "@/components/ui/sidebar/patient-nav";

import { UserFacilityModel, UserModel } from "@/components/Users/models";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserModel;
  facilitySidebar?: boolean;
  sidebarFor?: SidebarFor;
}

export enum SidebarFor {
  FACILITY = "facility",
  PATIENT = "patient",
}

export function AppSidebar({
  user,
  sidebarFor = SidebarFor.FACILITY,
  ...props
}: AppSidebarProps) {
  const exactMatch = usePathParams("/facility/:facilityId");
  const subpathMatch = usePathParams("/facility/:facilityId/*");
  const facilityId = exactMatch?.facilityId || subpathMatch?.facilityId;

  const orgMatch = usePathParams("/organization/:id");
  const orgSubpathMatch = usePathParams("/organization/:id/*");
  const organizationId = orgMatch?.id || orgSubpathMatch?.id;

  const facilitySidebar = sidebarFor === SidebarFor.FACILITY;
  const patientSidebar = sidebarFor === SidebarFor.PATIENT;

  const [selectedFacility, setSelectedFacility] =
    React.useState<UserFacilityModel | null>(null);

  const selectedOrganization = React.useMemo(() => {
    if (!user?.organizations || !organizationId) return undefined;
    return user.organizations.find((org) => org.id === organizationId);
  }, [user?.organizations, organizationId]);

  React.useEffect(() => {
    if (!user?.facilities || !facilityId || !facilitySidebar) return;

    const facility = user.facilities.find((f) => f.id === facilityId);
    if (facility) {
      setSelectedFacility(facility);
    }
  }, [facilityId, user?.facilities, facilitySidebar]);

  const hasFacilities = user?.facilities && user.facilities.length > 0;
  const hasOrganizations = user?.organizations && user.organizations.length > 0;

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      {...props}
      className="group-data-[side=left]:border-r-0"
    >
      <SidebarHeader>
        {selectedOrganization && hasOrganizations && (
          <OrganizationSwitcher
            organizations={user?.organizations || []}
            selectedOrganization={selectedOrganization}
          />
        )}
        {selectedFacility && hasFacilities && (
          <FacilitySwitcher
            facilities={user?.facilities || []}
            selectedFacility={selectedFacility}
          />
        )}
        {!selectedFacility && !selectedOrganization && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-white mt-2"
              >
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                    <DashboardIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight text-gray-900">
                    <span className="truncate font-semibold">
                      View Dashboard
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>

      <SidebarContent>
        {facilitySidebar && !selectedOrganization && (
          <FacilityNav selectedFacility={selectedFacility} user={user} />
        )}
        {selectedOrganization && (
          <OrgNav organizations={user?.organizations || []} />
        )}
        {patientSidebar && <PatientNav />}
      </SidebarContent>

      <SidebarFooter>
        {(facilitySidebar || selectedOrganization) && <FacilityNavUser />}
        {patientSidebar && <PatientNavUser />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
