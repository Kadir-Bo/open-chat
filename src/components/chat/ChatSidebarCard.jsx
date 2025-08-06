import { Delete, Edit, MoreVert } from "@mui/icons-material";
import React, { useState, useCallback } from "react";
import { DropDownMenu } from "@/components";
import { useAuth, useDatabase } from "@/context";

const ChatSidebarCard = ({ chat, handleSelectChat, activeChatId }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [chatTitle, setChatTitle] = useState(chat.title || "Untitled Chat");

  const { renameChat } = useDatabase();
  const { user } = useAuth();

  const isActive = activeChatId === chat.id;

  const openMoreOptions = useCallback(() => setShowMoreMenu(true), []);
  const closeMoreOptions = useCallback(() => setShowMoreMenu(false), []);

  const handleTitleChange = (e) => setChatTitle(e.target.value);

  const handleRename = useCallback(() => {
    setIsRenaming(true);
    setShowMoreMenu(false);
  }, []);

  const handleDelete = useCallback(() => {
    // Open modal confirmation (not implemented here)
    setShowMoreMenu(false);
  }, []);

  const handleSelectOption = (id) => {
    if (id === "rename") return handleRename();
    if (id === "delete") return handleDelete();
  };

  const handleTitleSubmit = () => {
    setIsRenaming(false);
    if (chat.title !== chatTitle.trim()) {
      renameChat(user.id, chat.id, chatTitle.trim());
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
    if (e.key === "Escape") {
      setIsRenaming(false);
      setChatTitle(chat.title || "Untitled Chat");
    }
  };

  const moreMenuItems = [
    { name: "rename", id: "rename", icon: <Edit fontSize="small" /> },
    { name: "delete", id: "delete", icon: <Delete fontSize="small" /> },
  ];

  return (
    <li
      onClick={() => handleSelectChat(chat.id)}
      className={`relative flex items-center justify-between w-full px-4 py-3 rounded-md text-white text-sm cursor-pointer hover:bg-neutral-800 ${
        isActive ? "bg-neutral-800" : ""
      }`}
    >
      {isRenaming ? (
        <input
          value={chatTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleSubmit}
          onKeyDown={handleTitleKeyDown}
          autoFocus
          className="bg-transparent border-none outline-none w-full mr-2 text-white"
        />
      ) : (
        <span className="truncate">{chatTitle}</span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openMoreOptions();
        }}
        className="outline-none"
      >
        <MoreVert fontSize="small" />
      </button>

      <DropDownMenu
        items={moreMenuItems}
        state={showMoreMenu}
        closeDropDown={closeMoreOptions}
        onSelect={handleSelectOption}
        className="left-full -bottom-full -ml-12 -mb-8 max-w-max"
      />
    </li>
  );
};

export default ChatSidebarCard;
