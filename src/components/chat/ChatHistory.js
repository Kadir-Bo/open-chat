"use client";
import React from "react";
import { useChat } from "@/context";
import { ChatDefaultTemplate, ViewAllChats } from "@/components";

const getRadiusClass = (text) => {
  if (text.length <= 30) return "rounded-full";
  if (text.length <= 80) return "rounded-lg";
  return "rounded-xl";
};

const ChatHistory = () => {
  const { messages } = useChat();

  return (
    <div className="xl:max-w-6xl w-11/12 px-8 mx-auto flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hidden pb-48">
      {messages.length > 0 ? (
        messages.map((msg, i) => {
          const radiusClass = getRadiusClass(msg.text);
          return (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 ${radiusClass} ${
                  msg.role === "user"
                    ? "bg-neutral-600 text-white max-w-8/12"
                    : "bg-transparent text-gray-200 max-w-10/12"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })
      ) : (
        <ChatDefaultTemplate />
      )}
    </div>
  );
};
export default ChatHistory;
