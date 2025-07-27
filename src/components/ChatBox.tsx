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
  from: "user" | "ai" | "operator" | "system";
  text: string;
  timestamp: string;
};

const ChatBox = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [operatorMode, setOperatorMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Operator session form states
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [sessionError, setSessionError] = useState("");

  // Existing states
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 540 });
  const [size, setSize] = useState({ width: 340, height: 460 });

  const resizingRef = useRef<ResizeDirection | null>(null);
  const startRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);

  // Operator chat hook
  const {
    messages: operatorMessages,
    sendMessage: sendToOperator,
    startSession,
    isConnected,
    sessionId,
    adminName,
    sessionClosed,
    isStartingSession
  } = useOperatorChat(operatorMode);

  // Determine which messages to show
  const allMessages = operatorMode ? operatorMessages : chatMessages;

  // Existing AI chat mutation
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

  // Enhanced send message handler
  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toISOString();

    if (operatorMode) {
      // Check if session is active
      if (!sessionId || sessionClosed) {
        setSessionError(t("chat.startSessionFirst"));
        return;
      }
      // sendToOperator will handle adding user message to state
      sendToOperator(input);
    } else {
      // AI chat logic (existing)
      const userMsg: Message = { from: "user", text: input, timestamp: now };
      setChatMessages((prev) => [...prev, userMsg]);
      mutate(input);
    }

    setInput("");
  };

  // Start operator session
  const handleStartSession = async () => {
    setSessionError("");
    const success = await startSession(userName, userPhone);
    if (success) {
      setShowSessionForm(false);
      setUserName("");
      setUserPhone("");
    }
  };

  // Mode switching handler
  const handleModeSwitch = () => {
    if (operatorMode) {
      // Switching from operator to AI
      setOperatorMode(false);
      setShowSessionForm(false);
      setSessionError("");
    } else {
      // Switching from AI to operator
      setOperatorMode(true);
      setShowSessionForm(true);
      setSessionError("");
    }
  };

  // Existing effects
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
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (draggingRef.current) {
        const boxWidth = size.width;
        const boxHeight = size.height;

        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        newX = Math.max(0, Math.min(windowWidth - boxWidth, newX));
        newY = Math.max(0, Math.min(windowHeight - boxHeight, newY));

        setPosition({ x: newX, y: newY });
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

        newWidth = Math.max(280, Math.min(newWidth, windowWidth - newX));
        newHeight = Math.max(300, Math.min(newHeight, windowHeight - newY));

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
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
  }, [size]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const isMobile = screenWidth <= 600;

    setSize({
      width: isMobile ? screenWidth - 20 : 340,
      height: isMobile ? screenHeight - 100 : 460,
    });

    setPosition({
      x: isMobile ? 10 : screenWidth - 400,
      y: isMobile ? 50 : screenHeight - 540,
    });
  }, []);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        draggingRef.current = false;
        resizingRef.current = null;
      }
    };
    document.addEventListener("keyup", onKeyUp);
    return () => document.removeEventListener("keyup", onKeyUp);
  }, []);

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
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Header */}
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
          {operatorMode
            ? `${t("chat.operatorChat")}${adminName ? ` - ${adminName}` : ""}`
            : t("chat.aiChat")
          }
        </span>
        <Button size="icon" variant="ghost" className="text-white cursor-pointer" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Operator Session Form */}
      {operatorMode && showSessionForm && (
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-sm font-medium mb-3">{t("chat.connectToOperator")}</h3>
          <div className="space-y-2">
            <Input
              placeholder={t("chat.enterName")}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder={t("chat.enterPhone")}
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
            {sessionError && (
              <p className="text-red-500 text-xs">{sessionError}</p>
            )}
            <Button
              onClick={handleStartSession}
              disabled={isStartingSession || !userName.trim() || !userPhone.trim()}
              className="w-full"
            >
              {isStartingSession ? t("chat.connecting") : t("chat.startChat")}
            </Button>
          </div>
        </div>
      )}

      {/* Connection Status for Operator Mode */}
      {operatorMode && !showSessionForm && (
        <div className="px-4 py-1 bg-gray-100 text-xs text-center">
          {isConnected ? (
            <span className="text-green-600">{t("chat.connected")}</span>
          ) : sessionClosed ? (
            <span className="text-red-600">{t("chat.sessionEnded")}</span>
          ) : sessionId ? (
            <span className="text-yellow-600">{t("chat.connecting")}</span>
          ) : (
            <span className="text-gray-600">{t("chat.sessionNotStarted")}</span>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-muted">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "w-fit max-w-[80%] px-3 py-2 rounded-lg shadow-md break-words whitespace-pre-wrap",
              msg.from === "user"
                ? "bg-blue-200 ml-auto text-right"
                : msg.from === "system"
                  ? "bg-yellow-100 mx-auto text-center text-xs"
                  : "bg-gray-200 mr-auto text-left"
            )}
          >
            <div>{msg.text}</div>
            {msg.from !== "system" && (
              <div className="text-[10px] text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | {new Date(msg.timestamp).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}

        {/* AI typing indicator */}
        {isPending && !operatorMode && (
          <div className="text-xs text-gray-500 italic">{t("chat.typing")}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area - Hidden when showing session form */}
      {!(operatorMode && showSessionForm) && (
        <div className="p-3 border-t bg-white flex items-center gap-2">
          <Input
            placeholder={t("chat.typeMessage")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={operatorMode && (!sessionId || sessionClosed)}
          />
          <Button
            className="bg-primary text-primary-foreground cursor-pointer"
            onClick={handleSend}
            disabled={isPending || (operatorMode && (!sessionId || sessionClosed))}
          >
            {t("chat.send")}
          </Button>
        </div>
      )}

      {/* Mode Switch Button */}
      <div className="p-2 border-t bg-white text-center">
        <Button
          onClick={handleModeSwitch}
          className="text-sm text-blue-500 hover:underline cursor-pointer"
          variant="link"
        >
          {operatorMode ? t("chat.connectToAI") : t("chat.connectToOperator")}
        </Button>
      </div>

      {/* Resize Handles */}
      {resizeHandles.map(({ dir, className, rotate }) => (
        <div
          key={dir}
          onMouseDown={startResizing(dir)}
          className={`absolute ${className} z-10 resize-handle`}
        >
          {rotate && <ListFilter className={cn("w-3 h-3 text-gray-400", rotate)} />}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;