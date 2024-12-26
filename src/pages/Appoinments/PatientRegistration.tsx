import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "raviger";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import {
  FieldError,
  RequiredFieldValidator,
} from "@/components/Form/FieldValidators";
import Form from "@/components/Form/Form";
import DateFormField from "@/components/Form/FormFields/DateFormField";
import RadioFormField from "@/components/Form/FormFields/RadioFormField";
import TextAreaFormField from "@/components/Form/FormFields/TextAreaFormField";
import TextFormField from "@/components/Form/FormFields/TextFormField";
import {
  Appointment,
  AppointmentCreate,
  SlotAvailability,
} from "@/components/Schedule/types";

import { CarePatientTokenKey, GENDER_TYPES } from "@/common/constants";
import { validateName, validatePincode } from "@/common/validation";

import * as Notification from "@/Utils/Notifications";
import { usePubSub } from "@/Utils/pubsubContext";
import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import { dateQueryString } from "@/Utils/utils";
import {
  AppointmentPatient,
  AppointmentPatientRegister,
} from "@/pages/Patient/Utils";
import { TokenData } from "@/types/auth/otpToken";

import OrganisationSelector from "../Organisation/components/OrganisationSelector";

const initialForm: AppointmentPatientRegister = {
  name: "",
  gender: "1",
  year_of_birth: undefined,
  date_of_birth: "",
  phone_number: "",
  address: "",
  pincode: undefined,
  geo_organization: undefined,
};

type PatientRegistrationProps = {
  facilityId: string;
  staffUsername: string;
};

export function PatientRegistration(props: PatientRegistrationProps) {
  const { staffUsername } = props;
  const selectedSlot = JSON.parse(
    localStorage.getItem("selectedSlot") ?? "",
  ) as SlotAvailability;
  const reason = localStorage.getItem("reason");
  const tokenData: TokenData = JSON.parse(
    localStorage.getItem(CarePatientTokenKey) || "{}",
  );

  const { t } = useTranslation();
  const [ageInputType, setAgeInputType] = useState<"age" | "date_of_birth">(
    "date_of_birth",
  );

  const queryClient = useQueryClient();

  const { publish } = usePubSub();

  const validateForm = (form: any) => {
    const errors: Partial<Record<keyof any, FieldError>> = {};

    Object.keys(form).forEach((field) => {
      switch (field) {
        case "name": {
          const requiredError = RequiredFieldValidator()(form[field]);
          if (requiredError) {
            errors[field] = requiredError;
          } else if (!validateName(form[field])) {
            errors[field] = t("min_char_length_error", { min_length: 3 });
          }
          return;
        }
        case "address":
        case "gender":
          errors[field] = RequiredFieldValidator()(form[field]);
          return;
        case "year_of_birth":
        case "date_of_birth": {
          const field =
            ageInputType === "age" ? "year_of_birth" : "date_of_birth";

          errors[field] = RequiredFieldValidator()(form[field]);
          if (errors[field]) {
            return;
          }

          if (field === "year_of_birth") {
            if (form.year_of_birth < 0) {
              errors.year_of_birth = "Age cannot be less than 0";
              return;
            }

            form.date_of_birth = null;
            form.year_of_birth = new Date().getFullYear() - form.year_of_birth;
          }

          if (field === "date_of_birth") {
            form.year_of_birth = null;
          }

          return;
        }
        case "local_body":
          if (form.nationality === "India" && !Number(form[field])) {
            errors[field] = "Please select a localbody";
          }
          return;
        case "district":
          if (form.nationality === "India" && !Number(form[field])) {
            errors[field] = "Please select district";
          }
          return;
        case "state":
          if (form.nationality === "India" && !Number(form[field])) {
            errors[field] = "Please enter the state";
          }
          return;
        case "pincode":
          if (!validatePincode(form[field])) {
            errors[field] = "Please enter valid pincode";
          }
          return;
        default:
          return;
      }
    });

    return errors;
  };

  const { mutate: createAppointment } = useMutation({
    mutationFn: (body: AppointmentCreate) =>
      mutate(routes.otp.createAppointment, {
        pathParams: { id: selectedSlot?.id },
        body,
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      })(body),
    onSuccess: (data: Appointment) => {
      Notification.Success({ msg: t("appointment_created_success") });
      queryClient.invalidateQueries({
        queryKey: ["patients", tokenData.phoneNumber],
      });
      setTimeout(() => {
        navigate(
          `/facility/${props.facilityId}/appointments/${data.id}/success`,
          { replace: true },
        );
      }, 100);
    },
    onError: (error) => {
      Notification.Error({
        msg: error?.message || t("failed_to_create_appointment"),
      });
    },
  });

  const { mutate: createPatient } = useMutation({
    mutationFn: (body: AppointmentPatientRegister) =>
      mutate(routes.otp.createPatient, {
        body,
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      })(body),
    onSuccess: (data: AppointmentPatient) => {
      Notification.Success({ msg: "Patient created successfully" });
      publish("patient:upsert", data);
      createAppointment({
        patient: data.id,
        reason_for_visit: reason ?? "",
      });
    },
    onError: (error) => {
      Notification.Error({
        msg: error.message,
      });
    },
  });

  const handleSubmit = async (formData: AppointmentPatientRegister) => {
    const data = {
      phone_number: tokenData.phoneNumber,
      date_of_birth:
        ageInputType === "date_of_birth"
          ? dateQueryString(formData.date_of_birth)
          : undefined,
      age: ageInputType === "age" ? formData.year_of_birth : undefined,
      /* year_of_birth:
        ageInputType === "age"
          ? (
              new Date().getFullYear() - Number(formData.year_of_birth ?? 0)
            ).toString()
          : undefined, */
      name: formData.name,
      pincode: formData.pincode ? formData.pincode : undefined,
      gender: formData.gender,
      geo_organization: formData.geo_organization,
      address: formData.address ? formData.address : "",
      is_active: true,
    };
    console.log(formData);
    createPatient(data);
  };

  // const [showAutoFilledPincode, setShowAutoFilledPincode] = useState(false);

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl flex justify-start">
        <Button
          variant="outline"
          className="border border-secondary-400"
          type="button"
          onClick={() =>
            navigate(
              `/facility/${props.facilityId}/appointments/${staffUsername}/patient-select`,
            )
          }
        >
          <CareIcon icon="l-square-shape" className="h-4 w-4 mr-1" />
          <span className="text-sm underline">Back</span>
        </Button>
      </div>
      <Form
        defaults={initialForm}
        validate={validateForm}
        onSubmit={handleSubmit}
        className="mx-auto space-y-6"
        submitLabel="Register Patient"
        hideRestoreDraft
        noPadding
        hideSubmitButton
        hideCancelButton
        disableMarginOnChildren
      >
        {(field) => (
          <>
            <div className="container mx-auto p-4 max-w-3xl">
              <h2 className="text-xl font-semibold">
                {t("patient_registration")}
              </h2>

              <div className="mt-4 flex-row bg-white border border-gray-200/50 rounded-md p-8 shadow-md">
                <span className="inline-block bg-primary-100 p-4 rounded-md w-full mb-4 text-primary-600 text-sm">
                  Phone Number Verified:{" "}
                  <span className="font-bold">{tokenData.phoneNumber}</span>
                </span>
                <TextFormField
                  {...field("name")}
                  label="Patient Name"
                  required
                />

                <RadioFormField
                  {...field("gender")}
                  label="Gender"
                  options={GENDER_TYPES}
                  optionLabel={(o: any) => o.text}
                  optionValue={(o: any) => o.id.toString()}
                />

                <RadioFormField
                  name="age_input_type"
                  label="Date of Birth or Age"
                  options={[
                    { id: "date_of_birth", text: "Date of Birth" },
                    { id: "age", text: "Age" },
                  ]}
                  optionLabel={(o: any) => o.text}
                  optionValue={(o: any) => o.id}
                  value={ageInputType}
                  onChange={(e) => {
                    setAgeInputType(e.value);
                  }}
                />
                {ageInputType === "date_of_birth" && (
                  <DateFormField
                    className="w-full"
                    containerClassName="w-full"
                    {...field("date_of_birth")}
                    errorClassName="hidden"
                    required
                    disableFuture
                  />
                )}
                {ageInputType === "age" && (
                  <>
                    <span className="text-xs text-gray-500">
                      {t("age_notice")}
                    </span>
                    <TextFormField
                      {...field("year_of_birth")}
                      placeholder="Enter Age"
                      required
                      type="number"
                    />
                  </>
                )}
              </div>
              <div className="space-y-2 mt-12 flex-row bg-white border border-gray-200/50 rounded-md p-8 shadow-md">
                <TextAreaFormField
                  {...field("address")}
                  label="Current Address"
                  required
                />

                <TextFormField
                  {...field("pincode")}
                  label="Pin code"
                  required
                  onChange={(e) => {
                    field("pincode").onChange(e);
                  }}
                />

                <OrganisationSelector
                  required={true}
                  authToken={tokenData.token}
                  onChange={(value) => {
                    console.log(value);
                    field("geo_organization").onChange(value);
                  }}
                />
              </div>
            </div>

            <div className="bg-secondary-200 pt-3 pb-8">
              <div className="flex flex-row gap-2 justify-center sm:ml-64 mt-4">
                <Button
                  variant="white"
                  className="sm:w-1/5"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/facility/${props.facilityId}/appointments/${staffUsername}/patient-select`,
                    );
                  }}
                >
                  <span className="bg-gradient-to-b from-white/15 to-transparent"></span>
                  {t("cancel")}
                </Button>
                <Button
                  variant="primary_gradient"
                  className="sm:w-1/5"
                  type="submit"
                >
                  <span className="bg-gradient-to-b from-white/15 to-transparent"></span>
                  {t("register_patient")}
                </Button>
              </div>
            </div>
          </>
        )}
      </Form>
    </>
  );
}
