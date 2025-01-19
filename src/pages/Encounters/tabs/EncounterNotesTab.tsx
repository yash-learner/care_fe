import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Info,
  Loader2,
  MessageCircle,
  MessageSquarePlus,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/ui/markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar } from "@/components/Common/Avatar";
import Loading from "@/components/Common/Loading";

import useAuthUser from "@/hooks/useAuthUser";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import { PaginatedResponse } from "@/Utils/request/types";
import { EncounterTabProps } from "@/pages/Encounters/EncounterShow";
import { Message } from "@/types/notes/messages";
import { Thread } from "@/types/notes/threads";

const MESSAGES_LIMIT = 20;

// Thread templates for quick selection
const threadTemplates = [
  "Treatment Plan",
  "Medication Notes",
  "Care Coordination",
  "General Notes",
  "Patient History",
  "Referral Notes",
  "Lab Results Discussion",
] as const;

// Component to display loading skeleton for messages
const MessageSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 rounded-lg bg-gray-100 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Info tooltip component for help text
const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-500 hover:text-primary cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Thread item component
const ThreadItem = ({
  thread,
  isSelected,
  onClick,
}: {
  thread: Thread;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "group relative w-full p-4 text-left rounded-lg transition-colors border ",
      isSelected
        ? "bg-primary-100 hover:bg-primary/15 border-primary"
        : "hover:bg-gray-100 hover:border-gray-200",
    )}
    onClick={onClick}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{thread.title}</h4>
        {/* Todo: Replace with thread.created */}
        <p className="text-xs text-gray-500 mt-1">12/12/2024</p>
      </div>
      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mt-1.5" />
      )}
    </div>
  </button>
);

// Message item component
const MessageItem = ({ message }: { message: Message }) => {
  const authUser = useAuthUser();
  const isCurrentUser = authUser?.external_id === message.created_by.id;

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in-0 slide-in-from-bottom-4",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] items-start gap-3",
          isCurrentUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex">
                <Avatar
                  name={message.created_by.username}
                  imageUrl={message.created_by.profile_picture_url}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message.created_by.username}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div
          className={cn(
            "flex flex-col",
            isCurrentUser ? "items-end" : "items-start",
          )}
        >
          <span className="text-xs text-gray-500 mb-1">
            {message.created_by.username}
          </span>
          <div
            className={cn(
              "p-3 rounded-lg break-words",
              isCurrentUser
                ? "bg-primary-100 text-white rounded-br-none"
                : "bg-gray-100 rounded-bl-none",
            )}
          >
            {message.message && (
              <div className="mt-4">
                <Markdown content={message.message} className="text-sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New thread dialog component
const NewThreadDialog = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  isCreating: boolean;
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTitle("");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("encounter_notes__start_new_discussion")}
            <InfoTooltip content={t("encounter_notes__create_discussion")} />
          </DialogTitle>
          <DialogDescription className="text-sm text-left">
            {t("encounter_notes__choose_template")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {threadTemplates.map((template) => (
              <Badge
                key={template}
                variant="primary"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setTitle(template)}
              >
                {template}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              placeholder={t("encounter_notes__enter_discussion_title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => onCreate(title)}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MessageSquarePlus className="h-4 w-4 mr-2" />
            )}
            {t("Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Mobile navigation component
const MobileNav = ({
  threadsCount,
  onOpenThreads,
  onNewThread,
}: {
  threadsCount: number;
  onOpenThreads: () => void;
  onNewThread: () => void;
}) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white p-2 flex items-center justify-around z-50 divide-x">
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpenThreads}
      className="flex-1 flex flex-col items-center gap-1 h-auto py-2 rounded-none"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-xs">Threads ({threadsCount})</span>
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={onNewThread}
      className="flex-1 flex flex-col items-center gap-1 h-auto py-2 rounded-none"
    >
      <MessageSquarePlus className="h-5 w-5" />
      <span className="text-xs">New Thread</span>
    </Button>
  </div>
);

// Main component
export const EncounterNotesTab = ({ encounter }: EncounterTabProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [isThreadsExpanded, setIsThreadsExpanded] = useState(false);
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  // Fetch threads
  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ["threads", encounter.id],
    queryFn: query(routes.notes.patient.listThreads, {
      pathParams: { patientId: encounter.patient.id },
      queryParams: { encounter: encounter.id },
    }),
  });

  // Auto-select first thread
  useEffect(() => {
    if (threadsData?.results.length && !selectedThread) {
      setSelectedThread(threadsData.results[0].id);
    }
  }, [threadsData, selectedThread]);

  // Fetch messages with infinite scroll
  const {
    data: messagesData,
    isLoading: messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse<Message>>({
    queryKey: ["messages", selectedThread],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await query(routes.notes.patient.getMessages, {
        pathParams: {
          patientId: encounter.patient.id,
          threadId: selectedThread!,
        },
        queryParams: {
          limit: String(MESSAGES_LIMIT),
          offset: String(pageParam),
        },
      })({ signal: new AbortController().signal });
      return response as PaginatedResponse<Message>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * MESSAGES_LIMIT;
      return currentOffset < lastPage.count ? currentOffset : null;
    },
    enabled: !!selectedThread,
  });

  // Create thread mutation
  const createThreadMutation = useMutation({
    mutationFn: mutate(routes.notes.patient.createThread, {
      pathParams: { patientId: encounter.patient.id },
    }),
    onSuccess: (newThread) => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      setShowNewThreadDialog(false);
      setSelectedThread((newThread as Thread).id);
      toast.success(t("encounter_notes__thread_created"));
    },
    onError: () => {
      toast.error(t("encounter_notes__failed_create_thread"));
    },
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: mutate(routes.notes.patient.postMessage, {
      pathParams: {
        patientId: encounter.patient.id,
        threadId: selectedThread!,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedThread] });
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: () => {
      toast.error(t("Failed to send message"));
    },
  });

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Scroll to bottom on initial load and thread change
  useEffect(() => {
    if (messagesData && !messagesLoading && !isFetchingNextPage) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [selectedThread, messagesData, messagesLoading, isFetchingNextPage]);

  const handleCreateThread = (title: string) => {
    if (title.trim()) {
      createThreadMutation.mutate({
        title: title.trim(),
        encounter: encounter.id,
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedThread) {
      createMessageMutation.mutate({ message: newMessage.trim() });
    }
  };

  if (threadsLoading) {
    return <Loading />;
  }

  const messages = messagesData?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">
                {t("encounter_notes__discussions")}
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewThreadDialog(true)}
              className="h-8"
            >
              <Plus className="h-4 w-4" />
              {t("encounter_notes__new")}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {threadsData?.results.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquarePlus className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {t("encounter_notes__no_discussions")}
                </p>
              </div>
            ) : (
              threadsData?.results.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                  isSelected={selectedThread === thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isThreadsExpanded} onOpenChange={setIsThreadsExpanded}>
        <SheetContent side="left" className="w-[100%] sm:w-[380px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">
                    {t("encounter_notes__all_discussions")}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewThreadDialog(true);
                    setIsThreadsExpanded(false);
                  }}
                  className="h-8 hidden lg:block"
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  {t("encounter_notes__new")}
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {threadsData?.results.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquarePlus className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      {t("encounter_notes__no_discussions")}
                    </p>
                  </div>
                ) : (
                  threadsData?.results.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      isSelected={selectedThread === thread.id}
                      onClick={() => {
                        setSelectedThread(thread.id);
                        setIsThreadsExpanded(false);
                      }}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col h-full pb-[60px] lg:pb-0">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b bg-background sticky top-0 z-10">
            {selectedThread ? (
              <div className="flex items-center gap-3">
                <h2 className="text-base font-medium truncate flex-1">
                  {
                    threadsData?.results.find((t) => t.id === selectedThread)
                      ?.title
                  }
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{messages.length}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm font-medium text-gray-500">
                {t("encounter_notes__select_create_thread")}
              </div>
            )}
          </div>

          {selectedThread ? (
            <>
              {messagesLoading ? (
                <div className="flex-1 p-4">
                  <MessageSkeleton />
                </div>
              ) : (
                <>
                  {/* Messages List */}
                  <ScrollArea className="flex-1 px-4">
                    <div className="flex flex-col-reverse py-4">
                      <div ref={messagesEndRef} />
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquarePlus className="h-8 w-8 text-primary mx-auto mb-4" />
                          <p className="text-sm font-medium">
                            {t("encounter_notes__start_conversation")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {t("encounter_notes__be_first_to_send")}
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <MessageItem key={message.id} message={message} />
                        ))
                      )}
                      {isFetchingNextPage && (
                        <div className="py-2">
                          <MessageSkeleton />
                        </div>
                      )}
                      <div ref={ref} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t bg-background p-4 sticky bottom-0">
                    <form onSubmit={handleSendMessage}>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder={t("encounter_notes__type_message")}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (newMessage.trim()) {
                                handleSendMessage(e);
                              }
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={
                            !newMessage.trim() ||
                            createMessageMutation.isPending
                          }
                          className="h-10 w-10 shrink-0"
                        >
                          {createMessageMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <MessageSquarePlus className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {t("encounter_notes__welcome")}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                {t("encounter_notes__welcome_description")}
              </p>
              <Button
                onClick={() => setShowNewThreadDialog(true)}
                className="shadow-lg"
              >
                <MessageSquarePlus className="h-5 w-5 mr-2" />
                {t("encounter_notes__start_new_discussion")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        threadsCount={threadsData?.results.length || 0}
        onOpenThreads={() => setIsThreadsExpanded(true)}
        onNewThread={() => setShowNewThreadDialog(true)}
      />

      <NewThreadDialog
        isOpen={showNewThreadDialog}
        onClose={() => setShowNewThreadDialog(false)}
        onCreate={handleCreateThread}
        isCreating={createThreadMutation.isPending}
      />
    </div>
  );
};
