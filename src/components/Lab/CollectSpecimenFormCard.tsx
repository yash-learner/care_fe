import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarcodeIcon,
  MinusIcon,
  PlusIcon,
  TestTubeIcon,
  XCircleIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import { displayCode, formatDateTime } from "@/Utils/utils";
import { Specimen } from "@/types/emr/specimen";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { BarcodeInput } from "./BarcodeInput";
import { displaySpecimenId } from "./utils";

type CollectSpecimenFormCardProps = {
  specimen: Specimen;
  onBarcodeSuccess: (specimenId: string) => void;
};

const formSchema = z.object({
  quantity: z.number().int().positive(),
  identifier: z.string().optional(),
});

export const CollectSpecimenFormCard: React.FC<
  CollectSpecimenFormCardProps
> = ({ specimen, onBarcodeSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      identifier: undefined,
    },
  });

  const { mutate: collectSpecimen } = useMutation({
    mutationFn: mutate(routes.labs.specimen.collect, {
      pathParams: { id: specimen.id },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["specimen"],
      });
      onBarcodeSuccess(specimen.id);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    collectSpecimen({
      identifier: values.identifier,
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex-col justify-between items-center pb-4 mb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="grid gap-2">
                  <Label>Specimen:</Label>
                  <div className="flex items-center gap-2 p-2 bg-secondary-50 rounded-md shadow-sm border w-full">
                    <span>
                      <TestTubeIcon className="h-4 w-4 rotate-6" />
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {displayCode(specimen.type)}
                    </span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Samples:</FormLabel>
                      <FormControl>
                        <div className="flex justify-between items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border p-4"
                              onClick={() => {
                                form.setValue("quantity", field.value - 1);
                              }}
                            >
                              <MinusIcon className="font-medium text-lg" />
                            </Button>
                            <Input {...field} className="w-20 text-center" />
                            <Button
                              variant="outline"
                              size="sm"
                              className="border p-4"
                              onClick={() => {
                                form.setValue("quantity", field.value + 1);
                              }}
                            >
                              <PlusIcon className="font-medium text-lg" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg">
                  <div
                    className={cn(
                      "items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white relative before:content-[''] before:absolute before:top-2.5 before:left-0 before:h-6 before:w-1 mx-1 before:rounded-r-sm",
                      specimen.collected_at
                        ? "before:bg-primary-600"
                        : "before:bg-secondary-600",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-600">
                        {displaySpecimenId(specimen)}
                      </h3>
                      <span
                        className={cn(
                          "ml-2 px-2 py-1 text-xs font-medium rounded",
                          specimen.collected_at
                            ? "bg-primary-100 text-primary-900"
                            : "bg-danger-100 text-danger-900",
                        )}
                      >
                        {specimen.collected_at ? "Collected" : "Not Collected"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 px-4 py-3 bg-gray-50 space-y-4">
                    {specimen.collected_at ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-green-50 border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
                              Success
                            </span>
                            <span className="text-green-900 font-semibold">
                              Barcode scanned successfully
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <BarcodeIcon className="h-6 w-6" />
                              <span className="text-gray-700 font-semibold">
                                {displaySpecimenId(specimen)}
                              </span>
                            </div>

                            <Button
                              className="flex items-center justify-between gap-2 bg-white px-2 py-2 rounded-md shadow-sm"
                              variant="outline"
                              type="button"
                              onClick={() => {
                                form.setValue("identifier", undefined);
                                form.handleSubmit(onSubmit)();
                              }}
                            >
                              <XCircleIcon className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="items-center justify-between ">
                            <h3 className="text-sm font-normal">Tube Type</h3>
                            <span className="text-gray-900 font-semibold">
                              Not Available
                            </span>
                          </div>
                          <div className="items-center justify-between">
                            <h3 className="text-sm font-normal">Test</h3>
                            <span className="text-gray-900 font-semibold">
                              {displayCode(specimen.request?.code)}
                            </span>
                          </div>
                          <div className="items-center justify-between">
                            <h3 className="text-sm font-normal">
                              Collection Date/Time
                            </h3>
                            <span className="text-gray-900 font-semibold">
                              {formatDateTime(specimen.collected_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Barcode:</FormLabel>
                            <FormControl>
                              <BarcodeInput
                                {...field}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
