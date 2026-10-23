import {
  RENDER_CHAT_USER_MESSAGE_MAX_LENGTH,
  generateId,
  type RenderMessage,
  type RenderTurnResponse,
  type Uuid,
} from "@resume-optimzer-app/common";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getRenderChat, sendRenderMessage } from "@/api/render";
import { cn } from "@/lib/cn";
import { Button, Heading, Text, Textarea } from "@/ui";

const SUGGESTIONS = [
  "Make it more compact and scannable.",
  "Emphasize measurable impact and outcomes.",
  "Give it a warmer, more editorial feel.",
];

export type RenderChatPanelProps = {
  chatId: Uuid;
  onTurn: (turn: RenderTurnResponse) => void;
  onBusyChange?: (busy: boolean) => void;
};

export function RenderChatPanel({ chatId, onTurn, onBusyChange }: RenderChatPanelProps) {
  const [messages, setMessages] = useState<RenderMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    setMessages([]);
    setInput("");
    setIsLoading(true);
    setError(null);

    getRenderChat(chatId)
      .then((chat) => {
        if (!active) return;
        setMessages(chat.messages);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(toErrorMessage(loadError, "Could not load this conversation."));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [chatId]);

  useEffect(() => {
    return () => onBusyChange?.(false);
  }, [onBusyChange]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isSending, isLoading]);

  async function handleSend(content: string): Promise<void> {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    const nextSeq = messages.reduce((max, message) => Math.max(max, message.seq), 0) + 1;
    const userMessage: RenderMessage = {
      id: generateId(),
      chatId,
      seq: nextSeq,
      role: "user",
      content: trimmed,
      markup: null,
      usage: null,
      createdAt: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);
    onBusyChange?.(true);

    try {
      const turn = await sendRenderMessage(chatId, trimmed);
      const assistantMessage: RenderMessage = {
        id: generateId(),
        chatId,
        seq: nextSeq + 1,
        role: "assistant",
        content: turn.reply ?? "Updated the render.",
        markup: turn.markup,
        usage: turn.usage,
        createdAt: new Date(),
      };
      setMessages((current) => [...current, assistantMessage]);
      onTurn(turn);
    } catch (sendError) {
      setMessages((current) => current.filter((message) => message.id !== userMessage.id));
      setInput(trimmed);
      setError(toErrorMessage(sendError, "Could not update the render."));
    } finally {
      setIsSending(false);
      onBusyChange?.(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    void handleSend(input);
  }

  const canSend = input.trim().length > 0 && !isSending;

  return (
    <aside
      aria-label="Render iteration chat"
      className="flex h-[32rem] max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-ui border border-border bg-subtle lg:sticky lg:top-20 lg:h-[40rem]"
    >
      <div className="border-b border-border bg-surface px-4 py-3">
        <Heading level={4}>Iterate</Heading>
        <Text variant="subtle" className="mt-0.5">
          Ask for changes and the preview updates.
        </Text>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3"
      >
        {isLoading ? (
          <div className="grid h-full min-h-40 place-items-center">
            <Text variant="subtle">Loading conversation…</Text>
          </div>
        ) : messages.length === 0 && !isSending ? (
          <div className="grid gap-4 py-2">
            <div className="grid gap-1 px-1">
              <Text className="font-medium">Want a different feel?</Text>
              <Text variant="subtle">
                Ask for a tweak and the current render will be revised in place.
              </Text>
            </div>
            <div className="grid gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start whitespace-normal px-3 py-2 text-left text-xs font-normal leading-relaxed"
                  onClick={() => void handleSend(suggestion)}
                  disabled={isSending}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ol className="grid gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isSending ? <PendingBubble /> : null}
          </ol>
        )}
      </div>

      {error ? (
        <Text variant="subtle" className="border-t border-border bg-danger/5 px-4 py-2 text-danger">
          {error}
        </Text>
      ) : null}

      <form
        className="grid gap-2 border-t border-border bg-surface p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend(input);
        }}
      >
        <Textarea
          rows={2}
          value={input}
          maxLength={RENDER_CHAT_USER_MESSAGE_MAX_LENGTH}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for a change to this render…"
          aria-label="Message the renderer"
          className="min-h-16 resize-none"
          disabled={isLoading || isSending}
        />
        <div className="flex items-center justify-between gap-3">
          <Text variant="subtle" className="text-[11px]">
            Enter to send
          </Text>
          <Button type="submit" variant="primary" size="sm" disabled={!canSend || isLoading}>
            {isSending ? "Revising…" : "Send"}
          </Button>
        </div>
      </form>
    </aside>
  );
}

function MessageBubble({ message }: { message: RenderMessage }) {
  const isUser = message.role === "user";

  return (
    <li className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <span className="px-1 text-[11px] font-medium text-muted-foreground">
        {isUser ? "You" : "Renderer"}
      </span>
      <p
        className={cn(
          "max-w-[94%] whitespace-pre-wrap break-words rounded-ui px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-surface text-foreground",
        )}
      >
        {message.content}
      </p>
    </li>
  );
}

function PendingBubble() {
  return (
    <li className="flex flex-col items-start gap-1">
      <span className="px-1 text-[11px] font-medium text-muted-foreground">Renderer</span>
      <p className="rounded-ui border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
        Revising…
      </p>
    </li>
  );
}

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.length > 0 ? error.message : fallback;
}
