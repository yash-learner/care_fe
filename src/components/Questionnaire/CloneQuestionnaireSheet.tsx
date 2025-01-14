import { useMutation, useQuery } from "@tanstack/react-query";
import { Building, Check, Loader2 } from "lucide-react";
import { useNavigate } from "raviger";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import organizationApi from "@/types/organization/organizationApi";
import type { QuestionnaireDetail } from "@/types/questionnaire/questionnaire";
import questionnaireApi from "@/types/questionnaire/questionnaireApi";

interface Props {
  questionnaire: QuestionnaireDetail;
  trigger?: React.ReactNode;
}

export default function CloneQuestionnaireSheet({
  questionnaire,
  trigger,
}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newSlug, setNewSlug] = useState(questionnaire.slug + "-copy");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: availableOrganizations, isLoading: isLoadingOrganizations } =
    useQuery({
      queryKey: ["organizations", searchQuery],
      queryFn: query(organizationApi.list, {
        queryParams: {
          org_type: "role",
          name: searchQuery || undefined,
        },
      }),
      enabled: open,
    });

  const { mutate: cloneQuestionnaire, isPending: isCloning } = useMutation({
    mutationFn: mutate(questionnaireApi.create, {
      silent: true,
    }),
    onSuccess: async (data: QuestionnaireDetail) => {
      navigate(`/questionnaire/${data.slug}`);
      setOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        setError("This slug is already in use. Please choose a different one.");
      } else {
        setError("Failed to clone questionnaire. Please try again.");
      }
    },
  });

  const handleClone = () => {
    if (!newSlug.trim()) {
      setError("Slug is required");
      return;
    }

    const clonedQuestionnaire = {
      ...questionnaire,
      slug: newSlug.trim(),
      id: undefined,
      status: "draft" as const,
      title: `${questionnaire.title} (Clone)`,
      organizations: selectedIds,
    };

    cloneQuestionnaire(clonedQuestionnaire);
  };

  const handleToggleOrganization = (orgId: string) => {
    setSelectedIds((current) =>
      current.includes(orgId)
        ? current.filter((id) => id !== orgId)
        : [...current, orgId],
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Clone Questionnaire</SheetTitle>
          <SheetDescription>
            Create a copy of this questionnaire with a new slug and select
            organizations.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Slug Input */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={newSlug}
              onChange={(e) => {
                setNewSlug(e.target.value);
                setError(null);
              }}
              placeholder="Enter a unique slug"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Selected Organizations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Selected Organizations</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIds.length > 0 ? (
                availableOrganizations?.results
                  .filter((org) => selectedIds.includes(org.id))
                  .map((org) => (
                    <Badge
                      key={org.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {org.name}
                    </Badge>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No organizations selected
                </p>
              )}
            </div>
          </div>

          {/* Organization Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add Organizations</h3>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search organizations..."
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No organizations found.</CommandEmpty>
                <CommandGroup>
                  {isLoadingOrganizations ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    availableOrganizations?.results.map((org) => (
                      <CommandItem
                        key={org.id}
                        value={org.id}
                        onSelect={() => handleToggleOrganization(org.id)}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{org.name}</span>
                          {org.description && (
                            <span className="text-xs text-muted-foreground">
                              - {org.description}
                            </span>
                          )}
                        </div>
                        {selectedIds.includes(org.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <div className="flex w-full justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setNewSlug(questionnaire.slug + "-copy");
                setSelectedIds([]);
                setError(null);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClone}
              disabled={isCloning || !newSlug.trim()}
            >
              {isCloning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cloning...
                </>
              ) : (
                "Clone"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
