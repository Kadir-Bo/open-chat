import { useChat, useDatabase, useModal } from "@/context";
import React from "react";

const DeleteAllChatsModal = ({ id }) => {
  const { deleteAllChats } = useDatabase();
  const { closeModal } = useModal();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteAllChats();
      closeModal(id);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };
  return (
    <div>
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">Delete All Chats</h2>

      {/* Confirmation text */}
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete your entire chat history?
        <br />
        This action cannot be undone.
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm rounded-md bg-red-800 text-white hover:bg-red-700 transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAllChatsModal;
