import { CaretDownIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar } from "@/components/Common/Avatar";

import useDebouncedState from "@/hooks/useDebouncedState";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { formatName } from "@/Utils/utils";
import { UserBase } from "@/types/user/user";

interface Props {
  selected?: UserBase;
  onChange: (user: UserBase) => void;
  placeholder?: string;
  noOptionsMessage?: string;
}

export default function UserSelector({
  selected,
  onChange,
  placeholder,
  noOptionsMessage,
}: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useDebouncedState("", 500);

  const { data, isFetching } = useQuery({
    queryKey: ["users", search],
    queryFn: query(routes.user.list, {
      queryParams: { search },
    }),
  });

  const users = data?.results || [];

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="min-w-60 justify-start"
        >
          {selected ? (
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={selected.profile_picture_url}
                name={formatName(selected)}
                className="size-6 rounded-full"
              />
              <span>{formatName(selected)}</span>
            </div>
          ) : (
            <span>{placeholder || t("select_user")}</span>
          )}
          <CaretDownIcon className="ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t("search")}
            onValueChange={setSearch}
            className="outline-none border-none ring-0 shadow-none"
          />
          <CommandList>
            <CommandEmpty>
              {isFetching
                ? t("searching")
                : noOptionsMessage || t("no_results")}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user: UserBase) => (
                <CommandItem
                  key={user.id}
                  value={formatName(user)}
                  onSelect={() => onChange(user)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      imageUrl={user.profile_picture_url}
                      name={formatName(user)}
                      className="size-6 rounded-full"
                    />
                    <span>{formatName(user)}</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {user.username}
                    </span>
                  </div>
                  {selected?.id === user.id && (
                    <CheckIcon className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
