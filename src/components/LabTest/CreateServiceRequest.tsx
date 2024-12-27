import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import * as Notification from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";

import { ConsultationModel } from "../Facility/models";
import { Button } from "../ui/button";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import LabOrderCodeSelect from "./LabOrderCodeSelect";
import { Annotation, Coding, ServiceRequest } from "./types";

type CreateServiceRequestProps = {
  encounter: ConsultationModel;
};

export default function CreateServiceRequest({
  encounter,
}: CreateServiceRequestProps) {
  const { t } = useTranslation();

  const [code, setCode] = useState<Coding>();
  const [note, setNote] = useState<Annotation[]>([]);
  const [priority, setPriority] = useState<ServiceRequest["priority"]>();
  const [recurrence, setRecurrence] = useState<unknown>();

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNote: Annotation[] = [
      {
        text: e.target.value,
        authorString: "CurrentUser", // Replace with actual user
        time: new Date().toISOString(),
      },
    ];
    setNote(updatedNote);
  };

  const queryClient = useQueryClient();

  const { mutate: createServiceRequest, isPending } = useMutation({
    mutationFn: (body: {
      code: Coding;
      subject: string;
      encounter: string;
      priority: ServiceRequest["priority"];
      note: Annotation[];
    }) =>
      request(routes.labs.serviceRequest.create, {
        body,
      }),
    onSuccess: () => {
      Notification.Success({ msg: "Test ordered successfully" });

      setCode(undefined);
      setNote([{ text: "", authorString: "", time: "" }]);
      setPriority(undefined);

      queryClient.invalidateQueries({
        queryKey: [
          routes.labs.serviceRequest.list.path,
          { encounter: encounter.id },
        ],
      });
    },
    onError: () => {
      Notification.Error({ msg: "Failed to order test" });
    },
  });

  const handleOrderTest = () => {
    if (!code) {
      return;
    }

    createServiceRequest({
      code,
      subject: encounter.patient,
      encounter: encounter.id,
      priority,
      note,
    });
  };

  return (
    <Card className="bg-inherit shadow-none rounded-md">
      <CardHeader className="grid gap-3">
        <LabOrderCodeSelect value={code} onSelect={setCode} />

        {note !== undefined && (
          <div className="grid gap-1.5">
            <Label htmlFor="note">Note</Label>
            <Textarea
              placeholder="Type your note here."
              id="note"
              className="bg-white"
              value={note[0]?.text || ""}
              onChange={handleNoteChange}
            />
          </div>
        )}

        {priority !== undefined && (
          <div className="grid gap-1.5">
            <Label htmlFor="priority">Priority</Label>

            <RadioGroup
              defaultValue={priority}
              className="flex items-center gap-3"
              onValueChange={(value) =>
                setPriority(value as ServiceRequest["priority"])
              }
            >
              {["routine", "urgent", "asap", "stat"].map((value) => (
                <div className="flex items-center space-x-1.5" key={value}>
                  <RadioGroupItem
                    value={value}
                    id={value}
                    className="bg-white"
                  />
                  <Label htmlFor={value}>{t(value)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </CardHeader>
      <CardFooter>
        <div className="flex items-center gap-2 w-full">
          {note === undefined && (
            <Button
              onClick={() => setNote([])}
              variant="ghost"
              className="flex items-center gap-1.5"
            >
              <CareIcon icon="l-plus" className="size-4" />
              Add Note
            </Button>
          )}
          {priority === undefined && (
            <Button
              onClick={() => setPriority("routine")}
              variant="ghost"
              className="flex items-center gap-1.5"
            >
              <CareIcon icon="l-signal-alt-3" className="size-4" />
              Set Priority
            </Button>
          )}
          {recurrence === undefined && (
            <Button
              onClick={() => setRecurrence({})}
              variant="ghost"
              className="flex items-center gap-1.5"
              disabled
            >
              <CareIcon icon="l-repeat" className="size-4" />
              Set Recurrence
            </Button>
          )}

          <div className="flex-1 flex items-center gap-2 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button
              variant="primary"
              onClick={handleOrderTest}
              disabled={isPending}
            >
              Order test
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
