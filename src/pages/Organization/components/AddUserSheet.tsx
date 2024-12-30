import { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import UserAddEditForm from "@/components/Users/UserAddEditForm";
import { UserForm } from "@/components/Users/UserFormValidations";

interface Props {
  organizationId: string;
}

export default function AddUserSheet({ organizationId }: Props) {
  const [open, setOpen] = useState(false);

  // Fields required for adding a new user
  const includedFields: Array<keyof UserForm> = [
    "user_type",
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "alt_phone_number",
    "phone_number_is_whatsapp",
    "date_of_birth",
    "gender",
    "username",
    "password",
    "c_password",
    "qualification",
    "doctor_experience_commenced_on",
    "doctor_medical_council_registration",
    "weekly_working_hours",
    "video_connect_link",
    "geo_organization",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <CareIcon icon="l-plus" className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Create a new user and add them to the organization.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <UserAddEditForm
            includedFields={includedFields}
            onSubmitSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
