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

  const BASE_URL = "https://nutva.uz/telegram-api";

  // Start session function
  const startSession = async (name: string, phone: string): Promise<boolean> => {
    if (!name.trim() || !phone.trim()) {
      addSystemMessage(t("chat.nameRequired"));
      return false;
    }

    setIsStartingSession(true);

    try {
      const response = await fetch(`${BASE_URL}/messages/start_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: name, user_phone: phone })
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

      connectWebSocket(data.id, data.admin_name);
      return true;
    } catch (err) {
      addSystemMessage(t("chat.serverConnectionError"));
      console.error("startSession error:", err);
      return false;
    } finally {
      setIsStartingSession(false);
    }
  };

  // Connect WebSocket
  const connectWebSocket = (sessionId: string, adminName: string) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(`wss://nutva.uz/telegram-api/ws/${sessionId}`);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      addSystemMessage(t("chat.connectedToSession"));

      // Send greeting if not sent yet
      if (!greetingSentRef.current) {
        const greeting = `Assalomu aleykum, mening ismim ${adminName}. Sizga qanday yordam bera olaman?`;

        const greetingMessage: Message = {
          from: "operator",
          text: greeting,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, greetingMessage]);

        // Save greeting to server
        fetch(`${BASE_URL}/messages/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            sender: "admin",
            content: greeting
          })
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
        // Only process admin/operator messages, ignore user echoes
        if (data.includes("admin:") || data.includes("🧾 admin:")) {
          // Extract only admin's text without prefixes
          let adminText = data;
          adminText = adminText.replace(/^🧾 admin: /, "");
          adminText = adminText.replace(/^admin: /, "");
          adminText = adminText.replace(/^🧾 /, "");

          // Only add if it's not empty after cleaning
          if (adminText.trim()) {
            const operatorMessage: Message = {
              from: "operator",
              text: adminText.trim(),
              timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, operatorMessage]);
          }
        }
        // Completely ignore messages that start with "user:" or contain user echoes
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

  // Handle session ended
  const handleSessionEnded = () => {
    setSessionClosed(true);
    setIsConnected(false);
    addSystemMessage(t("chat.sessionEnded"));

    // Clean up after 3 seconds
    setTimeout(() => {
      setMessages([]);
      setSessionId(null);
      setAdminName("");
      greetingSentRef.current = false;
    }, 3000);
  };

  // Send message to operator
  const sendMessage = async (text: string) => {
    if (!text.trim() || sessionClosed || !sessionId) return;

    // Add user message to local state immediately
    const userMessage: Message = {
      from: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${BASE_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          sender: "user",
          content: text
        })
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

  // Add system message
  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      from: "system",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // Cleanup on unmount or when disabled
  useEffect(() => {
    if (!enabled) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      setSessionId(null);
      setMessages([]);
      return;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [enabled]);

  return {
    messages,
    sendMessage,
    startSession,
    isConnected,
    sessionId,
    adminName,
    sessionClosed,
    isStartingSession,
  };
}