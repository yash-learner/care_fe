import { useQuery } from "@tanstack/react-query";
import { Link, usePath } from "raviger";

import CareIcon, { IconName } from "@/CAREUI/icons/CareIcon";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import Page from "@/components/Common/Page";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { Organization, getOrgLevel } from "@/types/organisation/organisation";

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
      title: "Organisations",
      icon: "d-hospital",
    },
    {
      path: `/organisation/${id}/users`,
      title: "Users",
      icon: "d-people",
    },
  ];

  const { data: org, isLoading } = useQuery<Organization>({
    queryKey: ["organisation", id],
    queryFn: query(routes.organisation.get, {
      pathParams: { id },
    }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // add loading state
  if (!org) {
    return <div>Not found</div>;
  }

  const breadcrumbReplacements = {
    [id]: {
      name: org.name,
      uri: `/organisation/${id}`,
    },
  };
  return (
    <Page
      title={`${org.name} ${getOrgLevel(org.org_type, org.level_cache)}`}
      crumbsReplacements={breadcrumbReplacements}
    >
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
