import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, Copy, Check, Paperclip, FileText, XCircle, User,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Markdown from "react-markdown";

type Attachment = {
  name: string;
  base64: string;
  mimeType: string;
  preview?: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  attachment?: Attachment;
  /** When true, the bot message is revealed with a typewriter animation. */
  isTyping?: boolean;
};

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#1a1b26]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#16161e] px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex flex-shrink-0 gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </div>
          <span className="truncate text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex flex-shrink-0 items-center gap-1 rounded px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
        >
          {copied ? (
            <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
          ) : (
            <><Copy size={11} /><span>Copy</span></>
          )}
        </button>
      </div>
      {/* Bulletproof horizontal-scroll containment:
          - min-w-0 lets this wrapper shrink below the code's intrinsic width
          - overflow-x-auto keeps the scrollbar ON the code block, never on the chatbox
          - min-width:100% on the pre makes short snippets fill the block and lets long
            snippets expand, so the inner scrollbar only appears when truly needed. */}
      <div className="relative w-full min-w-0 overflow-x-auto overflow-y-hidden">
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark as any}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "12px 16px",
            background: "transparent",
            fontSize: "11.5px",
            lineHeight: "1.65",
            minWidth: "100%",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              whiteSpace: "pre",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Shared markdown component map so the live "typing" state and the final
// rendered state look identical — no layout shift when typing completes.
const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeStr = String(children).replace(/\n$/, "");
    return !inline && match ? (
      <CodeBlock language={match[1]} code={codeStr} />
    ) : (
      <code
        {...props}
        className="rounded bg-secondary px-1 py-0.5 font-mono text-[12px] break-words"
      >
        {children}
      </code>
    );
  },
  // Pass `<pre>` children through untouched — CodeBlock constrains overflow itself.
  pre({ children }: any) {
    return <>{children}</>;
  },
  p: ({ children }: any) => <p className="mb-2 break-words last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="mb-2 list-disc pl-4 space-y-0.5">{children}</ul>,
  ol: ({ children }: any) => <ol className="mb-2 list-decimal pl-4 space-y-0.5">{children}</ol>,
  li: ({ children }: any) => <li className="text-sm">{children}</li>,
  h1: ({ children }: any) => <h1 className="mb-2 mt-1 text-base font-semibold">{children}</h1>,
  h2: ({ children }: any) => <h2 className="mb-2 mt-1 text-[15px] font-semibold">{children}</h2>,
  h3: ({ children }: any) => <h3 className="mb-1.5 mt-1 text-sm font-semibold">{children}</h3>,
  a: ({ children, href }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-500 underline underline-offset-2 hover:text-blue-400"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
  hr: () => <hr className="my-3 border-border" />,
  table: ({ children }: any) => (
    <div className="my-2 w-full overflow-x-auto">
      <table className="w-full border-collapse text-[12px]">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-secondary/50 px-2 py-1 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border px-2 py-1 align-top">{children}</td>
  ),
};

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div
      className="w-full min-w-0 max-w-full overflow-hidden text-sm prose prose-sm dark:prose-invert max-w-none"
      style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
    >
      <Markdown components={markdownComponents}>{content}</Markdown>
    </div>
  );
}

/**
 * Reveals the bot reply with a typewriter animation instead of showing it
 * all at once. Speed scales with length so long answers don't drag, and any
 * unclosed ``` fence is temporarily balanced so code blocks never flash broken
 * while mid-type.
 */
function TypingMessage({
  content,
  onDone,
  onProgress,
}: {
  content: string;
  onDone: () => void;
  onProgress: () => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    // Characters/second — fast but readable, scaled up for long replies.
    const rate = Math.min(1400, Math.max(220, content.length / 4));

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      const next = Math.min(content.length, Math.floor(elapsed * rate));
      setCount(next);
      onProgress();
      if (next < content.length) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Intentionally run once per message content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  let visible = content.slice(0, count);
  // Balance an odd number of ``` fences so a half-typed code block renders cleanly.
  if ((visible.match(/```/g) || []).length % 2 === 1) {
    visible += "\n```";
  }

  const typing = count < content.length;

  return (
    <div className="relative">
      <MarkdownMessage content={visible} />
      {typing && (
        <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-foreground align-baseline" />
      )}
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hey! I'm ELI — ask me anything about HTML, CSS, or JavaScript. You can also send images or files!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.chat.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: data.reply, isTyping: true },
      ]);
    },
    onError: (error) => {
      let msg = error.message;
      if (msg.includes("Unexpected end of JSON") || msg.includes("Unexpected token")) {
        msg = "API config error. Make sure `GEMINI_API_KEY` is set in Vercel environment variables.";
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: `**Error:** ${msg}` },
      ]);
    },
  });

  const handleSend = () => {
    if ((!input.trim() && !attachment) || chatMutation.isPending) return;
    const userMsg = input.trim() || `[Attached: ${attachment?.name}]`;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg, attachment: attachment ?? undefined },
    ]);
    chatMutation.mutate({
      prompt: userMsg || "Please analyse this file.",
      base64Image: attachment?.base64,
      mimeType: attachment?.mimeType,
    });
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setAttachment({
        name: file.name,
        base64,
        mimeType: file.type,
        preview: file.type.startsWith("image/") ? dataUrl : undefined,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const markTypingDone = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isTyping: false } : m)),
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl active:scale-95 border-2 border-border"
          aria-label="Open chat"
        >
          <img src="/logo.jpg" alt="ELI" className="h-full w-full object-cover" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[88vh] sm:w-[420px] sm:rounded-2xl sm:border border-border bg-background shadow-2xl">

          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border">
                <img src="/logo.jpg" alt="ELI" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none">ELI</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {chatMutation.isPending ? "Typing…" : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages — key fix: overflow-hidden on outer, overflow-y-auto on inner */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.role === "bot" ? (
                      <div className="h-7 w-7 overflow-hidden rounded-full border border-border">
                        <img src="/logo.jpg" alt="ELI" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
                        <User size={13} />
                      </div>
                    )}
                  </div>

                  {/* Content — min-w-0 + overflow-hidden prevents blowout. max-w-full lives in
                      the bot branch only so it can't fight the user branch's max-w-[80%]. */}
                  <div
                    className={
                      msg.role === "user"
                        ? "min-w-0 flex flex-col items-end gap-1.5 max-w-[80%]"
                        : "min-w-0 flex max-w-full flex-1 flex-col gap-1.5 overflow-hidden"
                    }
                  >
                    {/* Image attachment preview */}
                    {msg.attachment?.preview && (
                      <img
                        src={msg.attachment.preview}
                        alt={msg.attachment.name}
                        className="max-w-[180px] rounded-xl border border-border object-cover"
                      />
                    )}
                    {/* File attachment (non-image) */}
                    {msg.attachment && !msg.attachment.preview && (
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                        <FileText size={13} />
                        <span className="max-w-[140px] truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                    {/* Text / markdown */}
                    {msg.content && (
                      msg.role === "user" ? (
                        <div className="rounded-2xl rounded-tr-sm bg-foreground px-4 py-2.5 text-sm text-background">
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                      ) : msg.isTyping ? (
                        // Bot (streaming): typewriter reveal, full width, no bubble.
                        <TypingMessage
                          content={msg.content}
                          onProgress={scrollToBottom}
                          onDone={() => markTypingDone(msg.id)}
                        />
                      ) : (
                        // Bot (final): identical rendering to the typing state.
                        <MarkdownMessage content={msg.content} />
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-border">
                    <img src="/logo.jpg" alt="ELI" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-secondary/50 px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachment strip */}
          {attachment && (
            <div className="flex flex-shrink-0 items-center gap-2 border-t border-border bg-secondary/20 px-4 py-2">
              {attachment.preview ? (
                <img src={attachment.preview} alt="" className="h-10 w-10 rounded-md border border-border object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
                  <FileText size={16} className="text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{attachment.name}</p>
                <p className="text-[10px] text-muted-foreground">{attachment.mimeType}</p>
              </div>
              <button
                onClick={() => setAttachment(null)}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 border-t border-border bg-card p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-foreground/30 transition-colors">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-0.5 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.txt,.js,.ts,.html,.css,.json,.md"
                className="hidden"
                onChange={handleFileChange}
              />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything…"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed min-h-[24px] max-h-[120px]"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={(!input.trim() && !attachment) || chatMutation.isPending}
                className="mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}
    </>
  );
}
