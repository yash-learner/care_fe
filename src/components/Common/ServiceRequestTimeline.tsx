import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";

export interface ProgressBarSubStep {
  label: string;
  status?:
    | "completed"
    | "active"
    | "pending"
    | "collected"
    | "received"
    | "dispatched"
    | "processed"
    | "reviewed"
    | "notStarted";
}

export interface ProgressBarStep {
  label: string;
  status?:
    | "completed"
    | "active"
    | "pending"
    | "collected"
    | "received"
    | "dispatched"
    | "processed"
    | "reviewed"
    | "notStarted";
  subSteps?: ProgressBarSubStep[];
}

interface ServiceRequestTimelineProps {
  steps: ProgressBarStep[];
}

export const ServiceRequestTimeline: React.FC<ServiceRequestTimelineProps> = ({
  steps,
}) => {
  return (
    <div className="w-full lg:max-w-xs bg-gray-100 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
      <ul className="relative">
        {steps.map((step, index) => {
          let stepIcon: React.ReactNode;
          let stepLabelColor = "text-gray-600";

          switch (step.status) {
            case "completed":
              stepIcon = (
                <CheckIcon className="relative z-10 h-4 w-4 rounded-full bg-green-600 text-white" />
              );
              stepLabelColor = "text-green-600";
              break;

            case "active":
              stepIcon = (
                <img
                  src="/images/half_circle.svg"
                  alt="Pending clock icon"
                  className="w-4 h-4 z-10 relative"
                />
              );
              stepLabelColor = "text-blue-600";
              break;

            case "pending":
              stepIcon = (
                <img
                  src="/images/clock_history.svg"
                  alt="Pending clock icon"
                  className="w-4 h-4 z-10 relative"
                />
              );
              stepLabelColor = "text-blue-600";
              break;

            case "notStarted":
              stepIcon = (
                <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300" />
              );
              stepLabelColor = "text-gray-400";
              break;
          }

          return (
            <li
              key={index}
              className="flex gap-2 before:content-[''] before:block before:h-20"
            >
              {/*
                  Only render the vertical line if it's NOT the last item.
                  That means we conditionally add the after classes.
               */}
              <div
                className={`relative ${
                  !(index === steps.length - 1)
                    ? "after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300"
                    : ""
                }`}
              >
                {stepIcon}
              </div>

              <div className="flex flex-col gap-2 pb-4">
                <span className={stepLabelColor}>{step.label}</span>

                {/* Optional sub-steps, if any */}
                {!!step.subSteps?.length && (
                  <div className="flex flex-col">
                    {step.subSteps.map((sub, subIdx) => {
                      return (
                        <div key={subIdx} className="flex gap-1">
                          <span className="text-sm text-gray-500">
                            {sub.label}
                          </span>
                          {sub.status && (
                            <span className="text-sm capitalize text-gray-500">
                              : {sub.status}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
