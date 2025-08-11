// app/chat/page.tsx
"use client";

import { ChatInput, Sidebar, ViewAllChats } from "@/components";

const Chat = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-row items-start justify-start">
      <Sidebar />
      <div className="w-full h-full flex flex-col relative pt-12">
        <ViewAllChats />
      </div>
    </div>
  );
};

export default Chat;
