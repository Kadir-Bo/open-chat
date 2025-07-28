// app/chat/page.tsx
"use client";

import { ChatProvider, useAuth } from "@/context";
import {
  ChatHeader,
  ChatHistory,
  ChatInput,
  Header,
  Loader,
  Sidebar,
} from "@/components";

const Chat = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-row items-start justify-start">
      <Sidebar />
      <div className="w-full h-full flex flex-col relative">
        <Header />
        <ChatHistory />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
