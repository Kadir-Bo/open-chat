"use client";
import React, { useEffect, useState } from "react";
import { DropDownMenu } from "@/components";
import { Add, Login, Logout, Settings } from "@mui/icons-material";
import { useDatabase, useAuth } from "@/context";
import Link from "next/link";

const Sidebar = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const { getChats, createChat } = useDatabase();
  const { user, logOut } = useAuth(); // Falls du user.uid brauchst

  // Holt alle Chats beim Laden
  useEffect(() => {
    if (user?.uid) {
      fetchChats();
    }
  }, [user?.uid]);

  const fetchChats = async () => {
    const chatList = await getChats(user.uid);
    setChats(chatList);
  };

  const handleNewChat = async () => {
    const newChat = await createChat(user.uid);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    // z. B. redirectTo(`/chat/${chatId}`)
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

      {user && (
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
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {chats.length === 0 ? (
              <p className="text-neutral-500 text-sm px-4">No Chats</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-white text-sm cursor-pointer hover:bg-neutral-800 ${
                    activeChatId === chat.id ? "bg-neutral-800" : ""
                  }`}
                >
                  {chat.title || "Untitled Chat"}
                </button>
              ))
            )}
          </div>
        </div>
      )}

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
