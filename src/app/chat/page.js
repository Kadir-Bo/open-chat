// app/chat/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatProvider, useAuth } from "@/context";
import {
  ChatHeader,
  ChatHistory,
  ChatInput,
  Loader,
  Sidebar,
} from "@/components";

const Chat = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="h-screen overflow-hidden flex flex-row items-start justify-start">
        <Sidebar />
        <div className="w-full h-full flex flex-col relative">
          <ChatHeader />
          <ChatHistory />
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;
