import { navigate } from "raviger";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { FacilitySelect } from "@/components/Common/FacilitySelect";
import Loading from "@/components/Common/Loading";
import { FacilityModel } from "@/components/Facility/models";
import Form from "@/components/Form/Form";
import { FormContextValue } from "@/components/Form/FormContext";
import CheckBoxFormField from "@/components/Form/FormFields/CheckBoxFormField";
import DateFormField from "@/components/Form/FormFields/DateFormField";
import { FieldLabel } from "@/components/Form/FormFields/FormField";
import PhoneNumberFormField from "@/components/Form/FormFields/PhoneNumberFormField";
import { SelectFormField } from "@/components/Form/FormFields/SelectFormField";
import TextFormField from "@/components/Form/FormFields/TextFormField";
import { FieldChangeEvent } from "@/components/Form/FormFields/Utils";
import { UserForm } from "@/components/Users/UserFormValidations";
import { GetUserTypes } from "@/components/Users/UserListAndCard";
import { UserModel } from "@/components/Users/models";

import useAppHistory from "@/hooks/useAppHistory";
import useAuthUser from "@/hooks/useAuthUser";

import { GENDER_TYPES } from "@/common/constants";
import { validateUsername } from "@/common/validation";

import { useAutoSaveReducer } from "@/Utils/AutoSave";
import * as Notification from "@/Utils/Notifications";
import dayjs from "@/Utils/dayjs";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import useTanStackQueryInstead from "@/Utils/request/useQuery";
import { classNames, dateQueryString, parsePhoneNumber } from "@/Utils/utils";
import OrganizationSelector from "@/pages/Organization/components/OrganizationSelector";

const initForm: UserForm = {
  user_type: "staff",
  gender: "male",
  password: "",
  c_password: "",
  facilities: [],
  home_facility: null,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "+91",
  alt_phone_number: "+91",
  phone_number_is_whatsapp: true,
  date_of_birth: null,
  state: 0,
  district: 0,
  local_body: 0,
  qualification: undefined,
  doctor_experience_commenced_on: undefined,
  doctor_medical_council_registration: undefined,
  weekly_working_hours: undefined,
  video_connect_link: undefined,
  geo_organization: "",
};

interface UserProps {
  username?: string;
  includedFields?: Array<keyof UserForm>;
  onSubmitSuccess?: () => void;
}

const STAFF_OR_NURSE_USER = ["staff", "nurse"];

const initError = Object.assign(
  {},
  ...Object.keys(initForm).map((k) => ({ [k]: "" })),
);

const initialState = {
  form: { ...initForm },
  errors: { ...initError },
};

type UserFormAction =
  | { type: "set_form"; form: UserForm }
  | { type: "set_state"; state?: typeof initialState };

const user_create_reducer = (state = initialState, action: UserFormAction) => {
  switch (action.type) {
    case "set_form": {
      return {
        ...state,
        form: action.form,
      };
    }
    case "set_state": {
      if (action.state) return action.state;
      return state;
    }
    default:
      return state;
  }
};

const getDate = (value: string | Date | null) =>
  value && dayjs(value).isValid() ? dayjs(value).toDate() : undefined;

export const validateRule = (
  condition: boolean,
  content: JSX.Element | string,
  isInitialState: boolean = false,
) => {
  return (
    <div>
      {isInitialState ? (
        <CareIcon icon="l-circle" className="text-xl text-gray-500" />
      ) : condition ? (
        <CareIcon icon="l-check-circle" className="text-xl text-green-500" />
      ) : (
        <CareIcon icon="l-times-circle" className="text-xl text-red-500" />
      )}{" "}
      <span
        className={classNames(
          isInitialState
            ? "text-black"
            : condition
              ? "text-primary-500"
              : "text-red-500",
        )}
      >
        {content}
      </span>
    </div>
  );
};

const UserAddEditForm = (props: UserProps) => {
  const { t } = useTranslation();
  const { goBack } = useAppHistory();
  const { username, includedFields } = props;
  const editUser = username ? true : false;
  const formVals = useRef(initForm);
  const [facilityErrors, setFacilityErrors] = useState("");

  const {
    loading: userDataLoading,
    data: userData,
    refetch: refetchUserData,
  } = useTanStackQueryInstead(routes.getUserDetails, {
    pathParams: {
      username: username ?? "",
    },
    prefetch: editUser && !!username,
    onResponse: (result) => {
      if (!editUser || !result || !result.res || !result.data) return;
      const userData = result.data;
      const formData: UserForm = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        date_of_birth: userData.date_of_birth || null,
        gender:
          userData.gender === "Male"
            ? "male"
            : userData.gender === "Female"
              ? "female"
              : "non_binary",
        email: userData.email,
        video_connect_link: userData.video_connect_link,
        phone_number: userData.phone_number?.toString() || "",
        alt_phone_number: userData.alt_phone_number?.toString() || "",
        weekly_working_hours: userData.weekly_working_hours,
        phone_number_is_whatsapp:
          userData.phone_number?.toString() ===
          userData.alt_phone_number?.toString(),
        user_type: userData.user_type === "Doctor" ? "doctor" : "staff",
        qualification: userData.qualification,
        doctor_experience_commenced_on: userData.doctor_experience_commenced_on
          ? dayjs()
              .diff(dayjs(userData.doctor_experience_commenced_on), "years")
              .toString()
          : undefined,
        doctor_medical_council_registration:
          userData.doctor_medical_council_registration,
      };
      dispatch({
        type: "set_form",
        form: formData,
      });
      formVals.current = formData;
    },
  });

  const prepData = (
    formData: UserForm,
    isCreate: boolean = false,
  ): Partial<UserForm> => {
    const fields = includedFields ?? Object.keys(formData);
    let baseData: Partial<UserForm> = {};
    const phoneNumber = parsePhoneNumber(formData.phone_number) ?? "";
    const altPhoneNumber = formData.phone_number_is_whatsapp
      ? phoneNumber
      : (parsePhoneNumber(formData.alt_phone_number) ?? "");

    let fieldMappings: Partial<UserForm> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      video_connect_link: formData.video_connect_link,
      phone_number: phoneNumber,
      alt_phone_number: altPhoneNumber,
      gender: formData.gender,
      date_of_birth: dateQueryString(formData.date_of_birth),
      qualification:
        formData.user_type === "doctor" || formData.user_type === "nurse"
          ? formData.qualification
          : undefined,
      doctor_experience_commenced_on:
        formData.user_type === "doctor"
          ? dayjs()
              .subtract(
                parseInt(
                  (formData.doctor_experience_commenced_on as string) ?? "0",
                ),
                "years",
              )
              .format("YYYY-MM-DD")
          : undefined,
      doctor_medical_council_registration:
        formData.user_type === "doctor"
          ? formData.doctor_medical_council_registration
          : undefined,
      weekly_working_hours:
        formData.weekly_working_hours && formData.weekly_working_hours !== ""
          ? formData.weekly_working_hours
          : undefined,
      geo_organization: formData.geo_organization,
    };

    if (isCreate) {
      fieldMappings = {
        ...fieldMappings,
        user_type: formData.user_type,
        password: formData.password,
        facilities: formData.facilities ?? undefined,
        home_facility: formData.home_facility ?? undefined,
        username: formData.username,
        state: formData.state,
        district: formData.district,
        local_body: showLocalbody ? formData.local_body : undefined,
      };
    }

    for (const field of fields) {
      if (field in fieldMappings) {
        baseData = {
          ...baseData,
          [field as keyof UserForm]: fieldMappings[field as keyof UserForm],
        };
      }
    }

    return baseData;
  };

  const handleEditSubmit = async (formData: UserForm) => {
    if (!username) return;
    const data = prepData(formData);
    const { res, error } = await request(routes.partialUpdateUser, {
      pathParams: { username },
      body: data as Partial<UserModel>,
    });
    if (res?.ok) {
      Notification.Success({
        msg: t("user_details_update_success"),
      });
      await refetchUserData();
    } else {
      Notification.Error({
        msg: error?.message ?? t("user_details_update_error"),
      });
    }
    props.onSubmitSuccess?.();
  };

  const [state, dispatch] = useAutoSaveReducer<UserForm>(
    user_create_reducer,
    initialState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FacilityModel[]>([]);
  const [usernameInputInFocus, setUsernameInputInFocus] = useState(false);
  const [passwordInputInFocus, setPasswordInputInFocus] = useState(false);
  const [confirmPasswordInputInFocus, setConfirmPasswordInputInFocus] =
    useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const userExistsEnums = {
    idle: 0,
    checking: 1,
    exists: 2,
    available: 3,
  };

  const [usernameExists, setUsernameExists] = useState<number>(0);

  const check_username = async (username: string) => {
    setUsernameExists(userExistsEnums.checking);
    const { res: usernameCheck } = await request(routes.checkUsername, {
      pathParams: { username },
      silent: true,
    });
    if (usernameCheck === undefined || usernameCheck.status === 409)
      setUsernameExists(userExistsEnums.exists);
    else if (usernameCheck.status === 200)
      setUsernameExists(userExistsEnums.available);
    else
      Notification.Error({
        msg: "Some error checking username availabality. Please try again later.",
      });
  };

  useEffect(() => {
    setUsernameExists(userExistsEnums.idle);
    if (validateUsername(usernameInput)) {
      const timeout = setTimeout(() => {
        check_username(usernameInput);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [usernameInput]);

  const userTypes = GetUserTypes();
  const authUser = useAuthUser();

  const showLocalbody = ![
    "Pharmacist",
    "Volunteer",
    "Doctor",
    ...STAFF_OR_NURSE_USER,
  ].includes(state.form.user_type ?? "");

  const handleDateChange = (
    event: FieldChangeEvent<Date>,
    field?: FormContextValue<UserForm>,
  ) => {
    if (dayjs(event.value).isValid()) {
      dispatch({
        type: "set_form",
        form: {
          ...state.form,
          [event.name]: dayjs(event.value).format("YYYY-MM-DD"),
        },
      });
      if (field) field(event.name as keyof UserForm).onChange(event);
    }
  };

  const handleFieldChange = (
    event: FieldChangeEvent<unknown>,
    field?: FormContextValue<UserForm>,
  ) => {
    const fieldName = event.name as keyof UserForm;
    dispatch({
      type: "set_form",
      form: {
        ...state.form,
        [fieldName]: event.value,
      },
    });
    field?.(fieldName).onChange(event);
  };

  const changePhoneNumber = (
    field: FormContextValue<UserForm>,
    fieldName: keyof UserForm,
    value: string | boolean,
  ) => {
    field(fieldName).onChange({
      name: field(fieldName).name,
      value: value,
    });
  };

  const updatePhoneNumber = (
    field: FormContextValue<UserForm>,
    phoneNumber: string,
  ) => {
    changePhoneNumber(field, "phone_number", phoneNumber);
    return { phone_number: phoneNumber };
  };

  const updateAltPhoneNumber = (
    field: FormContextValue<UserForm>,
    allowUpdate: boolean,
    phoneNumber: string,
  ) => {
    if (allowUpdate) {
      changePhoneNumber(field, "alt_phone_number", phoneNumber);
      return { alt_phone_number: phoneNumber };
    }
    return {};
  };

  const handlePhoneChange = (
    event: FieldChangeEvent<unknown>,
    field: FormContextValue<UserForm>,
  ) => {
    let formData = { ...state.form };
    let phoneNumberVal = "";
    switch (event.name) {
      case "phone_number":
        formData = {
          ...formData,
          ...updatePhoneNumber(field, event.value as string),
          ...updateAltPhoneNumber(
            field,
            state.form.phone_number_is_whatsapp ?? true,
            event.value as string,
          ),
        };
        break;
      case "alt_phone_number":
        phoneNumberVal = event.value as string;
        formData = {
          ...formData,
          ...updateAltPhoneNumber(
            field,
            !(state.form.phone_number_is_whatsapp ?? true),
            phoneNumberVal,
          ),
        };
        break;
      case "phone_number_is_whatsapp":
        formData = {
          ...formData,
          ...updateAltPhoneNumber(
            field,
            event.value as boolean,
            state.form.phone_number,
          ),
          phone_number_is_whatsapp: event.value as boolean,
        };
        changePhoneNumber(
          field,
          "phone_number_is_whatsapp",
          event.value as boolean,
        );
        break;
    }
    dispatch({
      type: "set_form",
      form: formData,
    });
  };

  const setFacility = (selected: FacilityModel | FacilityModel[] | null) => {
    const newSelectedFacilities = selected
      ? Array.isArray(selected)
        ? selected
        : [selected]
      : [];
    setSelectedFacility(newSelectedFacilities as FacilityModel[]);
    const form = { ...state.form };
    form.facilities = selected
      ? (selected as FacilityModel[]).map((i) => i.id!)
      : [];
    dispatch({ type: "set_form", form });
  };

  const validateFacility = (
    formData: UserForm,
    selectedFacility: FacilityModel[],
  ) => {
    if (
      selectedFacility &&
      formData.user_type &&
      selectedFacility.length === 0 &&
      STAFF_OR_NURSE_USER.includes(authUser.user_type) &&
      STAFF_OR_NURSE_USER.includes(formData.user_type)
    ) {
      return "Please select atleast one of the facilities you are linked to";
    }
  };

  const handleSubmit = async (formData: UserForm) => {
    setIsLoading(true);
    const data = prepData(formData, true);

    const { res, error } = await request(routes.addUser, {
      body: data,
    });
    if (res?.ok) {
      dispatch({ type: "set_form", form: initForm });
      Notification.Success({
        msg: t("user_added_successfully"),
      });
      navigate("/users");
    } else {
      Notification.Error({
        msg: error?.message ?? t("user_add_error"),
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const facilityError = validateFacility(state.form, selectedFacility);
    setFacilityErrors(facilityError || "");
  }, [state.form, selectedFacility]);

  if (isLoading || (editUser && userDataLoading)) {
    return <Loading />;
  }

  const handleCancel = () => {
    dispatch({
      type: "set_form",
      form: formVals.current,
    });
  };

  const renderDoctorOrNurseFields = (field: FormContextValue<UserForm>) => {
    return (
      <>
        {(state.form.user_type === "doctor" ||
          state.form.user_type === "nurse") &&
          includedFields?.includes("qualification") && (
            <TextFormField
              {...field("qualification")}
              required
              label={t("qualification")}
              placeholder={t("qualification")}
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              className="flex-1"
              aria-label={t("qualification")}
            />
          )}
        {state.form.user_type === "doctor" && (
          <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
            {includedFields?.includes("doctor_experience_commenced_on") && (
              <TextFormField
                {...field("doctor_experience_commenced_on")}
                required
                label={t("years_of_experience")}
                placeholder={t("years_of_experience_of_the_doctor")}
                onChange={(e) => {
                  handleFieldChange(e, field);
                }}
                className="flex-1"
                aria-label={t("years_of_experience")}
              />
            )}
            {includedFields?.includes(
              "doctor_medical_council_registration",
            ) && (
              <TextFormField
                {...field("doctor_medical_council_registration")}
                required
                label={t("medical_council_registration")}
                placeholder={t("doctor_s_medical_council_registration")}
                onChange={(e) => {
                  handleFieldChange(e, field);
                }}
                className="flex-1"
                aria-label={t("medical_council_registration")}
              />
            )}
          </div>
        )}
      </>
    );
  };

  const renderPhoneNumberFields = (field: FormContextValue<UserForm>) => {
    return (
      <>
        {includedFields?.includes("phone_number") && (
          <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
            <div className="flex flex-1 flex-col">
              <PhoneNumberFormField
                {...field("phone_number")}
                placeholder={t("phone_number")}
                label={t("phone_number")}
                required
                types={["mobile", "landline"]}
                onChange={(e) => {
                  handlePhoneChange(e, field);
                }}
                className=""
                aria-label={t("phone_number")}
              />
              <CheckBoxFormField
                name="phone_number_is_whatsapp"
                value={state.form.phone_number_is_whatsapp}
                onChange={(e) => {
                  handlePhoneChange(e, field);
                }}
                label={t("is_phone_a_whatsapp_number")}
              />
            </div>
            <PhoneNumberFormField
              {...field("alt_phone_number")}
              placeholder={t("whatsapp_phone_number")}
              label={t("whatsapp_number")}
              disabled={state.form.phone_number_is_whatsapp}
              types={["mobile"]}
              onChange={(e) => {
                handlePhoneChange(e, field);
              }}
              className="flex-1"
              aria-label={t("whatsapp_number")}
            />
          </div>
        )}
      </>
    );
  };

  const renderUsernameField = (field: FormContextValue<UserForm>) => {
    return (
      <>
        {includedFields?.includes("username") && (
          <>
            <TextFormField
              {...field("username")}
              label={t("username")}
              placeholder={t("username")}
              required
              autoComplete="new-username"
              value={usernameInput}
              onChange={(e) => {
                handleFieldChange(e, field);
                setUsernameInput(e.value);
              }}
              onFocus={() => setUsernameInputInFocus(true)}
              onBlur={() => {
                setUsernameInputInFocus(false);
              }}
              aria-label={t("username")}
            />
            {usernameInputInFocus && (
              <div className="text-small pl-2 text-secondary-500">
                <div>
                  {usernameExists !== userExistsEnums.idle && (
                    <>
                      {usernameExists === userExistsEnums.checking ? (
                        <span>
                          <CareIcon icon="l-record-audio" className="text-xl" />{" "}
                          checking...
                        </span>
                      ) : (
                        <>
                          {usernameExists === userExistsEnums.exists ? (
                            <div>
                              <CareIcon
                                icon="l-times-circle"
                                className="text-xl text-red-500"
                              />{" "}
                              <span className="text-red-500">
                                {t("username_not_available")}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <CareIcon
                                icon="l-check-circle"
                                className="text-xl text-green-500"
                              />{" "}
                              <span className="text-primary-500">
                                {t("username_available")}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div aria-live="polite">
                  {validateRule(
                    usernameInput.length >= 4 && usernameInput.length <= 16,
                    "Username should be 4-16 characters long",
                    !state.form.username,
                  )}
                  {validateRule(
                    /^[a-z0-9._-]*$/.test(usernameInput),
                    "Username can only contain lowercase letters, numbers, and . _ -",
                    !state.form.username,
                  )}
                  {validateRule(
                    /^[a-z0-9].*[a-z0-9]$/i.test(usernameInput),
                    "Username must start and end with a letter or number",
                    !state.form.username,
                  )}
                  {validateRule(
                    !/(?:[._-]{2,})/.test(usernameInput),
                    "Username can't contain consecutive special characters . _ -",
                    !state.form.username,
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderPasswordFields = (field: FormContextValue<UserForm>) => {
    return (
      <>
        <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
          {includedFields?.includes("password") && (
            <div className="flex flex-1 flex-col">
              <TextFormField
                {...field("password")}
                label={t("password")}
                placeholder={t("password")}
                required
                autoComplete="new-password"
                type="password"
                onFocus={() => setPasswordInputInFocus(true)}
                onBlur={() => setPasswordInputInFocus(false)}
                onChange={(e) => {
                  handleFieldChange(e, field);
                }}
                aria-label={t("password")}
              />
              {passwordInputInFocus && state.form.password && (
                <div
                  className="text-small pl-2 text-secondary-500"
                  aria-live="polite"
                >
                  {validateRule(
                    state.form.password.length >= 8,
                    t("password_length_validation"),
                    !state.form.password,
                  )}
                  {validateRule(
                    state.form.password !== state.form.password.toUpperCase(),
                    t("password_lowercase_validation"),
                    !state.form.password,
                  )}
                  {validateRule(
                    state.form.password !== state.form.password.toLowerCase(),
                    t("password_uppercase_validation"),
                    !state.form.password,
                  )}
                  {validateRule(
                    /\d/.test(state.form.password),
                    t("password_number_validation"),
                    !state.form.password,
                  )}
                </div>
              )}
            </div>
          )}
          {includedFields?.includes("c_password") && (
            <div className="flex flex-1 flex-col">
              <TextFormField
                {...field("c_password")}
                label={t("confirm_password")}
                placeholder={t("confirm_password")}
                required
                type="password"
                autoComplete="off"
                onFocus={() => setConfirmPasswordInputInFocus(true)}
                onBlur={() => setConfirmPasswordInputInFocus(false)}
                onChange={(e) => {
                  handleFieldChange(e, field);
                }}
                aria-label={t("confirm_password")}
              />
              {confirmPasswordInputInFocus &&
                state.form.c_password &&
                state.form.c_password.length > 0 && (
                  <div aria-live="polite">
                    {validateRule(
                      state.form.c_password === state.form.password,
                      t("password_mismatch"),
                      !state.form.c_password,
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderPersonalInfoFields = (field: FormContextValue<UserForm>) => {
    return (
      <>
        <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
          {includedFields?.includes("first_name") && (
            <TextFormField
              {...field("first_name")}
              required
              label={t("first_name")}
              className="flex-1"
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              aria-label={t("first_name")}
            />
          )}
          {includedFields?.includes("last_name") && (
            <TextFormField
              {...field("last_name")}
              required
              label={t("last_name")}
              className="flex-1"
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              aria-label={t("last_name")}
            />
          )}
        </div>
        {includedFields?.includes("email") && (
          <TextFormField
            {...field("email")}
            label={t("email")}
            placeholder={t("email")}
            required
            onChange={(e) => {
              handleFieldChange(e, field);
            }}
            aria-label={t("email")}
          />
        )}
        <div className="flex flex-col justify-between gap-x-3 sm:flex-row sm:items-center">
          {includedFields?.includes("date_of_birth") && (
            <DateFormField
              {...field("date_of_birth")}
              label={t("date_of_birth")}
              required
              value={getDate(state.form.date_of_birth)}
              onChange={(e) => {
                handleDateChange(e, field);
              }}
              disableFuture
              className="flex-1"
              aria-label={t("date_of_birth")}
            />
          )}
          {includedFields?.includes("gender") && (
            <SelectFormField
              {...field("gender")}
              label={t("gender")}
              required
              value={state.form.gender}
              options={GENDER_TYPES}
              optionLabel={(o) => o.text}
              optionValue={(o) => o.text}
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              className="flex-1"
              aria-label={t("gender")}
            />
          )}
        </div>
      </>
    );
  };

  const renderHoursAndConferenceLinkFields = (
    field: FormContextValue<UserForm>,
  ) => {
    return (
      <>
        <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
          {includedFields?.includes("weekly_working_hours") && (
            <TextFormField
              {...field("weekly_working_hours")}
              name="weekly_working_hours"
              label={t("average_weekly_working_hours")}
              className="flex-1"
              type="number"
              min={0}
              max={168}
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              aria-label={t("average_weekly_working_hours")}
            />
          )}
          {includedFields?.includes("video_connect_link") && (
            <TextFormField
              {...field("video_connect_link")}
              label={t("video_conference_link")}
              className="flex-1"
              type="url"
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              aria-label={t("video_conference_link")}
            />
          )}
        </div>
      </>
    );
  };

  const renderFacilityUserTypeHomeFacilityFields = (
    field: FormContextValue<UserForm>,
  ) => {
    return (
      <>
        {includedFields?.includes("facilities") && (
          <div className="w-full">
            <FieldLabel>{t("facilities")}</FieldLabel>
            <FacilitySelect
              multiple={true}
              name="facilities"
              selected={selectedFacility}
              setSelected={setFacility}
              errors={facilityErrors}
              showAll={false}
              aria-label={t("facilities")}
            />
          </div>
        )}
        <div className="flex flex-col justify-between gap-x-3 sm:flex-row">
          {includedFields?.includes("user_type") && (
            <SelectFormField
              {...field("user_type")}
              required
              label={t("user_type")}
              options={userTypes}
              optionLabel={(o) => o.role + (o.readOnly ? " (Read Only)" : "")}
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              optionValue={(o) => o.id}
              className="flex-1"
              aria-label={t("user_type")}
            />
          )}
          {includedFields?.includes("home_facility") && (
            <SelectFormField
              {...field("home_facility")}
              label={t("home_facility")}
              options={selectedFacility ?? []}
              optionLabel={(option) => option.name}
              optionValue={(option) => option.id}
              onChange={(e) => {
                handleFieldChange(e, field);
              }}
              className="flex-1"
              aria-label={t("home_facility")}
            />
          )}
        </div>
      </>
    );
  };

  const renderOrganizationField = (field: FormContextValue<UserForm>) => {
    return (
      <>
        {includedFields?.includes("geo_organization") && (
          <div>
            <OrganizationSelector
              value={state.form.geo_organization}
              onChange={(value) => {
                handleFieldChange(
                  {
                    name: "geo_organization",
                    value: value,
                  },
                  field,
                );
              }}
              required
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Form<UserForm>
      disabled={isLoading}
      defaults={userData ? state.form : initForm}
      onCancel={editUser ? handleCancel : () => goBack()}
      onSubmit={() =>
        editUser ? handleEditSubmit(state.form) : handleSubmit(state.form)
      }
      onDraftRestore={(newState) => {
        dispatch({ type: "set_state", state: newState });
      }}
      hideRestoreDraft={editUser}
      noPadding
      resetFormValsOnCancel
      hideCancelButton={editUser}
    >
      {(field) => (
        <>
          <div className="my-4 flex flex-col gap-y-2">
            {renderFacilityUserTypeHomeFacilityFields(field)}
            {renderDoctorOrNurseFields(field)}
            {renderPhoneNumberFields(field)}
            {renderUsernameField(field)}
            {renderPasswordFields(field)}
            {renderPersonalInfoFields(field)}
            {renderHoursAndConferenceLinkFields(field)}
            {renderOrganizationField(field)}
          </div>
        </>
      )}
    </Form>
  );
};

export default UserAddEditForm;
