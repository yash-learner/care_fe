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

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import { Specimen } from "@/types/emr/specimen";

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
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
