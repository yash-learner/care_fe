import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/input-password";

import { validateRule } from "@/components/Users/UserFormValidations";
import { UpdatePasswordForm } from "@/components/Users/models";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import { UserBase } from "@/types/user/user";

export default function UserResetPassword({
  userData,
}: {
  userData: UserBase;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);

  const PasswordSchema = z
    .object({
      old_password: z
        .string()
        .min(1, { message: t("please_enter_current_password") }),
      new_password_1: z
        .string()
        .min(8, { message: t("invalid_password") })
        .regex(/\d/, { message: t("invalid_password") })
        .regex(/[a-z]/, {
          message: t("invalid_password"),
        })
        .regex(/[A-Z]/, {
          message: t("invalid_password"),
        }),
      new_password_2: z
        .string()
        .min(1, { message: t("please_enter_confirm_password") }),
    })
    .refine((values) => values.new_password_1 === values.new_password_2, {
      message: t("password_mismatch"),
      path: ["new_password_2"],
    })
    .refine((values) => values.new_password_1 !== values.old_password, {
      message: t("new_password_same_as_old"),
      path: ["new_password_1"],
    });

  const form = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      old_password: "",
      new_password_1: "",
      new_password_2: "",
    },
  });
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: mutate(routes.updatePassword),
    onSuccess: () => {
      toast.success(t("password_updated"));
      form.reset();
    },
  });

  const handleSubmitPassword = async (
    formData: z.infer<typeof PasswordSchema>,
  ) => {
    const form: UpdatePasswordForm = {
      old_password: formData.old_password,
      username: userData.username,
      new_password: formData.new_password_1,
    };
    resetPassword(form);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
      {!isEditing && (
        <div className="mb-4 flex justify-start">
          <Button
            onClick={() => setIsEditing(true)}
            type="button"
            id="change-edit-password-button"
            variant="primary"
          >
            <CareIcon
              icon={isEditing ? "l-times" : "l-edit"}
              className="h-4 w-4"
            />
            {t("update_password")}
          </Button>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitPassword)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("old_password")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="new_password_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("new_password")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          onFocus={() => setIsPasswordFieldFocused(true)}
                          onBlur={() => setIsPasswordFieldFocused(false)}
                        />
                      </FormControl>
                      {isPasswordFieldFocused ? (
                        <div
                          className="text-small mt-2 pl-2 text-secondary-500"
                          aria-live="polite"
                        >
                          {validateRule(
                            field.value.length >= 8,
                            t("password_length_validation"),
                            !field.value,
                            t("password_length_met"),
                          )}
                          {validateRule(
                            /[a-z]/.test(field.value),
                            t("password_lowercase_validation"),
                            !field.value,
                            t("password_lowercase_met"),
                          )}
                          {validateRule(
                            /[A-Z]/.test(field.value),
                            t("password_uppercase_validation"),
                            !field.value,
                            t("password_uppercase_met"),
                          )}
                          {validateRule(
                            /\d/.test(field.value),
                            t("password_number_validation"),
                            !field.value,
                            t("password_number_met"),
                          )}
                          {validateRule(
                            field.value !== form.watch("old_password"),
                            t("new_password_same_as_old"),
                            !field.value,
                            t("new_password_different_from_old"),
                          )}
                        </div>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("new_password_confirmation")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
                variant="secondary"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty}
                variant="primary"
              >
                {isPending ? t("updating") : t("update_password")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
