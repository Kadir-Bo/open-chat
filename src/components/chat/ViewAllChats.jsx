import React, { useState, useMemo } from "react";
import { DeleteAllChatsModal, Searchbar } from "..";
import { useChat, useModal } from "@/context";

const ViewAllChats = () => {
  const { chatsList } = useChat();
  const { openModal } = useModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChats, setSelectedChats] = useState([]);

  // Filter chats by search term (case insensitive)
  const filteredChats = useMemo(() => {
    if (!searchTerm) return chatsList;
    return chatsList.filter((chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, chatsList]);

  const totalChatsCount = chatsList.length;
  const selectedChatsCount = selectedChats.length;

  const handleSearch = () => {
    // Currently search updates live on input change, so this can be empty or used for debounce
    // Just a placeholder for now
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSelectChat = (chatId) => {
    setSelectedChats((prevSelected) => {
      if (prevSelected.includes(chatId)) {
        // Unselect if already selected
        return prevSelected.filter((id) => id !== chatId);
      } else {
        // Add to selected
        return [...prevSelected, chatId];
      }
    });
  };
  const handleDeleteAllChats = () => {
    openModal(<DeleteAllChatsModal />);
  };
  return (
    <div className="xl:max-w-6xl w-11/12 px-8 mx-auto flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hidden pb-48">
      <Searchbar
        value={searchTerm}
        onChange={handleInputChange}
        onSearch={handleSearch}
      />
      {chatsList.length >= 1 && (
        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-gray-400">
            Selected {selectedChatsCount}/{totalChatsCount}
          </span>
          <button
            className="px-4 py-2 rounded-md border border-red-500 text-white text-sm font-medium tracking-wide cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            onClick={handleDeleteAllChats}
          >
            Delete all
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const isSelected = selectedChats.includes(chat.id);
            return (
              <div
                key={chat.id}
                onClick={() => toggleSelectChat(chat.id)}
                className={`border px-5 py-4 rounded-lg cursor-pointer select-none ${
                  isSelected
                    ? "border-blue-500 bg-blue-900"
                    : "border-neutral-500"
                }`}
              >
                <p>{chat.title}</p>
              </div>
            );
          })
        ) : (
          <p className="text-neutral-500 text-sm mt-12 pl-6">No chats found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllChats;
