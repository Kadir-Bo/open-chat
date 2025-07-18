"use client";
import { MoreHoriz, ShareRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { DropDownMenu } from "@/components";

const ChatHeader = () => {
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const models = [
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-3.5", name: "GPT-3.5" },
    { id: "llama-3", name: "LLaMA 3" },
    { id: "mistral-7b", name: "Mistral 7B" },
  ];

  const moreOptions = [
    { id: "delete", name: "Delete Chat" },
    { id: "archive", name: "Archive Chat" },
  ];

  const currentModel = models.find((m) => m.id === selectedModel);

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    setIsModelOpen(false);
  };
  const handleCloseModelDropdown = () => {
    setIsModelOpen(false);
  };
  // More Options
  const handleCloseMoreOptionsDropDown = () => {
    setIsMoreOptionsOpen(false);
  };
  const handleMoreOptionSelect = (optionId) => {
    setIsMoreOptionsOpen(false);

    if (optionId === "delete") {
      console.log("Deleting chat…");
    }
    if (optionId === "archive") {
      console.log("Archiving chat…");
    }
  };

  const handleShare = () => {
    console.log("Sharing chat…");
  };

  return (
    <div className="py-4 flex justify-between items-center w-full">
      {/* Model selector */}
      <div className="relative inline-block text-left pl-4">
        <button
          onClick={() => setIsModelOpen((prev) => !prev)}
          className="inline-flex justify-start gap-2 w-max px-4 py-3 text-sm font-semibold cursor-pointer text-white rounded-xl shadow outline-none"
        >
          <span className="font-light">Model:</span>
          {currentModel?.name}
        </button>

        <DropDownMenu
          state={isModelOpen}
          items={models}
          onSelect={handleSelectModel}
          selectedItem={selectedModel}
          align="top"
          spacing="8"
          closeDropDown={handleCloseModelDropdown}
        />
      </div>

      {/* Share & More */}
      <div className="pr-4 w-max flex justify-end items-center gap-4">
        <div>
          <button
            className="flex justify-center items-center gap-1 text-sm font-semibold hover:bg-neutral-900 cursor-pointer px-4 py-2 rounded-full"
            onClick={handleShare}
          >
            Share
            <ShareRounded fontSize="inherit" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMoreOptionsOpen((prev) => !prev)}
            className="p-3 cursor-pointer flex items-center justify-center hover:bg-neutral-900 rounded-md"
          >
            <MoreHoriz fontSize="inherit" />
          </button>

          <DropDownMenu
            state={isMoreOptionsOpen}
            items={moreOptions}
            onSelect={handleMoreOptionSelect}
            align={"right"}
            closeDropDown={handleCloseMoreOptionsDropDown}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
