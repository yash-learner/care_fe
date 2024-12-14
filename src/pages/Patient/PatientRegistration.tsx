import careConfig from "@careConfig";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";

import Spinner from "@/components/Common/Spinner";
import { ILocalBodies } from "@/components/ExternalResult/models";
import { WardModel } from "@/components/Facility/models";
import { DistrictModel } from "@/components/Facility/models";
import {
  FieldError,
  PhoneNumberValidator,
  RequiredFieldValidator,
} from "@/components/Form/FieldValidators";
import Form from "@/components/Form/Form";
import CheckBoxFormField from "@/components/Form/FormFields/CheckBoxFormField";
import DateFormField from "@/components/Form/FormFields/DateFormField";
import PhoneNumberFormField from "@/components/Form/FormFields/PhoneNumberFormField";
import RadioFormField from "@/components/Form/FormFields/RadioFormField";
import { SelectFormField } from "@/components/Form/FormFields/SelectFormField";
import TextAreaFormField from "@/components/Form/FormFields/TextAreaFormField";
import TextFormField from "@/components/Form/FormFields/TextFormField";
import { PatientForm } from "@/components/Patient/PatientRegister";

import useAppHistory from "@/hooks/useAppHistory";

import { GENDER_TYPES } from "@/common/constants";
import countryList from "@/common/static/countries.json";
import { validateName, validatePincode } from "@/common/validation";

import { usePubSub } from "@/Utils/pubsubContext";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { compareBy, dateQueryString } from "@/Utils/utils";
import {
  getPincodeDetails,
  includesIgnoreCase,
  parsePhoneNumber,
} from "@/Utils/utils";

type PatientRegistrationForm = Partial<PatientForm> & {
  emergency_contact_person: string;
  landmark: string;
};

const initialForm: PatientRegistrationForm = {
  name: "",
  age: undefined,
  year_of_birth: undefined,
  gender: 1,
  phone_number: "+91",
  emergency_contact_person: "",
  emergency_phone_number: "+91",
  blood_group: "",
  date_of_birth: "",
  medical_history: [],
  nationality: "India",
  passport_no: "",
  state: undefined,
  district: undefined,
  local_body: undefined,
  ward: undefined,
  address: "",
  permanent_address: "",
  landmark: "",
  sameAddress: true,
  village: "",
  allergies: "",
  pincode: undefined,
};

type PatientRegistrationProps = {
  facilityId: string;
  doctorUsername: string;
};

export function PatientRegistration(props: PatientRegistrationProps) {
  const { goBack } = useAppHistory();
  const { t } = useTranslation();
  const [ageInputType, setAgeInputType] = useState<"age" | "date_of_birth">(
    "age",
  );

  const { publish } = usePubSub();

  const validateForm = (form: any) => {
    const errors: Partial<Record<keyof any, FieldError>> = {};

    Object.keys(form).forEach((field) => {
      let phoneNumber, emergency_phone_number;
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
        case "age":
        case "date_of_birth": {
          const field = ageInputType === "age" ? "age" : "date_of_birth";

          errors[field] = RequiredFieldValidator()(form[field]);
          if (errors[field]) {
            return;
          }

          if (field === "age") {
            if (form.age < 0) {
              errors.age = "Age cannot be less than 0";
              return;
            }

            form.date_of_birth = null;
            form.year_of_birth = new Date().getFullYear() - form.age;
          }

          if (field === "date_of_birth") {
            form.age = null;
            form.year_of_birth = null;
          }

          return;
        }
        case "permanent_address":
          if (!form.sameAddress) {
            errors[field] = RequiredFieldValidator()(form[field]);
          }
          return;
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
        case "passport_no":
          if (form.nationality !== "India" && !form[field]) {
            errors[field] = "Please enter the passport number";
          }
          return;
        case "phone_number":
          phoneNumber = parsePhoneNumber(form[field]);
          if (
            !form[field] ||
            !phoneNumber ||
            !PhoneNumberValidator()(phoneNumber) === undefined
          ) {
            errors[field] = "Please enter valid phone number";
          }
          return;
        case "emergency_phone_number":
          emergency_phone_number = parsePhoneNumber(form[field]);
          if (
            !form[field] ||
            !emergency_phone_number ||
            !PhoneNumberValidator()(emergency_phone_number) === undefined
          ) {
            errors[field] = "Please enter valid phone number";
          }
          return;
        default:
          return;
      }
    });

    return errors;
  };

  const handleSubmit = async (formData: PatientRegistrationForm) => {
    const data = {
      phone_number: parsePhoneNumber(formData.phone_number ?? ""),
      emergency_phone_number: parsePhoneNumber(
        formData.emergency_phone_number ?? "",
      ),
      date_of_birth:
        ageInputType === "date_of_birth"
          ? dateQueryString(formData.date_of_birth)
          : null,
      year_of_birth: ageInputType === "age" ? formData.year_of_birth : null,
      name: formData.name,
      pincode: formData.pincode ? formData.pincode : undefined,
      gender: Number(formData.gender),
      nationality: formData.nationality,
      passport_no:
        formData.nationality !== "India" ? formData.passport_no : undefined,
      state: formData.nationality === "India" ? formData.state : undefined,
      district:
        formData.nationality === "India" ? formData.district : undefined,
      local_body:
        formData.nationality === "India" ? formData.local_body : undefined,
      ward: formData.ward,
      village: formData.village,
      address: formData.address ? formData.address : undefined,
      permanent_address: formData.sameAddress
        ? formData.address
        : formData.permanent_address
          ? formData.permanent_address
          : undefined,
      is_active: true,
    };

    const { res, data: requestData } = await request(routes.addPatient, {
      body: { ...data, facility: props.facilityId },
    });

    if (res?.ok && requestData) {
      publish("patient:upsert", requestData);
    }
  };

  const [isEmergencyNumberEnabled, setIsEmergencyNumberEnabled] =
    useState(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [isLocalbodyLoading, setIsLocalbodyLoading] = useState(false);
  const [isWardLoading, setIsWardLoading] = useState(false);
  const [districts, setDistricts] = useState<DistrictModel[]>([]);
  const [localBody, setLocalBody] = useState<ILocalBodies[]>([]);
  const [ward, setWard] = useState<WardModel[]>([]);
  const [showAutoFilledPincode, setShowAutoFilledPincode] = useState(false);

  const fetchDistricts = useCallback(async (id: number) => {
    if (id > 0) {
      setIsDistrictLoading(true);
      const { res, data } = await request(routes.getDistrictByState, {
        pathParams: { id },
      });
      if (res?.ok && data) {
        setDistricts(data);
      }
      setIsDistrictLoading(false);
      return data ? [...data] : [];
    }
  }, []);

  const fetchLocalBody = useCallback(async (id: string) => {
    if (Number(id) > 0) {
      setIsLocalbodyLoading(true);
      const { data } = await request(routes.getLocalbodyByDistrict, {
        pathParams: { id },
      });
      setIsLocalbodyLoading(false);
      setLocalBody(data || []);
    } else {
      setLocalBody([]);
    }
  }, []);

  const fetchWards = useCallback(async (id: string) => {
    if (Number(id) > 0) {
      setIsWardLoading(true);
      const { data } = await request(routes.getWardByLocalBody, {
        pathParams: { id },
      });
      setIsWardLoading(false);
      if (data) {
        setWard(data.results);
      }
    } else {
      setWard([]);
    }
  }, []);

  const { data: stateData, isLoading: isStateLoading } = useQuery({
    queryKey: [routes.statesList],
    queryFn: () => request(routes.statesList),
  });

  const handlePincodeChange = async (e: any, setField: any) => {
    if (!validatePincode(e.value)) return;

    const pincodeDetails = await getPincodeDetails(
      e.value,
      careConfig.govDataApiKey,
    );
    if (!pincodeDetails) return;

    const matchedState = stateData?.data?.results?.find((state) => {
      return includesIgnoreCase(state.name, pincodeDetails.statename);
    });
    if (!matchedState) return;

    const fetchedDistricts = await fetchDistricts(matchedState.id);
    if (!fetchedDistricts) return;

    const matchedDistrict = fetchedDistricts.find((district) => {
      return includesIgnoreCase(district.name, pincodeDetails.districtname);
    });
    if (!matchedDistrict) return;

    setField({ name: "state", value: matchedState.id });
    setField({ name: "district", value: matchedDistrict.id.toString() }); // Convert matchedDistrict.id to string

    fetchLocalBody(matchedDistrict.id.toString()); // Convert matchedDistrict.id to string
    setShowAutoFilledPincode(true);
    setTimeout(() => {
      setShowAutoFilledPincode(false);
    }, 2000);
  };

  return (
    <div className="container max-w-3xl mx-auto p-10">
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => goBack()}>
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
      >
        {(field) => (
          <>
            <div>
              <h2 className="text-xl font-semibold">Patient Registration</h2>

              <div className="space-y-2 mt-4 flex-row bg-white border border-gray-200/50 rounded-md p-8 shadow-md">
                <TextFormField
                  {...field("name")}
                  label="Patient Name"
                  required
                />

                <div className="space-y-2">
                  <PhoneNumberFormField
                    {...field("phone_number")}
                    label="Phone Number"
                    required
                    types={["mobile", "landline"]}
                  />
                  <CheckBoxFormField
                    label="Use this phone number for emergency contact"
                    name="use_phone_for_emergency"
                    value={isEmergencyNumberEnabled}
                    onChange={({ value }) => {
                      setIsEmergencyNumberEnabled(value);
                      value
                        ? field("emergency_phone_number").onChange({
                            name: field("emergency_phone_number").name,
                            value: field("phone_number").value,
                          })
                        : field("emergency_phone_number").onChange({
                            name: field("emergency_phone_number").name,
                            value: initialForm.emergency_phone_number,
                          });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <PhoneNumberFormField
                    {...field("emergency_phone_number")}
                    label="Emergency contact number"
                    disabled={isEmergencyNumberEnabled}
                    required
                    types={["mobile", "landline"]}
                  />
                  <TextFormField
                    {...field("emergency_contact_person")}
                    disabled={isEmergencyNumberEnabled}
                    label="Emergency contact person (Father, Mother, Spouse, Sibling, Friend)"
                  />
                </div>

                <RadioFormField
                  {...field("gender")}
                  label="Gender"
                  options={GENDER_TYPES}
                  optionLabel={(o: any) => o.text}
                  optionValue={(o: any) => o.id}
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
                  <TextFormField
                    {...field("age")}
                    placeholder="Enter Age"
                    required
                    type="number"
                  />
                )}
              </div>
              <div className="space-y-2 mt-12 flex-row bg-white border border-gray-200/50 rounded-md p-8 shadow-md">
                <TextAreaFormField
                  {...field("address")}
                  label="Current Address"
                  required
                />

                <TextAreaFormField
                  {...field("permanent_address")}
                  label="Permanent Address"
                  required
                />

                <TextFormField {...field("landmark")} label="Landmark" />

                <TextFormField
                  {...field("pincode")}
                  label="Pin code"
                  required
                  onChange={(e) => {
                    field("pincode").onChange(e);
                    handlePincodeChange(e, field("pincode").onChange);
                  }}
                />
                {showAutoFilledPincode && (
                  <div>
                    <CareIcon
                      icon="l-check-circle"
                      className="mr-2 text-sm text-green-500"
                    />
                    <span className="text-sm text-primary-500">
                      State and District auto-filled from Pincode
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <SelectFormField
                    {...field("nationality")}
                    label="Nationality"
                    options={countryList}
                    optionLabel={(o) => o}
                    optionValue={(o) => o}
                  />
                  {field("nationality").value === "India" ? (
                    <>
                      <div data-testid="state" id="state-div">
                        {isStateLoading ? (
                          <Spinner />
                        ) : (
                          <SelectFormField
                            {...field("state")}
                            label="State"
                            required
                            placeholder="Choose State"
                            options={stateData?.data?.results || []}
                            optionLabel={(o: any) => o.name}
                            optionValue={(o: any) => o.id}
                            onChange={(e: any) => {
                              field("state").onChange(e);
                              field("district").onChange({
                                name: "district",
                                value: undefined,
                              });
                              field("local_body").onChange({
                                name: "local_body",
                                value: undefined,
                              });
                              field("ward").onChange({
                                name: "ward",
                                value: undefined,
                              });
                              fetchDistricts(e.value);
                              fetchLocalBody("0");
                              fetchWards("0");
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div id="passport_no-div">
                      <TextFormField
                        label="Passport Number"
                        {...field("passport_no")}
                        type="text"
                      />
                    </div>
                  )}
                </div>

                {field("nationality").value === "India" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div data-testid="district" id="district-div">
                      {isDistrictLoading ? (
                        <div className="flex w-full items-center justify-center">
                          <Spinner />
                        </div>
                      ) : (
                        <SelectFormField
                          {...field("district")}
                          label="District"
                          required
                          placeholder={
                            field("state").value
                              ? "Choose District"
                              : "Select State First"
                          }
                          disabled={!field("state").value}
                          options={districts}
                          optionLabel={(o: any) => o.name}
                          optionValue={(o: any) => o.id}
                          onChange={(e: any) => {
                            field("district").onChange(e);
                            field("local_body").onChange({
                              name: "local_body",
                              value: undefined,
                            });
                            field("ward").onChange({
                              name: "ward",
                              value: undefined,
                            });
                            fetchLocalBody(String(e.value));
                            fetchWards("0");
                          }}
                        />
                      )}
                    </div>
                    <div data-testid="localbody" id="local_body-div">
                      {isLocalbodyLoading ? (
                        <div className="flex w-full items-center justify-center">
                          <Spinner />
                        </div>
                      ) : (
                        <SelectFormField
                          {...field("local_body")}
                          label="Localbody"
                          required
                          placeholder={
                            field("district").value
                              ? "Choose Localbody"
                              : "Select District First"
                          }
                          disabled={!field("district").value}
                          options={localBody}
                          optionLabel={(o) => o.name}
                          optionValue={(o) => o.id}
                          onChange={(e) => {
                            field("local_body").onChange(e);
                            field("ward").onChange({
                              name: "ward",
                              value: undefined,
                            });
                            fetchWards(String(e.value));
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {field("nationality").value === "India" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div data-testid="ward-respective-lsgi" id="ward-div">
                      {isWardLoading ? (
                        <div className="flex w-full items-center justify-center">
                          <Spinner />
                        </div>
                      ) : (
                        <SelectFormField
                          {...field("ward")}
                          label="Ward"
                          options={ward.sort(compareBy("number")).map((e) => {
                            return {
                              id: e.id,
                              name: e.number + ": " + e.name,
                            };
                          })}
                          placeholder={
                            field("local_body").value
                              ? "Choose Ward"
                              : "Select Localbody First"
                          }
                          disabled={!field("local_body").value}
                          optionLabel={(o: any) => o.name}
                          optionValue={(o: any) => o.id}
                          onChange={(e: any) => {
                            field("ward").onChange(e);
                          }}
                        />
                      )}
                    </div>
                    <TextFormField {...field("village")} label="Village" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
