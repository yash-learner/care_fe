import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar } from "@/components/Common/Avatar";
import { UserStatusIndicator } from "@/components/Users/UserListAndCard";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import { FacilityOrganizationUserRole } from "@/types/facilityOrganization/facilityOrganization";

interface Props {
  facilityId: string;
  organizationId: string;
  userRole: FacilityOrganizationUserRole;
  trigger?: React.ReactNode;
}

export default function EditUserRoleSheet({
  facilityId,
  organizationId,
  userRole,
  trigger,
}: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(userRole.role.id);
  const { t } = useTranslation();

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: query(routes.role.list),
    enabled: open,
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: (body: { user: string; role: string }) =>
      mutate(routes.facilityOrganization.updateUserRole, {
        pathParams: {
          facilityId,
          organizationId: organizationId,
          userRoleId: userRole.id,
        },
        body,
      })(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["facilityOrganizationUsers", facilityId, organizationId],
      });
      toast.success(t("user_role_update_success"));
      setOpen(false);
    },
    onError: (error) => {
      const errorData = error.cause as { errors: { msg: string[] } };
      errorData.errors.msg.forEach((er) => {
        toast.error(er);
      });
    },
  });

  const { mutate: removeRole } = useMutation({
    mutationFn: () =>
      mutate(routes.facilityOrganization.removeUserRole, {
        pathParams: {
          facilityId,
          organizationId: organizationId,
          userRoleId: userRole.id,
        },
      })({}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["facilityOrganizationUsers", facilityId, organizationId],
      });
      toast.success(t("user_removed_success"));
      setOpen(false);
    },
    onError: (error) => {
      const errorData = error.cause as { errors: { msg: string[] } };
      errorData.errors.msg.forEach((er) => {
        toast.error(er);
      });
    },
  });

  const handleUpdateRole = () => {
    if (selectedRole === userRole.role.id) {
      toast.error(t("select_diff_role"));
      return;
    }

    updateRole({
      user: userRole.user.id,
      role: selectedRole,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || <Button variant="outline">{t("edit_role")}</Button>}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("edit_user_role")}</SheetTitle>
          <SheetDescription>
            {t("update_user_role_organization")}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar
                name={`${userRole.user.first_name} ${userRole.user.last_name}`}
                className="h-12 w-12"
                imageUrl={userRole.user.profile_picture_url}
              />
              <div className="flex flex-col flex-1">
                <span className="font-medium text-lg">
                  {userRole.user.first_name} {userRole.user.last_name}
                </span>
                <span className="text-sm text-gray-500">
                  {userRole.user.email}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <span className="text-sm text-gray-500">{t("username")}</span>
                <p className="text-sm font-medium">{userRole.user.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {t("current_role")}
                </span>
                <p className="text-sm font-medium">{userRole.role.name}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500">
                  {t("last_login")}{" "}
                </span>
                <UserStatusIndicator user={userRole.user} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("select_new_role")}
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t("select_role")} />
              </SelectTrigger>
              <SelectContent>
                {roles?.results?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col text-left">
                      <span>{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-gray-500">
                          {role.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleUpdateRole}
              disabled={selectedRole === userRole.role.id}
            >
              {t("update_role")}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  {t("remove_user")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("remove_user_organization")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("remove_user_warn", {
                      firstName: userRole.user.first_name,
                      lastName: userRole.user.last_name,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeRole()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("remove")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
