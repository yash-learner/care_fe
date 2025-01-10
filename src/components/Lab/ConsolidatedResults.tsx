import React, { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ResultTable } from "@/components/Common/ResultTable";

interface ConsolidatedResultsProps {
  orderId: string;
  columns: Array<{
    key: string;
    label: string;
  }>;
  resultsData: Array<any>;
}

export const ConsolidatedResults: React.FC<ConsolidatedResultsProps> = ({
  orderId,
  columns,
  resultsData,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-blue-300 bg-blue-50 rounded-md px-4 py-3 mb-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Consolidated Test Results
          </h3>
          <p className="text-sm text-gray-600">{orderId}</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-[1.5px] border-gray-400"
          >
            <span className="underline text-gray-900 font-semibold text-sm">
              Send to patient
            </span>
            <CareIcon icon="l-envelope-alt" className="size-4 text-gray-700" />
          </Button>

          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-[1.5px] border-gray-400"
            >
              <span className="text-gray-900 font-semibold text-sm">View</span>
              <CareIcon icon="l-eye" className="size-4 text-gray-700" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="w-ful p-4 bg-gray-500 my-4"></div>
        <div className="relative p-6 bg-gray-50 rounded-lg shadow-md h-[600px]">
          <div className="flex items-center gap-2 mb-6">
            <div w-15 h-10>
              <img
                src="https://raw.githubusercontent.com/ohcnetwork/branding/refs/heads/main/Care/SVG/Logo/Care-Logo_gradient_mark_with_dark_wordmark.svg"
                alt="carelabs logo"
                className="w-15 h-10"
              />
            </div>
          </div>

          <div className="h-full w-full justify-center items-center">
            <div className="pt-4">
              <ResultTable columns={columns} data={resultsData} />
            </div>
            <div className="absolute inset-x-0 top-10 flex justify-center items-center pointer-events-none">
              <img
                src="/images/care_logo_mark.svg"
                alt="Logo"
                className="w-1/2 h-1/2 opacity-5"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
