import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Autocomplete from "@/components/ui/autocomplete";
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

  const { data: organizations } = useQuery<{ results: Organization[] }>({
    queryKey: ["organisations", selectedLevels[selectedLevels.length - 1]?.id],
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
            pathParams: { id: current.parent },
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
    const selectedOrg = (
      level === 0 ? getAllOrganizations?.results : organizations?.results
    )?.find((org) => org.id === value);

    if (!selectedOrg) return;

    // Remove all levels after the current level
    const newLevels = selectedLevels.slice(0, level);

    // Add the new selection
    newLevels.push(selectedOrg);

    setSelectedLevels(newLevels);

    // If the organization has no children, trigger the final onChange
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

  return (
    <div className="space-y-4">
      {/* First level selection */}
      <InputWithError
        label={
          selectedLevels[0]
            ? ORGANISATION_LEVELS.govt[selectedLevels[0].level_cache]
            : ORGANISATION_LEVELS.govt[0]
        }
        required={required}
      >
        <Autocomplete
          value={selectedLevels[0]?.id || ""}
          options={getOrganizationOptions(getAllOrganizations?.results)}
          onChange={(value: string) => handleLevelChange(value, 0)}
        />
      </InputWithError>

      {/* Subsequent levels */}
      {selectedLevels.slice(1).map((level) => (
        <InputWithError key={level.id} label={getLevelLabel(level)}>
          <Autocomplete
            value={level.id}
            options={getOrganizationOptions(organizations?.results)}
            onChange={(value: string) =>
              handleLevelChange(value, level.level_cache)
            }
          />
        </InputWithError>
      ))}

      {/* Next level selection if available */}
      {organizations?.results &&
        organizations.results.length > 0 &&
        selectedLevels.length > 0 && (
          <InputWithError
            label={ORGANISATION_LEVELS.govt[selectedLevels.length]}
          >
            <Autocomplete
              value=""
              options={getOrganizationOptions(organizations.results)}
              onChange={(value: string) =>
                handleLevelChange(value, selectedLevels.length)
              }
            />
          </InputWithError>
        )}
    </div>
  );
}
