import { CaretSortIcon, DashboardIcon } from "@radix-ui/react-icons";
import { Globe } from "lucide-react";
import { navigate } from "raviger";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Organization } from "@/types/organization/organization";

interface Props {
  organizations: Organization[];
  selectedOrganization: Organization | undefined;
}

export function OrganizationSwitcher({
  organizations,
  selectedOrganization,
}: Props) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-white"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                <Globe className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedOrganization
                    ? "My Organizations"
                    : "Select Organization"}
                </span>
              </div>
              <CaretSortIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        <DropdownMenuItem onClick={() => navigate("/")}>
          <DashboardIcon className="size-4" />
          View Dashboard
        </DropdownMenuItem>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => {
              navigate(`/organization/${org.id}`);
              if (isMobile) {
                setOpenMobile(false);
              }
            }}
          >
            {org.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
