import { ScanBarcodeIcon } from "lucide-react";
import { ComponentProps, forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";

type BarcodeInputProps = ComponentProps<"input"> & {
  onScan?: (value: string) => void;
};

export const BarcodeInput = forwardRef<HTMLInputElement, BarcodeInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          placeholder="Scan or Enter the barcode"
          className={cn("w-full", className)}
          ref={ref}
          {...props}
        />
        <ScanBarcodeIcon className="absolute right-2 top-1.5 size-6 text-gray-500" />
      </div>
    );
  },
);

BarcodeInput.displayName = "BarcodeInput";
