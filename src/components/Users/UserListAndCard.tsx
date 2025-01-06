import { navigate } from "raviger";
import { useTranslation } from "react-i18next";

import Card from "@/CAREUI/display/Card";
import CareIcon from "@/CAREUI/icons/CareIcon";

import { Avatar } from "@/components/Common/Avatar";
import Tabs from "@/components/Common/Tabs";
import SearchInput from "@/components/Form/SearchInput";

import useAuthUser from "@/hooks/useAuthUser";
import useSlug from "@/hooks/useSlug";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { USER_TYPE_OPTIONS } from "@/common/constants";

import {
  classNames,
  formatName,
  isUserOnline,
  relativeTime,
} from "@/Utils/utils";
import { UserBase } from "@/types/user/user";

export const GetUserTypes = () => {
  const authUser = useAuthUser();
  const defaultAllowedUserTypes = USER_TYPE_OPTIONS;

  // Superuser gets all options
  if (authUser.is_superuser) {
    return [...USER_TYPE_OPTIONS];
  }

  switch (authUser.user_type) {
    // case "StaffReadOnly":
    //   return readOnlyUsers.slice(0, 1);
    // case "DistrictReadOnlyAdmin":
    //   return readOnlyUsers.slice(0, 2);
    // case "StateReadOnlyAdmin":
    //   return readOnlyUsers.slice(0, 3);
    // case "Pharmacist":
    //   return USER_TYPE_OPTIONS.slice(0, 1);
    // case "Nurse":
    // case "Staff":
    //   if (editForm) return [...defaultAllowedUserTypes];
    //   // Temporarily allows creation of users with elevated permissions due to introduction of new roles.
    //   return [...defaultAllowedUserTypes, USER_TYPE_OPTIONS[6]];
    default:
  }
  return defaultAllowedUserTypes;
};
const GetDetailsButton = (username: string) => {
  const { t } = useTranslation();
  const facilityId = useSlug("facility");
  return (
    <div className="grow">
      <button
        id={`more-details-${username}`}
        onClick={() => navigate(`/facility/${facilityId}/users/${username}`)}
        className="flex flex-grow-0 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs hover:bg-gray-200"
      >
        <CareIcon icon="l-arrow-up-right" className="text-lg" />
        <span>{t("more_details")}</span>
      </button>
    </div>
  );
};
const getNameAndStatusCard = (
  user: UserBase,
  cur_online: boolean,
  showDetailsButton = false,
) => {
  return (
    <div>
      <div className="flex flex-row justify-between gap-x-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-3">
            <h1 id={`name-${user.username}`} className="text-base font-bold">
              {formatName(user)}
            </h1>
            <div
              className={classNames(
                "flex items-center gap-2 rounded-full px-3 py-1",
                cur_online ? "bg-green-100" : "bg-gray-100",
              )}
            >
              <UserStatusIndicator user={user} />
            </div>
          </div>
          <span
            className="text-sm text-gray-500"
            id={`username-${user.username}`}
          >
            {user.username}
          </span>
        </div>
        <div>{showDetailsButton && GetDetailsButton(user.username)}</div>
      </div>
    </div>
  );
};

export const UserStatusIndicator = ({
  user,
  className,
  addPadding = false,
}: {
  user: UserBase;
  className?: string;
  addPadding?: boolean;
}) => {
  const authUser = useAuthUser();
  const isAuthUser = user.id === authUser.external_id;
  const isOnline = isUserOnline(user) || isAuthUser;
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        "inline-flex items-center gap-2 rounded-full",
        addPadding ? "px-3 py-1" : "py-px",
        isOnline ? "bg-green-100" : "bg-gray-100",
        className,
      )}
    >
      <span
        className={classNames(
          "inline-block h-2 w-2 shrink-0 rounded-full",
          isOnline ? "bg-green-500" : "bg-gray-400",
        )}
      ></span>
      <span
        className={classNames(
          "whitespace-nowrap text-xs",
          isOnline ? "text-green-700" : "text-gray-500",
        )}
      >
        {isOnline
          ? t("online")
          : user.last_login
            ? relativeTime(user.last_login)
            : t("never")}
      </span>
    </div>
  );
};
const UserCard = ({ user }: { user: UserBase }) => {
  const userOnline = isUserOnline(user);
  const { width } = useWindowDimensions();
  const mediumScreenBreakpoint = 640;
  const isMediumScreen = width <= mediumScreenBreakpoint;
  const isLessThanXLargeScreen = width <= 1280;
  const { t } = useTranslation();

  return (
    <Card
      key={`usr_${user.id}`}
      id={`usr_${user.id}`}
      className="relative h-full"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4 xl:flex-row w-full">
          <div className="flex flex-col gap-4 sm:flex-row w-full">
            <div className="flex flex-col items-center gap-4 min-[400px]:flex-row sm:items-start">
              <Avatar
                imageUrl={
                  "profile_picture_url" in user ? user.profile_picture_url : ""
                }
                name={formatName(user)}
                className="h-16 w-16 self-center text-2xl sm:self-auto"
              />
              {isMediumScreen && getNameAndStatusCard(user, userOnline)}
            </div>
            <div className="flex flex-col w-full">
              {!isMediumScreen &&
                getNameAndStatusCard(user, userOnline, !isLessThanXLargeScreen)}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="text-sm">
                  <div className="text-gray-500">{t("role")}</div>
                  <div id="role" className="font-medium">
                    {user.user_type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLessThanXLargeScreen && (
          <div className="mt-4">{GetDetailsButton(user.username)}</div>
        )}
      </div>
    </Card>
  );
};
export const UserGrid = ({ users }: { users?: UserBase[] }) => (
  <div className="grid grid-cols-1 gap-4 @xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5 lg:grid-cols-2">
    {users?.map((user) => <UserCard key={user.id} user={user} />)}
  </div>
);

const UserListHeader = ({
  showDistrictColumn,
}: {
  showDistrictColumn: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <thead>
      <tr className="bg-gray-50 text-sm font-medium text-gray-500">
        <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left">
          {t("name")}
        </th>
        <th className="w-32 px-4 py-3 text-left">{t("status")}</th>
        <th className="px-4 py-3 text-left">{t("role")}</th>
        <th className="px-4 py-3 text-left">{t("home_facility")}</th>
        {showDistrictColumn && (
          <th className="px-4 py-3 text-left">{t("district")}</th>
        )}
        <th className="px-4 py-3"></th>
      </tr>
    </thead>
  );
};

const UserListRow = ({ user }: { user: UserBase }) => {
  return (
    <tr
      key={`usr_${user.id}`}
      id={`usr_${user.id}`}
      className="hover:bg-gray-50"
    >
      <td className="sticky left-0 z-10 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            // TO do: adjust for facility users
            imageUrl={
              "profile_picture_url" in user ? user.profile_picture_url : ""
            }
            name={user.username ?? ""}
            className="h-10 w-10 text-lg"
          />
          <div className="flex flex-col">
            <h1 id={`name-${user.username}`} className="text-sm font-medium">
              {formatName(user)}
            </h1>
            <span
              id={`username-${user.username}`}
              className="text-xs text-gray-500"
            >
              @{user.username}
            </span>
          </div>
        </div>
      </td>
      <td className="flex-0 py-4">
        <UserStatusIndicator user={user} addPadding />
      </td>
      <td id="role" className="px-4 py-4 text-sm">
        {user.user_type}
      </td>
      <td className="px-4 py-4">{GetDetailsButton(user.username)}</td>
    </tr>
  );
};
export const UserList = ({ users }: { users?: UserBase[] }) => {
  const showDistrictColumn = users?.some(
    (user) => "district_object" in user || "district" in user,
  );
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="relative min-w-full divide-y divide-gray-200">
        <UserListHeader showDistrictColumn={showDistrictColumn ?? false} />
        <tbody className="divide-y divide-gray-200 bg-white">
          {users?.map((user) => <UserListRow key={user.id} user={user} />)}
        </tbody>
      </table>
    </div>
  );
};
interface UserListViewProps {
  users: UserBase[];
  onSearch: (username: string) => void;
  searchValue: string;
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export default function UserListView({
  users,
  onSearch,
  searchValue,
  activeTab,
  onTabChange,
}: UserListViewProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="sm:w-1/2">
          <SearchInput
            id="search-by-username"
            name="username"
            onChange={(e) => onSearch(e.value)}
            value={searchValue}
            placeholder={t("search_by_username")}
          />
        </div>
        <Tabs
          tabs={[
            {
              text: (
                <div className="flex items-center gap-2">
                  <CareIcon icon="l-credit-card" className="text-lg" />
                  <span>Card</span>
                </div>
              ),
              value: 0,
              id: "user-card-view",
            },
            {
              text: (
                <div className="flex items-center gap-2">
                  <CareIcon icon="l-list-ul" className="text-lg" />
                  <span>List</span>
                </div>
              ),
              value: 1,
              id: "user-list-view",
            },
          ]}
          currentTab={activeTab}
          onTabChange={(tab) => onTabChange(tab as number)}
          className="float-right"
        />
      </div>
      {users.length > 0 ? (
        <>
          {activeTab === 0 ? (
            <UserGrid users={users} />
          ) : (
            <UserList users={users} />
          )}
        </>
      ) : (
        <div className="h-full space-y-2 rounded-lg bg-white p-7 shadow">
          <div className="flex w-full items-center justify-center text-xl font-bold text-secondary-500">
            No Users Found
          </div>
        </div>
      )}
    </>
  );
}
