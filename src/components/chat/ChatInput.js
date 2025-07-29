"use client";
import { Send } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import { useChat, useModal } from "@/context";
import { SignInForm } from "@/components";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const { sendMessage, trial } = useChat();
  const { openModal } = useModal();

  const handleSend = () => {
    if (trial) {
      openModal(
        <SignInForm description="Please sign in to continue your conversation" />
      );
      return;
    }
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="w-full flex justify-center absolute bottom-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-end bg-neutral-900 text-white rounded-xl px-4 py-2">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            rows={3}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400 resize-none w-full py-2"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          />
          <button
            onClick={handleSend}
            className="transition rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer h-8 w-8 p-2 flex items-center justify-center"
          >
            <Send fontSize="inherit" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
