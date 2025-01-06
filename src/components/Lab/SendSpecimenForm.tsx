import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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

// Mock Labs Data
const labs = [
  { id: "b5d3c589-79ad-4c28-a070-bb795ca75ce4", name: "Central Lab" },
  { id: "e9be65c3-70e7-406c-909d-dffd84501460", name: "Northside Lab" },
  { id: "20f6958a-d0b4-4fdb-bd3c-1a3bedc728a8", name: "Southside Lab" },
  { id: "c0b60fd1-cb5e-4265-aab4-03b08f8c69f6", name: "Eastside Lab" },
  { id: "c713add3-e558-4fb6-a311-dd0c1c3558d5", name: "Westside Lab" },
];

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

  const { mutate: sendSpecimen } = useMutation({
    mutationFn: mutate(routes.labs.specimen.sendToLab, {
      pathParams: { id: form.watch("barcode") },
    }),
    onSuccess: (data: Specimen) => {
      form.reset();
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
                        >
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
