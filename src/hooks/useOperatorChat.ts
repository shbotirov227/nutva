import { useEffect, useState } from "react";
import socket from "@/lib/socket";

type Message = {
  from: "user" | "operator";
  text: string;
  timestamp: string;
};

export function useOperatorChat(enabled: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!enabled) return;

    socket.connect();

    socket.on("message", (msg: { from: string; text: string }) => {
      const messageWithTimestamp: Message = {
        from: msg.from === "user" ? "user" : "operator",
        text: msg.text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageWithTimestamp]);
    });

    return () => {
      socket.disconnect();
      socket.off("message");
    };
  }, [enabled]);

  const sendMessage = (text: string) => {
    const message: Message = {
      from: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", message);
    setMessages((prev) => [...prev, message]);
  };

  return { messages, sendMessage };
}
