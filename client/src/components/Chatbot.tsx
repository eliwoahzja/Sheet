import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle, X, Send, Loader2, Bot, User,
  Copy, Check, Paperclip, Image as ImageIcon, FileText, XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Markdown from "react-markdown";

type Attachment = {
  name: string;
  base64: string;
  mimeType: string;
  preview?: string; // for images
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  attachment?: Attachment;
};

// Code block with copy button
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-border bg-[#1a1b26]">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-[#16161e] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
          ) : (
            <><Copy size={12} /><span>Copy</span></>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark as any}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "12px 16px",
          background: "transparent",
          fontSize: "12px",
          lineHeight: "1.6",
        }}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
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
      content: "Hi! I'm your coding assistant. Ask me anything about HTML, CSS, or JavaScript — you can also send images or files!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.chat.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: data.reply },
      ]);
    },
    onError: (error) => {
      let errorMsg = error.message;
      if (
        errorMsg.includes("Unexpected end of JSON input") ||
        errorMsg.includes("Unexpected token") ||
        errorMsg.includes("execute 'json' on 'Response'")
      ) {
        errorMsg =
          "API configuration error. Please ensure the `GEMINI_API_KEY` is set in your Vercel environment variables.";
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: `**Error:** ${errorMsg}` },
      ]);
    },
  });

  const handleSend = () => {
    if ((!input.trim() && !attachment) || chatMutation.isPending) return;

    const userMsg = input.trim() || (attachment ? `[Attached: ${attachment.name}]` : "");
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: userMsg,
        attachment: attachment ?? undefined,
      },
    ]);

    chatMutation.mutate({
      prompt: userMsg || "Please analyze or describe this file.",
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
      const isImage = file.type.startsWith("image/");
      setAttachment({
        name: file.name,
        base64,
        mimeType: file.type,
        preview: isImage ? dataUrl : undefined,
      });
    };
    reader.readAsDataURL(file);
    // reset so same file can be picked again
    e.target.value = "";
  };

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-all hover:scale-110 hover:shadow-2xl active:scale-95"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[600px] sm:max-h-[88vh] bg-background sm:rounded-2xl sm:border border-border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-3 bg-card">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Dev Assistant</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {chatMutation.isPending ? "Thinking…" : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5" ref={scrollRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  {/* Attachment preview */}
                  {msg.attachment?.preview && (
                    <img
                      src={msg.attachment.preview}
                      alt={msg.attachment.name}
                      className="max-w-[200px] rounded-xl border border-border object-cover shadow-sm"
                    />
                  )}
                  {msg.attachment && !msg.attachment.preview && (
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                      <FileText size={14} />
                      <span className="max-w-[140px] truncate">{msg.attachment.name}</span>
                    </div>
                  )}

                  {/* Text bubble */}
                  {msg.content && (
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-tr-sm"
                          : "bg-secondary/50 text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <Markdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "");
                                const codeStr = String(children).replace(/\n$/, "");
                                return !inline && match ? (
                                  <CodeBlock language={match[1]} code={codeStr} />
                                ) : (
                                  <code
                                    {...props}
                                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]"
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              // also handle fenced blocks without language
                              pre({ children }: any) {
                                return <>{children}</>;
                              },
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-0.5">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-0.5">{children}</ol>,
                              li: ({ children }) => <li className="text-sm">{children}</li>,
                            }}
                          >
                            {msg.content}
                          </Markdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-secondary/50 px-4 py-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Attachment preview strip */}
          {attachment && (
            <div className="flex-shrink-0 flex items-center gap-2 border-t border-border bg-secondary/20 px-4 py-2">
              {attachment.preview ? (
                <img src={attachment.preview} alt="" className="h-10 w-10 rounded-md object-cover border border-border" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary border border-border">
                  <FileText size={16} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium">{attachment.name}</p>
                <p className="text-[10px] text-muted-foreground">{attachment.mimeType}</p>
              </div>
              <button
                onClick={() => setAttachment(null)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-border bg-card p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-foreground/30 transition-colors">
              {/* File / Image buttons */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 mb-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Attach file or image"
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

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything… (Shift+Enter for newline)"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[24px] max-h-[120px] leading-relaxed"
              />

              {/* Send button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={(!input.trim() && !attachment) || chatMutation.isPending}
                className="flex-shrink-0 mb-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              >
                <Send size={15} />
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
