import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Hash, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { QuestionnaireDetail } from "@/types/questionnaire/questionnaire";
import questionnaireApi from "@/types/questionnaire/questionnaireApi";
import { QuestionnaireTagModel } from "@/types/questionnaire/tags";

interface Props {
  questionnaire: QuestionnaireDetail;
  trigger?: React.ReactNode;
}

export default function ManageQuestionnaireTagsSheet({
  questionnaire,
  trigger,
}: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagSlug, setNewTagSlug] = useState("");

  const { data: availableTags, isLoading } = useQuery({
    queryKey: ["questionnaire_tags"],
    queryFn: query(questionnaireApi.tags.list),
    enabled: open,
  });

  const { mutate: setTags, isPending: isUpdating } = useMutation({
    mutationFn: mutate(questionnaireApi.setTags, {
      pathParams: { slug: questionnaire.slug },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questionnaire", questionnaire.slug],
      });
      toast.success("Tags updated successfully");
      setOpen(false);
    },
  });

  const { mutate: createTag, isPending: isCreating } = useMutation({
    mutationFn: mutate(questionnaireApi.tags.create),
    onSuccess: (data: unknown) => {
      const tagData = data as QuestionnaireTagModel;
      queryClient.invalidateQueries({
        queryKey: ["questionnaire_tags"],
      });
      setSelectedSlugs((current) => [...current, tagData.slug]);
      setNewTagName("");
      setNewTagSlug("");
      setIsCreateOpen(false);
      toast.success("Tag created successfully");
    },
  });

  // Initialize selected slugs from questionnaire tags
  useEffect(() => {
    if (questionnaire.tags) {
      setSelectedSlugs(questionnaire.tags.map((tag) => tag.slug));
    }
  }, [questionnaire.tags]);

  const handleToggleTag = (tagSlug: string) => {
    setSelectedSlugs((current) =>
      current.includes(tagSlug)
        ? current.filter((slug) => slug !== tagSlug)
        : [...current, tagSlug],
    );
  };

  const handleSave = () => {
    setTags({ tags: selectedSlugs });
  };

  const handleCreateTag = () => {
    if (!newTagName.trim() || !newTagSlug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    createTag({
      name: newTagName.trim(),
      slug: newTagSlug.trim(),
    });
  };

  const selectedTags = availableTags?.results.filter((tag) =>
    selectedSlugs.includes(tag.slug),
  );

  const hasChanges =
    new Set(questionnaire.tags.map((tag) => tag.slug)).size !==
      new Set(selectedSlugs).size ||
    !questionnaire.tags.every((tag) => selectedSlugs.includes(tag.slug));

  const filteredTags = availableTags?.results.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Hash className="mr-2 h-4 w-4" />
            {t("manage_tags")}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("manage_tags")}</SheetTitle>
          <SheetDescription>{t("manage_tags_description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Selected Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("selected_tags")}</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags?.map((tag) => (
                <Badge
                  key={tag.slug}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleToggleTag(tag.slug)}
                    disabled={isUpdating}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {!isLoading && (!selectedTags || selectedTags.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  {t("no_tags_selected")}
                </p>
              )}
            </div>
          </div>

          {/* Tag Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("add_tags")}</h3>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder={t("search_tags")}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>{t("no_tags_found")}</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    filteredTags?.map((tag) => (
                      <CommandItem
                        key={tag.slug}
                        value={tag.slug}
                        onSelect={() => handleToggleTag(tag.slug)}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <span>{tag.name}</span>
                        </div>
                        {selectedSlugs.includes(tag.slug) && (
                          <Check className="h-4 w-4" />
                        )}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Create New Tag */}
          <Collapsible
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            className="rounded-lg border p-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{t("create_new_tag")}</span>
                </div>
                <CareIcon
                  icon={isCreateOpen ? "l-angle-up" : "l-angle-down"}
                  className="h-4 w-4"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">{t("tag_name")}</Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={t("enter_tag_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-slug">{t("tag_slug")}</Label>
                <Input
                  id="tag-slug"
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(e.target.value)}
                  placeholder={t("enter_tag_slug")}
                />
              </div>
              <Button
                onClick={handleCreateTag}
                disabled={isCreating || !newTagName || !newTagSlug}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  t("create_tag")
                )}
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <div className="flex w-full justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSlugs(questionnaire.tags.map((tag) => tag.slug));
                setOpen(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isUpdating || !hasChanges}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
