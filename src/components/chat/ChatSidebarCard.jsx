import { Check, Close, Delete, Edit, MoreVert, X } from "@mui/icons-material";
import React, { useState, useCallback } from "react";
import { DeleteChatModal, DropDownMenu } from "@/components";
import { useAuth, useDatabase, useModal } from "@/context";

const ChatSidebarCard = ({ chat, handleSelectChat, activeChatId }) => {
  const { openModal } = useModal();
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
    openModal(<DeleteChatModal id={chat.id} />);
    setShowMoreMenu(false);
  }, []);

  const handleSelectOption = (id) => {
    if (id === "rename") return handleRename();
    if (id === "delete") return handleDelete();
  };

  const handleTitleSubmit = () => {
    setIsRenaming(false);
    if (chat.title !== chatTitle.trim()) {
      renameChat(chat.id, chatTitle.trim());
    }
  };
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    }
  };
  const handleCancelRename = () => {
    setIsRenaming(false);
    setChatTitle(chat.title || "Untitled Chat");
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
        <div className="flex items-center justify-between">
          <input
            value={chatTitle}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="bg-transparent border-none outline-none w-full mr-2 text-white"
          />
        </div>
      ) : (
        <span className="truncate max-w-[30ch]">{chatTitle}</span>
      )}

      {isRenaming ? (
        <div className="flex gap-2">
          <button onClick={handleTitleSubmit}>
            <Check fontSize="small" />
          </button>
          <button className="text-gray-400" onClick={handleCancelRename}>
            <Close fontSize="small" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openMoreOptions();
          }}
          className="outline-none cursor-pointer"
        >
          <MoreVert fontSize="small" />
        </button>
      )}
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
