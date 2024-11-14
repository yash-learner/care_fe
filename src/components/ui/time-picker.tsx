import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "./button";
import { Input } from "./input";

interface TimePickerProps {
  value?: string; // in 24hr format HH:mm
  onChange?: (value: string) => void;
  className?: string;
}

type TimeState = {
  hours: string;
  minutes: string;
  period: "AM" | "PM";
};

export function TimePicker({
  value = "",
  onChange,
  className,
}: TimePickerProps) {
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState<TimeState>(() => {
    if (!value) return { hours: "", minutes: "", period: "AM" };

    try {
      const [hours, minutes] = value.split(":");
      const hour = parseInt(hours);
      return {
        hours: (hour % 12 || 12).toString(),
        minutes: minutes,
        period: hour >= 12 ? "PM" : "AM",
      };
    } catch {
      return { hours: "", minutes: "", period: "AM" };
    }
  });

  // Update internal state when value prop changes
  useEffect(() => {
    if (!value) {
      setTime({ hours: "", minutes: "", period: "AM" });
      return;
    }

    try {
      const [hours, minutes] = value.split(":");
      const hour = parseInt(hours);
      setTime({
        hours: (hour % 12 || 12).toString(),
        minutes: minutes,
        period: hour >= 12 ? "PM" : "AM",
      });
    } catch {
      setTime({ hours: "", minutes: "", period: "AM" });
    }
  }, [value]);

  const handleTimeChange = (newTime: Partial<TimeState>) => {
    const updatedTime = { ...time, ...newTime };
    setTime(updatedTime);

    if (onChange && updatedTime.hours && updatedTime.minutes) {
      let hours = parseInt(updatedTime.hours);

      // Convert to 24-hour format
      if (updatedTime.period === "PM" && hours !== 12) hours += 12;
      if (updatedTime.period === "AM" && hours === 12) hours = 0;

      const timeString = `${hours.toString().padStart(2, "0")}:${updatedTime.minutes.padStart(2, "0")}`;
      onChange(timeString);
    }
  };

  const handleHoursChange = (value: string) => {
    if (value === "") {
      handleTimeChange({ hours: "" });
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue >= 0 && numValue <= 12) {
        handleTimeChange({ hours: value });

        if ((numValue > 1 && value.length === 1) || value.length === 2) {
          minuteInputRef.current?.focus();
        }
      }
    }
  };

  const handleMinutesChange = (value: string) => {
    if (value === "") {
      handleTimeChange({ minutes: "" });
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue >= 0 && numValue <= 59) {
        handleTimeChange({ minutes: value });
      }
    }
  };

  const handleHoursBlur = () => {
    if (time.hours) {
      handleTimeChange({ hours: time.hours.padStart(2, "0") });
    }
  };

  const handleMinutesBlur = () => {
    if (time.minutes) {
      handleTimeChange({ minutes: time.minutes.padStart(2, "0") });
    }
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const current = parseInt(time.hours) || 0;
      const newHour =
        e.key === "ArrowUp" ? (current % 12) + 1 : ((current + 10) % 12) + 1;
      handleTimeChange({ hours: newHour.toString() });
    }
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const current = parseInt(time.minutes) || 0;
      const newMinutes =
        e.key === "ArrowUp" ? (current + 1) % 60 : (current + 59) % 60;
      handleTimeChange({ minutes: newMinutes.toString() });
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="relative flex min-w-[120px] rounded-md border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-950">
        <Input
          value={time.hours}
          onChange={(e) => handleHoursChange(e.target.value)}
          onBlur={handleHoursBlur}
          onKeyDown={handleHoursKeyDown}
          className="w-[42px] border-0 text-center shadow-none focus-visible:ring-0"
          placeholder="12"
          maxLength={2}
        />
        <span className="flex items-center px-0.5 text-gray-400">:</span>
        <Input
          ref={minuteInputRef}
          value={time.minutes}
          onChange={(e) => handleMinutesChange(e.target.value)}
          onBlur={handleMinutesBlur}
          onKeyDown={handleMinutesKeyDown}
          className="w-[42px] border-0 text-center shadow-none focus-visible:ring-0"
          placeholder="00"
          maxLength={2}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        className="h-9 gap-1 rounded-md bg-gray-50 px-2 text-sm hover:bg-gray-100"
        onClick={() =>
          handleTimeChange({
            period: time.period === "AM" ? "PM" : "AM",
          })
        }
      >
        <span className="font-medium">{time.period}</span>
        <CareIcon icon="l-sync" className="h-4 w-4" />
      </Button>
    </div>
  );
}
