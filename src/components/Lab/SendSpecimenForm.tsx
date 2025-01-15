import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import { Specimen } from "@/types/emr/specimen";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { BarcodeInput } from "./BarcodeInput";

type SendSpecimenFormProps = {
  onSuccess: (specimen: Specimen) => void;
};

const formSchema = z.object({
  barcode: z.string(),
  lab: z.string().uuid(),
});

export const SendSpecimenForm: React.FC<SendSpecimenFormProps> = ({
  onSuccess,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
      lab: "",
    },
  });

  const { watch } = form;
  const searchQuery = watch("barcode");

  const {
    data: specimen,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-specimen", searchQuery],
    queryFn: query.debounced(routes.labs.specimen.get, {
      pathParams: { id: searchQuery || "" },
    }),
    enabled: !!searchQuery,
  });

  if (error) {
    toast.error("Specimen not found");
  }

  const { data: labs } = useQuery({
    queryKey: ["labs"],
    queryFn: query(routes.facilityOrganization.list, {
      pathParams: { facilityId: specimen?.request.encounter.facility.id ?? "" },
    }),
    enabled: !!specimen,
  });

  const { mutate: sendSpecimen } = useMutation({
    mutationFn: mutate(routes.labs.specimen.sendToLab, {
      pathParams: { id: form.watch("barcode") },
    }),
    onSuccess: (data: Specimen) => {
      form.reset();
      toast.success("Specimen is ready for dispatch");
      onSuccess(data);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendSpecimen({
      lab: values.lab,
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex-col justify-between items-center pb-4 mb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode:</FormLabel>
                    <FormControl>
                      <BarcodeInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label className="text-sm font-normal text-gray-900">
                  Select Lab
                </Label>
                <FormField
                  control={form.control}
                  name="lab"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            isLoading || !!error || form.watch("barcode") === ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoading && !error
                                  ? "Loading labs..."
                                  : "Select a Lab"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Labs</SelectLabel>
                              {labs?.results.map((lab) => (
                                <SelectItem key={lab.id} value={lab.id}>
                                  {lab.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                variant={"primary"}
                size={"lg"}
                className="self-end"
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
