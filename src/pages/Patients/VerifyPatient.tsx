import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Link, useQueryParams } from "raviger";
import { useEffect } from "react";
import { toast } from "sonner";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar } from "@/components/Common/Avatar";
import Page from "@/components/Common/Page";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import { formatPatientAge } from "@/Utils/utils";

export default function VerifyPatient(props: { facilityId: string }) {
  const [qParams] = useQueryParams();
  const { phone_number, year_of_birth, partial_id } = qParams;

  const { mutate: verifyPatient, data: patientData } = useMutation({
    mutationFn: mutate(routes.patient.search_retrieve),
    onError: (error) => {
      const errorData = error.cause as { errors: { msg: string[] } };
      errorData.errors.msg.forEach((er) => {
        toast.error(er);
      });
    },
  });

  // Verify patient when component mounts if all required params are present
  useEffect(() => {
    if (phone_number && year_of_birth && partial_id) {
      verifyPatient({
        phone_number,
        year_of_birth,
        partial_id,
      });
    }
  }, [phone_number, year_of_birth, partial_id, verifyPatient]);

  return (
    <Page title="Verify Patient" hideBack breadcrumbs={false}>
      {!phone_number || !year_of_birth || !partial_id ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Missing required parameters for patient verification
          </AlertDescription>
        </Alert>
      ) : patientData ? (
        <div>
          <Card className="m">
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 gap-y-2 md:flex-row">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex flex-row gap-x-4">
                    <div className="h-10 w-10 flex-shrink-0 md:h-14 md:w-14">
                      <Avatar
                        className="size-10 font-semibold text-secondary-800 md:size-auto"
                        name={patientData.name || "-"}
                      />
                    </div>
                    <div>
                      <h1
                        id="patient-name"
                        className="text-xl font-bold capitalize text-gray-950"
                      >
                        {patientData.name}
                      </h1>
                      <h3 className="text-sm font-medium text-gray-600">
                        {formatPatientAge(patientData, true)},{"  "}
                        <span className="capitalize">
                          {patientData.gender.replace("_", " ")},{"  "}
                        </span>
                        {patientData.blood_group &&
                          patientData.blood_group.replace("_", " ")}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            {/* <CardContent className="space-y-4"></CardContent> */}
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                asChild
                variant="secondary"
                className="h-14 w-full justify-start text-lg"
              >
                <Link
                  href={`/facility/${props.facilityId}/patient/${patientData.id}/book-appointment`}
                >
                  <CalendarIcon className="mr-4 size-6" />
                  Schedule Appointment
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                className="h-14 w-full justify-start text-lg"
              >
                <Link
                  href={`/facility/${props.facilityId}/patient/${patientData.id}/consultation`}
                >
                  <CareIcon icon="l-stethoscope" className="mr-4 size-6" />
                  Create Encounter
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </Page>
  );
}
