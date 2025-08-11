"use client";
import React, { useEffect, useState } from "react";
import { ChatSidebarCard, DropDownMenu, UserSettingsModal } from "@/components";
import { Add, Login, Logout, MoreVert, Settings } from "@mui/icons-material";
import { useAuth, useModal, useChat } from "@/context";
import Link from "next/link";

const Sidebar = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { user, logOut } = useAuth();
  const { openModal } = useModal();
  const {
    enableViewAllChats,
    fetchChats,
    chatsList,
    activeChatId,
    changeChat,
  } = useChat();

  useEffect(() => {
    if (user?.uid) {
      fetchChats();
    }
  }, [user?.uid, chatsList]);

  const handleNewChat = () => {
    const tempChatId = `temp-${Date.now()}`;
    changeChat(tempChatId);
  };

  const handleSelectChat = (chatId) => {
    changeChat(chatId);
  };

  const accountMenuItems = [
    { id: "settings", name: "Settings", icon: <Settings fontSize="small" /> },
    {
      id: "logout",
      name: "Logout",
      className: "text-neutral-500",
      icon: <Logout fontSize="small" />,
    },
  ];

  const handleCloseAccountMenu = () => {
    setAccountMenuOpen(false);
  };

  const handleSelectAccountMenu = (optionId) => {
    setAccountMenuOpen(false);
    if (optionId === "logout") {
    }
    switch (optionId) {
      case "logout":
        return logOut();

      case "settings":
        openModal(<UserSettingsModal />);
        return;
    }
  };

  return (
    <div
      className={`h-full w-[360px] p-4 flex flex-col border-r border-neutral-800 bg-neutral-950 ${
        user ? "" : "justify-between"
      }`}
    >
      {/* Header */}
      <Link href={"/"} className="py-3 pl-4">
        <span className="font-bold text-sm text-white">Open Chat</span>
      </Link>

      <div className="flex flex-col justify-start flex-1 gap-4">
        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="w-full flex justify-start items-center gap-2 text-left px-4 py-3 rounded-md hover:bg-neutral-800 text-white text-sm cursor-pointer"
        >
          New Chat <Add fontSize="small" />
        </button>

        <hr className="border-neutral-800" />

        {/* Chat-Liste */}
        {user && (
          <div className="flex flex-col flex-1">
            <ul className="flex-1 space-y-2 pr-1">
              {chatsList.length >= 1 ? (
                chatsList
                  .slice(0, 10) // take only first 10 items
                  .map((chat, idx) => (
                    <ChatSidebarCard
                      chat={chat}
                      key={chat.id + idx}
                      handleSelectChat={handleSelectChat}
                      activeChatId={activeChatId}
                    />
                  ))
              ) : (
                <p className="text-neutral-500 text-sm px-4">No Chats</p>
              )}
            </ul>
            <div className="flex items-center justify-center">
              <Link
                href="/recent"
                className="text-sm py-2 text-gray-400 hover:text-white transition cursor-pointer"
              >
                View All Chats
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Account Menü */}
      {user ? (
        <div className="pt-2 border-t border-neutral-800 mt-4 relative">
          <DropDownMenu
            state={accountMenuOpen}
            items={accountMenuItems}
            onSelect={handleSelectAccountMenu}
            closeDropDown={handleCloseAccountMenu}
            className="w-full bottom-16"
          />
          <button
            className="w-full text-left px-4 py-3 rounded-md hover:bg-neutral-800 text-white text-sm cursor-pointer"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
          >
            {user?.email || "User"}
          </button>
        </div>
      ) : (
        <div className="pt-2 border-t border-neutral-800 mt-4 relative">
          <Link
            href={"/sign-in"}
            className="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-md hover:bg-neutral-800 text-white text-sm cursor-pointer"
          >
            Sign In
            <Login fontSize="small" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
