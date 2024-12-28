import { usePathParams } from "raviger";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FacilitySwitcher } from "@/components/ui/sidebar/facility-switcher";
import { NavMain } from "@/components/ui/sidebar/nav-main";
import { NavUser } from "@/components/ui/sidebar/nav-user";

import { UserFacilityModel } from "@/components/Users/models";

import useAuthUser from "@/hooks/useAuthUser";

const facilityLinks = (selectedFacility: UserFacilityModel | null, t: any) => {
  if (!selectedFacility) {
    return [];
  } else {
    const baseUrl = `/facility/${selectedFacility.id}`;
    return [
      { name: t("facility"), url: `${baseUrl}`, icon: "d-hospital" },
      {
        name: t("appointments"),
        url: `${baseUrl}/appointments`,
        icon: "d-calendar",
      },
      { name: t("patients"), url: `${baseUrl}/patients`, icon: "d-patient" },
      { name: t("assets"), url: `${baseUrl}/assets`, icon: "d-folder" },
      { name: t("shifting"), url: "/shifting", icon: "d-ambulance" },
      { name: t("resource"), url: "/resource", icon: "d-book-open" },
      { name: t("users"), url: "/users", icon: "d-people" },
      { name: t("organisation"), url: "/organisation", icon: "d-people" },
    ];
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const exactMatch = usePathParams("/facility/:facilityId");
  const subpathMatch = usePathParams("/facility/:facilityId/*");
  const facilityId = exactMatch?.facilityId || subpathMatch?.facilityId;

  const user = useAuthUser();
  const [selectedFacility, setSelectedFacility] =
    useState<UserFacilityModel | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (facilityId && user.facilities) {
      const facility = user.facilities.find((f) => f.id === facilityId);
      if (facility) {
        setSelectedFacility(facility);
      }
    }
  }, [facilityId, user.facilities]);

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader>
        {user.facilities && user.facilities.length > 0 && (
          <FacilitySwitcher
            facilities={user.facilities}
            selectedFacility={selectedFacility}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={facilityLinks(selectedFacility, t)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
