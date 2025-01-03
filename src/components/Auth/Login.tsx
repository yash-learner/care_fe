import careConfig from "@careConfig";
import { useMutation } from "@tanstack/react-query";
import { Link } from "raviger";
import { useEffect, useState } from "react";
import ReCaptcha from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CircularProgress from "@/components/Common/CircularProgress";
import LanguageSelectorLogin from "@/components/Common/LanguageSelectorLogin";
import BrowserWarning from "@/components/ErrorPages/BrowserWarning";

import { useAuthContext } from "@/hooks/useAuthUser";

import { CarePatientTokenKey } from "@/common/constants";

import FiltersCache from "@/Utils/FiltersCache";
import * as Notification from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import request from "@/Utils/request/request";
import { HTTPError } from "@/Utils/request/types";
import { TokenData } from "@/types/auth/otpToken";

interface LoginFormData {
  username: string;
  password: string;
}

type LoginMode = "staff" | "patient";

interface OtpError {
  type: string;
  loc: string[];
  msg: string;
  input: string;
  ctx: {
    error: string;
  };
  url: string;
}

// Update interface for OTP data
interface OtpLoginData {
  phone_number: string;
  otp: string;
}

const Login = (props: { forgot?: boolean }) => {
  const { signIn } = useAuthContext();
  const { reCaptchaSiteKey, urls, stateLogo, customLogo, customLogoAlt } =
    careConfig;
  const customDescriptionHtml = __CUSTOM_DESCRIPTION_HTML__;
  const initForm: any = {
    username: "",
    password: "",
  };
  const { forgot } = props;
  const initErr: any = {};
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState(initErr);
  const [isCaptchaEnabled, setCaptcha] = useState(false);
  const { t } = useTranslation();
  // display spinner while login is under progress
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(forgot);
  const [loginMode, setLoginMode] = useState<LoginMode>("staff");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpValidationError, setOtpValidationError] = useState<string>("");

  // Staff Login Mutation
  const staffLoginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      FiltersCache.invaldiateAll();
      return await signIn(data);
    },
    onSuccess: ({ res }) => {
      setCaptcha(res?.status === 429);
    },
  });

  // Forgot Password Mutation
  const { mutate: submitForgetPassword } = useMutation({
    mutationFn: mutate(routes.forgotPassword),
    onSuccess: () => {
      toast.success(t("password_sent"));
    },
  });

  // Send OTP Mutation
  const { mutate: sendOtp, isPending: sendOtpPending } = useMutation({
    mutationFn: async (phone: string) => {
      const response = await request(routes.otp.sendOtp, {
        body: { phone_number: `+91${phone}` },
        silent: true,
      });
      return response;
    },
    onSuccess: () => {
      setIsOtpSent(true);
      setOtpError("");
      Notification.Success({ msg: t("send_otp_success") });
    },
    onError: (error: any) => {
      const errors = error?.data || [];
      if (Array.isArray(errors) && errors.length > 0) {
        const firstError = errors[0] as OtpError;
        setOtpError(firstError.msg);
      } else {
        setOtpError(t("send_otp_error"));
      }
    },
  });

  // Verify OTP Mutation
  const { mutate: verifyOtp, isPending: verifyOtpPending } = useMutation({
    mutationFn: async (data: OtpLoginData) => {
      const response = await mutate(routes.otp.loginByOtp, { silent: true })(
        data,
      );
      if ("errors" in response) {
        throw response;
      }
      return response;
    },
    onSuccess: async (response: { access: string }) => {
      const { access } = response;
      if (access) {
        setOtpValidationError("");
        const tokenData: TokenData = {
          token: access,
          phoneNumber: `+91${phone}`,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(CarePatientTokenKey, JSON.stringify(tokenData));
        Notification.Success({ msg: t("verify_otp_success_login") });
        setTimeout(() => {
          window.location.href = "/patient/home";
        }, 200);
      }
    },

    //Invalid OTP error handling
    onError: (error: HTTPError) => {
      let errorMessage = t("invalid_otp");
      if (
        error.cause &&
        Array.isArray(error.cause.errors) &&
        error.cause.errors.length > 0
      ) {
        const otpError = error.cause.errors.find((e) => e.otp);
        if (otpError && otpError.otp) {
          errorMessage = otpError.otp;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setOtpValidationError(errorMessage);
      Notification.Error({ msg: errorMessage });
    },
  });

  // Format phone number to include +91
  const formatPhoneNumber = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, "");

    // Limit to 10 digits
    const truncated = digits.slice(0, 10);

    return truncated;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedNumber);
    setOtpError(""); // Clear error when input changes
    setOtpValidationError("");
  };

  // Login form validation

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    const fieldValue = Object.assign({}, form);
    const errorField = Object.assign({}, errors);
    if (errorField[name]) {
      errorField[name] = null;
      setErrors(errorField);
    }
    fieldValue[name] = value;
    if (name === "username") {
      fieldValue[name] = value.toLowerCase();
    }
    setForm(fieldValue);
  };

  const validateData = () => {
    let hasError = false;
    const err = Object.assign({}, errors);
    Object.keys(form).forEach((key) => {
      if (
        typeof form[key] === "string" &&
        key !== "password" &&
        key !== "confirm"
      ) {
        if (!form[key].match(/\w/)) {
          hasError = true;
          err[key] = t("field_required");
        }
      }
      if (!form[key]) {
        hasError = true;
        err[key] = t("field_required");
      }
    });
    if (hasError) {
      setErrors(err);
      return false;
    }

    return form;
  };

  // set loading to false when component is unmounted
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateData();
    if (!validated) return;

    staffLoginMutation.mutate(validated);
  };

  const validateForgetData = () => {
    let hasError = false;
    const err = Object.assign({}, errors);

    if (typeof form.username === "string") {
      if (!form.username.match(/\w/)) {
        hasError = true;
        err.username = t("field_required");
      }
    }
    if (!form.username) {
      hasError = true;
      err.username = t("field_required");
    }

    if (hasError) {
      setErrors(err);
      return false;
    }
    return form;
  };

  const handleForgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateForgetData();
    if (!valid) return;

    submitForgetPassword(valid);
  };

  const onCaptchaChange = (value: any) => {
    if (value && isCaptchaEnabled) {
      const formCaptcha = { ...form };
      formCaptcha["g-recaptcha-response"] = value;
      setForm(formCaptcha);
    }
  };

  // Handle OTP flow
  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpSent) {
      sendOtp(phone);
    } else {
      verifyOtp({ phone_number: `+91${phone}`, otp });
    }
  };

  const resetPatientLogin = () => {
    setIsOtpSent(false);
    setPhone("");
    setOtp("");
  };

  // Loading state derived from mutations
  const isLoading =
    staffLoginMutation.isPending || sendOtpPending || verifyOtpPending;

  const logos = [stateLogo, customLogo].filter(
    (logo) => logo?.light || logo?.dark,
  );

  return (
    <div className="relative flex md:h-screen flex-col-reverse md:flex-row">
      {!forgotPassword && <BrowserWarning />}

      {/* Hero Section */}
      <div className="login-hero relative flex flex-auto flex-col justify-between p-6 md:h-full md:w-[calc(50%+130px)] md:flex-none md:p-0 md:px-16 md:pr-[calc(4rem+130px)]">
        <div></div>
        <div className="mt-4 flex flex-col items-start rounded-lg py-4 md:mt-12">
          <div className="mb-4 hidden items-center gap-6 md:flex">
            {logos.map((logo, index) =>
              logo && logo.light ? (
                <div key={index} className="flex items-center">
                  <img
                    src={logo.light}
                    className="h-16 rounded-lg py-3"
                    alt="state logo"
                  />
                </div>
              ) : null,
            )}
            {logos.length === 0 && (
              <a
                href={urls.ohcn}
                className="inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={customLogoAlt?.light ?? "/images/ohc_logo_light.svg"}
                  className="h-8"
                  alt="Open Healthcare Network logo"
                />
              </a>
            )}
          </div>
          <div className="max-w-lg">
            <h1 className="text-4xl font-black leading-tight tracking-wider text-white lg:text-5xl">
              {t("care")}
            </h1>
            {customDescriptionHtml ? (
              <div className="py-6">
                <div
                  className="max-w-xl text-secondary-400"
                  dangerouslySetInnerHTML={{
                    __html: __CUSTOM_DESCRIPTION_HTML__,
                  }}
                />
              </div>
            ) : (
              <div className="max-w-xl py-6 pl-1 text-base font-semibold text-secondary-400 md:text-lg lg:text-xl">
                {t("goal")}
              </div>
            )}
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <div className="max-w-lg text-xs md:text-sm">
            <div className="mb-2 ml-1 flex items-center gap-4">
              <a
                href="https://www.digitalpublicgoods.net/r/care"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://cdn.ohc.network/dpg-logo.svg"
                  className="h-12"
                  alt="Logo of Digital Public Goods Alliance"
                />
              </a>
              <div className="ml-2 h-8 w-px rounded-full bg-white/50" />
              <a href={urls.ohcn} rel="noopener noreferrer" target="_blank">
                <img
                  src="/images/ohc_logo_light.svg"
                  className="inline-block h-10"
                  alt="Open Healthcare Network logo"
                />
              </a>
            </div>
            <a
              href={urls.ohcn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-500"
            >
              {t("footer_body")}
            </a>
            <div className="mx-auto mt-2">
              <a
                href={urls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-500"
              >
                {t("contribute_github")}
              </a>
              <span className="mx-2 text-primary-400">|</span>
              <Link
                href="/licenses"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-500"
              >
                {t("third_party_software_licenses")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Forms Section */}
      <div className="login-hero-form my-4 w-full md:mt-0 md:h-full md:w-1/2">
        <div className="relative h-full items-center justify-center md:flex">
          <div className="w-full max-w-[400px] space-y-6">
            {/* Logo for Mobile */}
            <div className="px-4 flex items-center mx-auto gap-4 md:hidden">
              {logos.map((logo, index) =>
                logo && logo.dark ? (
                  <div key={index} className="flex items-center">
                    <img
                      src={logo.dark}
                      className="h-14 rounded-lg py-3"
                      alt="state logo"
                    />
                  </div>
                ) : null,
              )}
              {logos.length === 0 && (
                <a
                  href={urls.ohcn}
                  className="inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={customLogoAlt?.light ?? "/images/ohc_logo_light.svg"}
                    className="h-8"
                    alt="Open Healthcare Network logo"
                  />
                </a>
              )}
            </div>
            <Card className="mx-4">
              <CardHeader className="space-y-1 px-4">
                <CardTitle className="text-2xl font-bold">
                  Welcome back
                </CardTitle>
                <CardDescription>
                  Choose your login method to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="staff"
                  value={loginMode}
                  onValueChange={(value) => {
                    setLoginMode(value as LoginMode);
                    if (value === "staff") {
                      resetPatientLogin();
                    } else {
                      setForgotPassword(false);
                    }
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="staff">Staff Login</TabsTrigger>
                    <TabsTrigger value="patient">Patient Login</TabsTrigger>
                  </TabsList>

                  {/* Staff Login */}
                  <TabsContent value="staff">
                    {!forgotPassword ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            data-cy="username"
                            value={form.username}
                            onChange={handleChange}
                            className={cn(
                              errors.username &&
                                "border-red-500 focus-visible:ring-red-500",
                            )}
                          />
                          {errors.username && (
                            <p className="text-sm text-red-500">
                              {errors.username}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            data-cy="password"
                            value={form.password}
                            onChange={handleChange}
                            className={cn(
                              errors.password &&
                                "border-red-500 focus-visible:ring-red-500",
                            )}
                          />
                          {errors.password && (
                            <p className="text-sm text-red-500">
                              {errors.password}
                            </p>
                          )}
                        </div>

                        {isCaptchaEnabled && (
                          <div className="py-4">
                            <ReCaptcha
                              sitekey={reCaptchaSiteKey}
                              onChange={onCaptchaChange}
                            />
                          </div>
                        )}

                        <Button
                          variant="link"
                          type="button"
                          onClick={() => setForgotPassword(true)}
                          className="px-0"
                        >
                          {t("forget_password")}
                        </Button>

                        <Button
                          type="submit"
                          className="w-full"
                          variant="primary"
                          data-cy="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <CircularProgress className="text-white" />
                          ) : (
                            t("login")
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleForgetSubmit} className="space-y-4">
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => setForgotPassword(false)}
                          className="px-0 mb-4 flex items-center gap-2"
                        >
                          <CareIcon icon="l-arrow-left" className="text-lg" />
                          <span>{t("back_to_login")}</span>
                        </Button>

                        <div className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {t("forget_password")}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                              {t("forget_password_instruction")}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="forgot_username">Username</Label>
                            <Input
                              id="forgot_username"
                              name="username"
                              type="text"
                              value={form.username}
                              onChange={handleChange}
                              placeholder="Enter your username"
                              className={cn(
                                errors.username &&
                                  "border-red-500 focus-visible:ring-red-500",
                              )}
                            />
                            {errors.username && (
                              <p className="text-sm text-red-500">
                                {errors.username}
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            variant="primary"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <CircularProgress className="text-white" />
                            ) : (
                              t("send_reset_link")
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>

                  {/* Patient Login */}
                  <TabsContent value="patient">
                    <form onSubmit={handlePatientLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phone_number")}</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            +91
                          </span>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            disabled={isOtpSent}
                            className="pl-12"
                            placeholder="Enter 10 digit number"
                          />
                        </div>
                        {otpError && (
                          <p className="text-sm text-red-500">{otpError}</p>
                        )}
                      </div>

                      {isOtpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="otp">{t("enter_otp")}</Label>
                          <Input
                            id="otp"
                            name="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              setOtp(e.target.value);
                              setOtpValidationError("");
                            }}
                            maxLength={5}
                            placeholder="Enter 5-digit OTP"
                          />
                          {otpValidationError && (
                            <p className="text-sm text-red-500">
                              {otpValidationError}
                            </p>
                          )}
                          <Button
                            variant="link"
                            type="button"
                            onClick={() => {
                              setIsOtpSent(false);
                              setOtpError("");
                              setOtpValidationError("");
                            }}
                            className="px-0"
                          >
                            {t("change_phone_number")}
                          </Button>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        variant="primary"
                        disabled={
                          loading ||
                          !phone ||
                          phone.length !== 10 ||
                          (isOtpSent && otp.length !== 5)
                        }
                      >
                        {loading ? (
                          <CircularProgress className="text-white" />
                        ) : isOtpSent ? (
                          t("verify_otp")
                        ) : (
                          t("send_otp")
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <LanguageSelectorLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
