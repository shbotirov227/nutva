import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

type Message = {
  from: "user" | "ai" | "operator" | "system";
  text: string;
  timestamp: string;
};

type SessionData = {
  id: string;
  admin_name: string;
};

export function useOperatorChat(enabled: boolean) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string>("");
  const [sessionClosed, setSessionClosed] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const greetingSentRef = useRef(false);

  // const BASE_URL = process.env.NEXTAUTH_URL;
  const BASE_URL = process.env.NEXT_TELEGRAM_API;
  const WEBSOCKET_URL = process.env.NEXT_WEBSOCK_API;

  useEffect(() => {
    console.log("Environment variables:", {
      BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      WEBSOCKET_URL: process.env.NEXT_WEBSOCK_API,
    });
  }, []);

  useEffect(() => {
    console.log("All env vars:", process.env);
  }, []);

  const validateName = (name: string): string => {
    if (!name.trim()) {
      return t("chat.nameRequired");
    }
    if (name.length < 2) {
      return t("chat.nameTooShort");
    }

    const firstTwoChars = name.trim().substring(0, 2);
    if (/^\d/.test(firstTwoChars.charAt(0)) || /^\d/.test(firstTwoChars.charAt(1))) {
      return t("chat.nameInvalid");
    }

    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return t("chat.phoneRequired");
    }
    // if (!/^\+\d{1,4}\d{6,12}$/.test(phone)) {
    //   return t("chat.phoneInvalid");
    // }
    return "";
  };

  const startSession = async (name: string, phone: string): Promise<boolean> => {
    const nameValidationError = validateName(name);
    const phoneValidationError = validatePhone(phone);

    if (nameValidationError || phoneValidationError) {
      addSystemMessage(nameValidationError || phoneValidationError);
      return false;
    }

    setIsStartingSession(true);

    try {
      const response = await fetch(`${BASE_URL}/messages/start_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: name, user_phone: phone }),
      });

      if (!response.ok) {
        addSystemMessage(t("chat.noAdminAvailable"));
        return false;
      }

      const data: SessionData = await response.json();
      setSessionId(data.id);
      setAdminName(data.admin_name);
      setSessionClosed(false);
      greetingSentRef.current = false;

      connectWebSocket(data.id);
      return true;
    } catch (err) {
      addSystemMessage(t("chat.serverConnectionError"));
      console.error("startSession error:", err);
      return false;
    } finally {
      setIsStartingSession(false);
    }
  };

  const connectWebSocket = (
    sessionId: string,
    // adminName: string
  ) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(`${WEBSOCKET_URL}/${sessionId}`);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      addSystemMessage(t("chat.connectedToSession"));

      if (
        !greetingSentRef.current && sessionId
        // && !messages.some(m => m.from === "operator" && m.text.includes(adminName))
      ) {
        // const greeting = `Assalomu aleykum, mening ismim ${adminName}. Sizga qanday yordam bera olaman?`;
        const greeting = "Assalomu aleykum, men Nutva mutaxasisiman. Sizga qanday yordam bera olaman ?"
        const greetingMessage: Message = {
          from: "operator",
          text: greeting,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, greetingMessage]);

        fetch(`${BASE_URL}/messages/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            sender: "admin",
            // content: greeting,
          }),
        }).catch((err) => {
          console.error("Failed to save greeting:", err);
        });

        greetingSentRef.current = true;
      }
    };

    socketRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.includes("Session has ended")) {
        handleSessionEnded();
      } else {
        if (data.includes("admin:") || data.includes("🧾 admin:")) {
          let adminText = data;
          adminText = adminText.replace(/^🧾 admin: /, "");
          adminText = adminText.replace(/^admin: /, "");
          adminText = adminText.replace(/^🧾 /, "");

          if (adminText.trim()) {
            const lastMessage = messages[messages.length - 1];
            if (
              lastMessage?.from === "operator" &&
              lastMessage.text === adminText.trim() &&
              Math.abs(new Date(lastMessage.timestamp).getTime() - new Date().getTime()) < 1000
            ) {
              return;
            }

            const operatorMessage: Message = {
              from: "operator",
              text: adminText.trim(),
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, operatorMessage]);
          }
        }
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      addSystemMessage(t("chat.disconnected"));
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      addSystemMessage(t("chat.connectionError"));
    };
  };

  const handleSessionEnded = () => {
    setSessionClosed(true);
    setIsConnected(false);
    addSystemMessage(t("chat.sessionEnded"));

    setTimeout(() => {
      setSessionId(null);
      setAdminName("");
      greetingSentRef.current = false;
    }, 3000);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || sessionClosed || !sessionId) return;

    const userMessage: Message = {
      from: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${BASE_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          sender: "user",
          content: text,
        }),
      });

      if (response.status === 400) {
        addSystemMessage(t("chat.cannotSendMessage"));
        handleSessionEnded();
      }
    } catch (err) {
      addSystemMessage(t("chat.sendingError"));
      console.error("sendMessage error:", err);
    }
  };

  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      from: "system",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemMessage]);
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
    if (!enabled) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      setSessionId(null);
      return;
    }

    const savedMessages = getCookie("chat_messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing messages from cookie:", error);
        deleteCookie("chat_messages");
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (messages.length > 0) {
      setCookie("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    startSession,
    isConnected,
    sessionId,
    adminName,
    sessionClosed,
    isStartingSession,
    setMessages,
  };
}