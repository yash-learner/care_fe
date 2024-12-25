import { useQuery } from "@tanstack/react-query";
import { Link, usePath } from "raviger";

import CareIcon, { IconName } from "@/CAREUI/icons/CareIcon";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import Page from "@/components/Common/Page";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { Organization } from "@/types/organisation/organisation";

interface Props {
  id: string;
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  title: string;
  icon: IconName;
}

export default function OrganisationLayout({ id, children }: Props) {
  const path = usePath() || "";

  const navItems: NavItem[] = [
    {
      path: `/organisation/${id}`,
      title: "Sub Organizations",
      icon: "d-hospital",
    },
    {
      path: `/organisation/${id}/users`,
      title: "Users",
      icon: "d-people",
    },
  ];

  const { data: org } = useQuery<Organization>({
    queryKey: ["organisation", id],
    queryFn: query(routes.organisation.get, {
      pathParams: { id },
    }),
  });

  const breadcrumbReplacements = {
    [id]: {
      name: org?.name,
      uri: `/organisation/${id}`,
    },
  };

  return (
    <Page title={org?.name || ""} crumbsReplacements={breadcrumbReplacements}>
      {/* Organization Details Card */}

      <dl className="grid grid-cols-4 gap-4">
        <div className="flex gap-2">
          <dt className="text-sm font-medium text-gray-500">
            Organisation Type:
          </dt>
          <dd className="text-sm text-gray-900">{org?.org_type}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-sm font-medium text-gray-500">Level:</dt>
          <dd className="text-sm text-gray-900">{org?.level_cache}</dd>
        </div>
      </dl>

      {/* Navigation */}
      <div className="mt-4">
        <Menubar>
          {navItems.map((item) => (
            <MenubarMenu key={item.path}>
              <MenubarTrigger
                className={`${
                  path === item.path
                    ? "font-medium text-primary-700 bg-gray-100"
                    : "hover:text-primary-500 hover:bg-gray-100 text-gray-700"
                }`}
                asChild
              >
                <Link href={item.path} className="cursor-pointer">
                  <CareIcon icon={item.icon} className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
      {/* Page Content */}
      <div className="mt-4">{children}</div>
    </Page>
  );
}
