/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { useOperatorChat } from "../hooks/useOperatorChat";
import { cn } from "@/lib/utils";
import { ListFilter, X, Send, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormInputWrapper } from "./FormInputWrapper";
import PhoneField from "./PhoneField";

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
  const [operatorMode] = useState(true);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [showSessionForm, setShowSessionForm] = useState(true);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 540 });
  const [size, setSize] = useState({ width: 380, height: 520 });

  const resizingRef = useRef<ResizeDirection | null>(null);
  const startRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    messages: operatorMessages,
    sendMessage: sendToOperator,
    startSession,
    isConnected,
    sessionId,
    sessionClosed,
    isStartingSession,
    setMessages,
  } = useOperatorChat(operatorMode);

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

    if (operatorMode) {
      if (!sessionId || sessionClosed) {
        setSessionError(t("chat.startSessionFirst"));
        return;
      }
      sendToOperator(input);
    } else {
      const userMsg: Message = { from: "user", text: input, timestamp: now };
      setChatMessages((prev) => [...prev, userMsg]);
      mutate(input);
    }

    setInput("");
  };

  const validateName = (name: string): string => {
    if (!name.trim()) {
      return t("form.errors.nameRequired");
    }
    if (name.length < 2) {
      return t("form.errors.nameTooShort");
    }

    const firstTwoChars = name.trim().substring(0, 2);
    if (/^\d/.test(firstTwoChars.charAt(0)) || /^\d/.test(firstTwoChars.charAt(1))) {
      return t("form.errors.nameInvalid");
    }

    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return t("form.errors.phoneRequired");
    }
    return "";
  };

  const handleStartSession = async () => {
    setSessionError("");
    setNameError("");
    setPhoneError("");

    const nameValidationError = validateName(userName);
    const phoneValidationError = validatePhone(userPhone);

    if (nameValidationError || phoneValidationError) {
      setNameError(nameValidationError);
      setPhoneError(phoneValidationError);
      return;
    }

    const success = await startSession(userName, userPhone);
    if (success) {
      setShowSessionForm(false);
    } else {
      setSessionError(t("chat.startSessionFailed"));
    }
  };

  const clearChatData = () => {
    console.log("Clearing chat data...");
    deleteCookie("chat_operator_messages");
    deleteCookie("chat_ai_messages");
    deleteCookie("chat_session_id");
    deleteCookie("chat_admin_name");
    deleteCookie("chat_messages");
    setChatMessages([]);
    setMessages([]);
    console.log("Chat data cleared, messages:", operatorMessages, chatMessages);
  };

  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  useEffect(() => {
    const savedUserName = getCookie("chat_user_name");
    if (savedUserName) setUserName(savedUserName);
    setUserPhone("");

    const savedOperatorMessages = getCookie("chat_messages");
    if (savedOperatorMessages && operatorMode) {
      try {
        const parsedMessages = JSON.parse(savedOperatorMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing messages from cookie:", error);
        deleteCookie("chat_messages");
      }
    }
  }, [operatorMode, setMessages]);

  useEffect(() => {
    if (userName) {
      setCookie("chat_user_name", userName);
    }
  }, [userName]);

  useEffect(() => {
    deleteCookie("chat_user_phone");
  }, [userPhone]);

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

        newWidth = Math.max(320, Math.min(newWidth, windowWidth - newX));
        newHeight = Math.max(400, Math.min(newHeight, windowHeight - newY));

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
      width: isMobile ? screenWidth - 20 : 380,
      height: isMobile ? screenHeight - 100 : 520,
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
      className="fixed z-50 rounded-xl border-0 shadow-2xl flex flex-col overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex justify-between items-center cursor-move"
        style={{ backgroundColor: '#12332D' }}
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            {/* Online Status Indicator */}
            {operatorMode && !showSessionForm && isConnected && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                   style={{ backgroundColor: '#10b981', borderColor: '#12332D' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            )}
            {operatorMode && !showSessionForm && !isConnected && !sessionClosed && sessionId && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                   style={{ backgroundColor: '#f59e0b', borderColor: '#12332D' }} />
            )}
            {operatorMode && !showSessionForm && sessionClosed && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                   style={{ backgroundColor: '#ef4444', borderColor: '#12332D' }} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">
              {operatorMode ? t("chat.operatorChat") : t("chat.aiChat")}
            </span>
            {/* Operator Status Text */}
            {operatorMode && !showSessionForm && (
              <span className="text-xs text-white/80">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                ) : sessionClosed ? (
                  "Offline"
                ) : sessionId ? (
                  "Connecting..."
                ) : (
                  "Not connected"
                )}
              </span>
            )}
          </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="text-white hover:bg-white/20 cursor-pointer h-8 w-8 rounded-full" 
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Connection Status Bar */}
      {operatorMode && !showSessionForm && (
        <div 
          className="px-4 py-2.5 text-xs font-medium text-center transition-all"
          style={{ 
            backgroundColor: isConnected ? '#dcfce7' : sessionClosed ? '#fee2e2' : '#fef3c7'
          }}
        >
          {isConnected ? (
            <span className="flex items-center justify-center gap-2" style={{ color: '#166534' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: '#10b981' }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: '#10b981' }} />
              </span>
              {t("chat.connected")}
            </span>
          ) : sessionClosed ? (
            <span style={{ color: '#991b1b' }}>⚠️ {t("chat.sessionEnded")}</span>
          ) : sessionId ? (
            <span style={{ color: '#92400e' }}>⏳ {t("chat.connecting")}</span>
          ) : (
            <span style={{ color: '#6b7280' }}>● {t("chat.sessionNotStarted")}</span>
          )}
        </div>
      )}

      {/* Session Form */}
      {operatorMode && showSessionForm && (
        <div className="p-6 border-b" style={{ backgroundColor: '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#12332D' }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-medium" style={{ color: '#12332D' }}>
              {t("chat.connectToOperator")}
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Input
                placeholder={t("chat.enterName")}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
                className={cn(
                  "w-full py-5 rounded-lg border-gray-300 focus:ring-2 transition-all",
                  nameError ? "border-red-400 focus:ring-red-200" : "focus:ring-[#12332D]/20"
                )}
                style={!nameError ? { borderColor: '#d1d5db' } : {}}
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            <div>
              <FormInputWrapper>
                <PhoneField
                  placeholder={t("form.input.phone")}
                  phone={userPhone}
                  setPhone={(value) => {
                    setUserPhone(value as string);
                    setPhoneError(validatePhone(value as string));
                  }}
                  className={cn(
                    "w-full py-5 rounded-lg border-gray-300 focus:ring-2 transition-all",
                    phoneError ? "border-red-400 focus:ring-red-200" : "focus:ring-[#12332D]/20"
                  )}
                />
              </FormInputWrapper>
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            </div>

            {sessionError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs">{sessionError}</p>
              </div>
            )}

            <Button
              onClick={handleStartSession}
              disabled={isStartingSession || !!nameError || !!phoneError || !userName.trim() || !userPhone.trim()}
              className="w-full cursor-pointer py-5 rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: '#12332D', color: 'white' }}
            >
              {isStartingSession ? t("chat.connecting") : t("chat.startChat")}
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 text-sm"
        style={{ backgroundColor: '#f3f4f6' }}
      >
        {allMessages.length === 0 && !showSessionForm && (
          <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
            <div>
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Start a conversation...</p>
            </div>
          </div>
        )}
        
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.from === "user" ? "justify-end" : msg.from === "system" ? "justify-center" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] px-4 py-3 rounded-2xl shadow-sm break-words whitespace-pre-wrap",
                msg.from === "user"
                  ? "rounded-br-md"
                  : msg.from === "system"
                    ? "text-center text-xs max-w-[90%] py-2"
                    : "rounded-bl-md"
              )}
              style={{
                backgroundColor: 
                  msg.from === "user" 
                    ? '#12332D'
                    : msg.from === "system"
                      ? '#fef3c7'
                      : '#ffffff',
                color: msg.from === "user" ? '#ffffff' : msg.from === "system" ? '#92400e' : '#1f2937'
              }}
            >
              <div>{msg.text}</div>
              {msg.from !== "system" && (
                <div 
                  className="text-[10px] mt-1.5 opacity-70"
                  style={{ color: msg.from === "user" ? '#ffffff' : '#6b7280' }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isPending && !operatorMode && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {!(operatorMode && showSessionForm) && (
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("chat.typeMessage")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={operatorMode ? (!sessionId || sessionClosed) : isPending}
              className="flex-1 py-5 rounded-lg border-gray-300 focus:ring-2 transition-all"
              style={{ 
                borderColor: '#d1d5db',
                outlineColor: '#12332D'
              }}
            />
            <Button
              className="cursor-pointer rounded-lg px-4 py-5 transition-all hover:opacity-90"
              style={{ backgroundColor: '#12332D', color: 'white' }}
              onClick={handleSend}
              disabled={operatorMode ? (!sessionId || sessionClosed) : isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-white text-center">
        <Button
          onClick={clearChatData}
          className="text-xs text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
          variant="link"
          size="sm"
        >
          {t("chat.clearHistory")}
        </Button>
      </div>

      {/* Resize Handles */}
      {resizeHandles.map(({ dir, className, rotate }) => (
        <div
          key={dir}
          onMouseDown={startResizing(dir)}
          className={`absolute ${className} z-10 resize-handle`}
        >
          {rotate && (
            <ListFilter 
              className={cn("w-3 h-3", rotate)} 
              style={{ color: '#9ca3af' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
