import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import Autocomplete from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import InputWithError from "@/components/ui/input-with-error";

import { ORGANISATION_LEVELS } from "@/common/constants";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import {
  Organization,
  OrganizationResponse,
  getOrgLevel,
} from "@/types/organisation/organisation";

interface OrganisationSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

interface AutoCompleteOption {
  label: string;
  value: string;
}

export default function OrganisationSelector(props: OrganisationSelectorProps) {
  const { value, onChange, required } = props;
  const [selectedLevels, setSelectedLevels] = useState<Organization[]>([]);

  const { data: organization } = useQuery<Organization>({
    queryKey: ["organisation", value],
    queryFn: query(routes.organisation.get, {
      pathParams: { id: value || "" },
    }),
    enabled: !!value,
  });

  const { data: getAllOrganizations } = useQuery<OrganizationResponse>({
    queryKey: ["organisations-root"],
    queryFn: query(routes.organisation.list, {
      queryParams: {
        org_type: "govt",
        parent: undefined,
      },
    }),
  });

  const { data: currentLevelOrganizations } = useQuery<{
    results: Organization[];
  }>({
    queryKey: [
      "organisations-current",
      selectedLevels[selectedLevels.length - 1]?.id,
    ],
    queryFn: query(routes.organisation.list, {
      queryParams: {
        parent: selectedLevels[selectedLevels.length - 1]?.id,
        org_type: "govt",
      },
    }),
    enabled: selectedLevels.length > 0,
  });

  useEffect(() => {
    if (organization) {
      const fetchParentChain = async () => {
        const chain: Organization[] = [];
        let current = organization;
        while (current.parent) {
          const parent = await query(routes.organisation.get, {
            pathParams: { id: current.parent.id },
          })({ signal: new AbortController().signal });
          chain.unshift(parent);
          current = parent;
        }

        setSelectedLevels(chain);
      };
      fetchParentChain();
    }
  }, [organization]);

  const handleLevelChange = (value: string, level: number) => {
    const orgList =
      level === 0
        ? getAllOrganizations?.results
        : currentLevelOrganizations?.results;

    const selectedOrg = orgList?.find((org) => org.id === value);
    if (!selectedOrg) return;

    const newLevels = selectedLevels.slice(0, level);
    newLevels.push(selectedOrg);
    setSelectedLevels(newLevels);

    if (!selectedOrg.has_children) {
      onChange(selectedOrg.id);
    }
  };

  const getOrganizationOptions = (
    orgs?: Organization[],
  ): AutoCompleteOption[] => {
    if (!orgs) return [];
    return orgs.map((org) => ({
      label: org.name,
      value: org.id,
    }));
  };

  const getLevelLabel = (org: Organization) => {
    const orgLevel = getOrgLevel(org.org_type, org.level_cache);
    return typeof orgLevel === "string" ? orgLevel : orgLevel[0];
  };

  const handleEdit = (level: number) => {
    setSelectedLevels((prev) => prev.slice(0, level));
  };

  return (
    <div className="space-y-4">
      {/* Selected Levels */}
      {selectedLevels.map((level, index) => (
        <InputWithError
          key={level.id}
          label={
            index === 0 ? ORGANISATION_LEVELS.govt[0] : getLevelLabel(level)
          }
          required={index === 0 && required}
        >
          <div className="flex gap-2">
            <div className="flex-1 p-2 border rounded-md bg-muted">
              {level.name}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(index)}
              type="button"
            >
              <CareIcon icon="l-pen" className="h-4 w-4" />
            </Button>
          </div>
        </InputWithError>
      ))}

      {/* Next Level Selection */}
      {ORGANISATION_LEVELS.govt[selectedLevels.length] && (
        <InputWithError
          label={ORGANISATION_LEVELS.govt[selectedLevels.length]}
          required={selectedLevels.length === 0 && required}
        >
          <Autocomplete
            value=""
            options={getOrganizationOptions(
              selectedLevels.length === 0
                ? getAllOrganizations?.results
                : currentLevelOrganizations?.results,
            )}
            onChange={(value: string) =>
              handleLevelChange(value, selectedLevels.length)
            }
          />
        </InputWithError>
      )}
    </div>
  );
}
