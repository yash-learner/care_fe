import { Link, usePath } from "raviger";
import { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useAppHistory from "@/hooks/useAppHistory";

import { classNames } from "@/Utils/utils";

const MENU_TAGS: { [key: string]: string } = {
  facility: "Facilities",
  patients: "Patients",
  assets: "Assets",
  shifting: "Shiftings",
  resource: "Resources",
  users: "Users",
  notice_board: "Notice Board",
};

const capitalize = (string: string) =>
  string
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

interface BreadcrumbsProps {
  replacements?: {
    [key: string]: {
      name?: string;
      uri?: string;
      style?: string;
      hide?: boolean;
    };
  };
  className?: string;
  hideBack?: boolean;
  backUrl?: string;
  onBackClick?: () => boolean | void;
}

export default function Breadcrumbs({
  replacements = {},
  className = "",
  hideBack = false,
  backUrl,
  onBackClick,
}: BreadcrumbsProps) {
  const { goBack } = useAppHistory();
  const path = usePath();
  const [showFullPath, setShowFullPath] = useState(false);

  const crumbs = path
    ?.slice(1)
    .split("/")
    .filter((field) => replacements[field]?.hide !== true)
    .map((field, i) => ({
      name: replacements[field]?.name || MENU_TAGS[field] || capitalize(field),
      uri:
        replacements[field]?.uri ||
        path
          .split("/")
          .slice(0, i + 2)
          .join("/"),
      style: replacements[field]?.style || "",
    }));

  const renderCrumb = (crumb: any, index: number) => {
    const isLastItem = index === crumbs!.length - 1;
    return (
      <BreadcrumbItem
        key={crumb.name}
        className={classNames("text-sm font-normal", crumb.style)}
      >
        <div className="flex items-center">
          {!isLastItem ? (
            <Button
              asChild
              variant="link"
              className="p-1 font-normal text-gray-800 hover:text-gray-700"
            >
              <Link href={crumb.uri}>{crumb.name}</Link>
            </Button>
          ) : (
            <span className="text-gray-600">{crumb.name}</span>
          )}
        </div>
      </BreadcrumbItem>
    );
  };

  return (
    <Breadcrumb>
      <nav className={classNames("w-full", className)} aria-label="Breadcrumb">
        <BreadcrumbList>
          {!hideBack && (
            <BreadcrumbItem>
              <Button
                variant="link"
                type="button"
                className="rounded bg-gray-200/50 px-1 text-sm font-normal text-gray-800 transition hover:bg-gray-200/75 hover:no-underline"
                size="xs"
                onClick={() => {
                  if (onBackClick && onBackClick() === false) return;
                  goBack(backUrl);
                }}
              >
                <CareIcon icon="l-arrow-left" className="h-5 text-gray-700" />
                <span className="pr-2">Back</span>
              </Button>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>
            <Button
              asChild
              variant="link"
              className="p-1 font-normal text-gray-800 hover:text-gray-700"
            >
              <Link href="/">Home</Link>
            </Button>
          </BreadcrumbItem>
          {crumbs && crumbs.length > 1 && (
            <>
              {!showFullPath && (
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-light text-gray-500 hover:text-gray-700"
                        onClick={() => setShowFullPath(true)}
                      >
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {crumbs.slice(0, -1).map((crumb, index) => (
                        <DropdownMenuItem key={index}>
                          <Button
                            asChild
                            variant="link"
                            className="p-1 font-normal text-gray-800 underline underline-offset-2 hover:text-gray-700"
                          >
                            <Link href={crumb.uri}>{crumb.name}</Link>
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              )}
              {showFullPath && crumbs.slice(0, -1).map(renderCrumb)}
            </>
          )}
          {crumbs?.length &&
            renderCrumb(crumbs[crumbs.length - 1], crumbs.length - 1)}
        </BreadcrumbList>
      </nav>
    </Breadcrumb>
  );
}
