import { RefObject } from "react";

import { cn } from "@/lib/utils";

import PageTitle, { PageTitleProps } from "@/components/Common/PageTitle";

interface PageProps extends PageTitleProps {
  children: React.ReactNode | React.ReactNode[];
  options?: React.ReactNode | React.ReactNode[];
  changePageMetadata?: boolean;
  className?: string;
  noImplicitPadding?: boolean;
  ref?: RefObject<HTMLDivElement>;
  /**
   * If true, the sidebar will be collapsed when mounted, and restored to original state when unmounted.
   * @default false
   **/
  collapseSidebar?: boolean;
  hideTitleOnPage?: boolean;
}

export default function Page(props: PageProps) {
  // const sidebar = useContext(SidebarShrinkContext);

  // useEffect(() => {
  //   if (!props.collapseSidebar) return;

  //   sidebar.setShrinked(true);
  //   return () => {
  //     sidebar.setShrinked(sidebar.shrinked);
  //   };
  // }, [props.collapseSidebar]);

  let padding = "";
  if (!props.noImplicitPadding) {
    if (!props.hideBack || props.componentRight) padding = "py-0 md:px-6";
    else padding = "px-6 py-0";
  }

  return (
    <div className={cn(padding, props.className)} ref={props.ref}>
      <div className="flex flex-col justify-between gap-2 px-3 md:flex-row md:items-center md:gap-6 md:px-0">
        <PageTitle
          changePageMetadata={props.changePageMetadata}
          title={props.title}
          breadcrumbs={props.breadcrumbs}
          backUrl={props.backUrl}
          hideBack={props.hideBack}
          componentRight={props.componentRight}
          crumbsReplacements={props.crumbsReplacements}
          focusOnLoad={props.focusOnLoad}
          onBackClick={props.onBackClick}
          isInsidePage={true}
          hideTitleOnPage={props.hideTitleOnPage}
        />
        {props.options}
      </div>
      {props.children}
    </div>
  );
}
