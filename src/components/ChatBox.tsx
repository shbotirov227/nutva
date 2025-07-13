/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useOperatorChat } from "@/hooks/useOperatorChat";
import { cn } from "@/lib/utils";
import { ListFilter, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right"
  | "top"
  | "bottom";

type Message = {
  from: "user" | "ai" | "operator";
  text: string;
  timestamp: string;
};

const ChatBox = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [operatorMode, setOperatorMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const { messages: operatorMessages, sendMessage: sendToOperator } = useOperatorChat(operatorMode);

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 540 });
  const [size, setSize] = useState({ width: 340, height: 460 });

  const resizingRef = useRef<ResizeDirection | null>(null);
  const startRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);

  const allMessages = operatorMode ? operatorMessages : chatMessages;

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.postChatAI,
    onSuccess: (data) => {
      const now = new Date().toISOString();
      const aiMsg: Message = {
        from: "ai",
        text: data.answer,
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toISOString();
    const userMsg: Message = { from: "user", text: input, timestamp: now };

    if (operatorMode) {
      sendToOperator(input);
    } else {
      setChatMessages((prev) => [...prev, userMsg]);
      mutate(input);
    }

    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  useEffect(() => {
    const savedAI = localStorage.getItem("chat_ai");
    if (savedAI) setChatMessages(JSON.parse(savedAI));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_ai", JSON.stringify(chatMessages));
  }, [chatMessages]);

  const startResizing = (dir: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    resizingRef.current = dir;
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) {
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        setPosition({
          x: e.clientX - offsetRef.current.x,
          y: e.clientY - offsetRef.current.y,
        });
      }

      if (resizingRef.current && startRef.current) {
        const deltaX = e.clientX - startRef.current.x;
        const deltaY = e.clientY - startRef.current.y;

        const direction = resizingRef.current;
        let newWidth = startRef.current.width;
        let newHeight = startRef.current.height;
        let newX = startRef.current.left;
        let newY = startRef.current.top;

        if (direction.includes("right")) newWidth += deltaX;
        if (direction.includes("left")) {
          newWidth -= deltaX;
          newX += deltaX;
        }
        if (direction.includes("bottom")) newHeight += deltaY;
        if (direction.includes("top")) {
          newHeight -= deltaY;
          newY += deltaY;
        }

        setSize({
          width: Math.max(280, newWidth),
          height: Math.max(300, newHeight),
        });
        setPosition({
          x: newX,
          y: newY,
        });
      }
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      resizingRef.current = null;
      startRef.current = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      draggingRef.current = false;
      resizingRef.current = null;
    }
  };

  document.addEventListener("keyup", onKeyUp);


  const resizeHandles: { dir: ResizeDirection; className: string; rotate?: string }[] = [
    { dir: "top", className: "top-0 left-0 w-full h-1 cursor-n-resize" },
    { dir: "bottom", className: "bottom-0 left-0 w-full h-1 cursor-s-resize" },
    { dir: "left", className: "top-0 left-0 h-full w-1 cursor-w-resize" },
    { dir: "right", className: "top-0 right-0 h-full w-1 cursor-e-resize" },
    { dir: "top-left", className: "top-0 left-0 w-3 h-3 cursor-nw-resize", rotate: "rotate-135" },
    { dir: "top-right", className: "top-0 right-0 w-3 h-3 cursor-ne-resize", rotate: "-rotate-135" },
    { dir: "bottom-right", className: "bottom-0 right-0 w-3 h-3 cursor-se-resize", rotate: "-rotate-45" },
    { dir: "bottom-left", className: "bottom-0 left-0 w-3 h-3 cursor-sw-resize", rotate: "rotate-45" },
  ];


  return (
    <div
      ref={boxRef}
      className="fixed z-50 rounded-md border shadow-lg flex flex-col bg-white overflow-hidden"
      style={{ left: position.x, top: position.y, width: size.width, height: size.height }}
    >
      <div
        className="bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center cursor-move"
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".resize-handle")) return;

          draggingRef.current = true;
          offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          };
        }}
      >
        <span className="text-sm font-medium">
          {operatorMode ? "Operator bilan suhbat" : "AI Chat"}
        </span>
        <Button size="icon" variant="ghost" className="text-white cursor-pointer" onClick={onClose}>
          <X className="w-15 h-15" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-muted">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "w-fit max-w-[80%] px-3 py-2 rounded-lg shadow-md break-words whitespace-pre-wrap",
              msg.from === "user"
                ? "bg-blue-200 ml-auto text-right"
                : "bg-gray-200 mr-auto text-left"
            )}
          >
            <div>{msg.text}</div>
            <div className="text-[10px] text-gray-500 mt-3">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              | {new Date(msg.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}

        {isPending && !operatorMode && (
          <div className="text-xs text-gray-500 italic">{t("common.typing")}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 mb-3 border-t bg-white flex items-center gap-2">
        <Input
          placeholder={t("common.typeMsg")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          className="bg-primary text-primary-foreground cursor-pointer"
          onClick={handleSend}
          disabled={isPending}
        >
          {t("common.send")}
        </Button>
      </div>

      <div className="p-2 border-t bg-white text-center">
        <Button
          onClick={() => setOperatorMode(!operatorMode)}
          className="text-sm text-blue-500 hover:underline cursor-pointer"
          variant="link"
        >
          {operatorMode ? t("common.contactAI") : t("common.contactOperator")}
        </Button>
      </div>

      {resizeHandles.map(({ dir, className, rotate }) => (
        <div
          key={dir}
          onMouseDown={startResizing(dir)}
          className={`absolute ${className} z-10 resize-handle`}
        >
          {rotate && <ListFilter className={cn("w-3 h-3 text-gray-400", rotate)} />}
        </div>
      ))}

      {/* <div
        onMouseDown={startResizing("bottom-left")}
        className="absolute bottom-0 left-0 w-6 h-6 cursor-ne-resize flex items-end justify-end p-1"
      /> */}

    </div>
  );
};

export default ChatBox;
