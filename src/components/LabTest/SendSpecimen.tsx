import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";

import { Specimen } from "./types";

// Mock Labs Data
const labs = [
  { id: "7b56c471-4fa1-4c96-ab64-b5496432081d", name: "Central Lab" },
  { id: "e9be65c3-70e7-406c-909d-dffd84501460", name: "Northside Lab" },
  { id: "20f6958a-d0b4-4fdb-bd3c-1a3bedc728a8", name: "Southside Lab" },
  { id: "c0b60fd1-cb5e-4265-aab4-03b08f8c69f6", name: "Eastside Lab" },
  { id: "c713add3-e558-4fb6-a311-dd0c1c3558d5", name: "Westside Lab" },
];

export const SendSpecimen: React.FC = () => {
  const [specimens, setSpecimens] = React.useState<Specimen[]>([]);

  const [barcode, setBarcode] = React.useState("");
  const [lab, setLab] = React.useState<string>();

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-5">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight">Send Collected Specimen to Lab</h2>
      <div className="flex flex-col bg-white shadow-sm rounded-sm p-4 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-normal text-gray-900">Barcode</Label>
          <Input
            type="text"
            value={barcode}
            onChangeCapture={(e) => setBarcode(e.currentTarget.value)}
            placeholder="Scan Barcode/Enter number"
            className="text-center"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-normal text-gray-900">
            Select Lab
          </Label>
          <Select value={lab} onValueChange={setLab}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Lab" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Labs</SelectLabel>
                {labs.map((lab) => (
                  <SelectItem key={lab.id} value={lab.id}>
                    {lab.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={!barcode || !lab}
          onClick={async () => {
            const { res, data } = await request(
              routes.labs.specimen.sendToLab,
              {
                pathParams: {
                  id: barcode,
                },
                body: {
                  lab,
                },
              },
            );

            if (!res?.ok || !data) {
              return;
            }

            setBarcode("");
            setSpecimens((prev) => [...prev, data]);
          }}
          variant={"primary"}
          size={"lg"}
          className="self-end"
        >
          Save
        </Button>
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Ready for Dispatch
        </Label>

        <div className="flex flex-col gap-4 mt-6">
          {specimens.map((specimen) => (
            <Collapsible>
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
                <div
                  className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4`}
                >
                  <div className="flex items-center gap-4 justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Specimen id
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          SPEC009213
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-900 rounded">
                          Ready for Dispatch
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center gap-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <div className="">
                              {/* {openOrders[order.orderId] ? (
                              <ChevronUpIcon className="h-6 w-8" />
                            ) : ( */}
                              <ChevronDownIcon className="h-6 w-8" />
                              {/* )} */}
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <CollapsibleContent>
                    <div className="space-y-4">
                      <div className="max-w-5xl bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Left Section */}
                          <div className="w-full md:w-1/2 pl-2">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Test
                            </h3>
                            <p className="font-semibold">
                              {specimen.request.code.display ??
                                specimen.request.code.code}
                            </p>
                          </div>

                          {/* Right Section */}
                          <div className="w-full md:w-1/2 md:border-l border-gray-300 sm:pl-4 sm:pb-4">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Order Placed by
                            </h3>
                            <div className="flex gap-2">
                              <p className="text-lg font-semibold text-gray-900 mb-4">
                                {specimen.request.requester?.first_name}{" "}
                                {specimen.request.requester?.last_name}
                              </p>
                              <p className="text-lg font-normal text-gray-900 mb-4">
                                ({specimen.request.requester?.user_type})
                              </p>
                            </div>

                            <h3 className="text-sm font-semibold text-gray-600">
                              Order Date/Time
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 mb-4">
                              {specimen.request.authored_on}
                            </p>

                            <h3 className="text-sm font-semibold text-gray-600">
                              Priority
                            </h3>
                            <span className="px-3 py-1 inline-block text-sm font-semibold text-red-600 bg-red-100 rounded-lg">
                              {specimen.request.priority ?? "Routine"}
                            </span>
                          </div>
                        </div>
                        {/* Note Section */}
                        <div className="border-t border-gray-300 px-2 py-4 max-w-4xl">
                          <h3 className="text-sm font-semibold text-gray-600">
                            Note:
                          </h3>
                          <p className="text-gray-700">
                            {specimen.request.note
                              .map((note) => note.text)
                              .join("\n") || "No note provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
