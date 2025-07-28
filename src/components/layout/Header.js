"use client";
import { ChevronRight, MoreHoriz, ShareRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { DropDownMenu } from "@/components";
import { useAuth, useChat } from "@/context";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { modelName, changeModel, supportedModels } = useChat();
  const { user } = useAuth();
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const currentModel = supportedModels.find((m) => m.id === modelName);

  const handleSelectModel = (modelId) => {
    changeModel(modelId);
    setIsModelOpen(false);
  };

  const handleMoreOptionSelect = (optionId) => {
    setIsMoreOptionsOpen(false);
    if (optionId === "delete") console.log("Deleting chat…");
    if (optionId === "archive") console.log("Archiving chat…");
  };

  return (
    <div className="py-4 flex justify-between items-center w-full">
      {/* Model selector */}
      {isHomeRoute ? (
        <div className="relative inline-block text-left pl-4 w-max">
          <button
            onClick={() => setIsModelOpen((prev) => !prev)}
            className="inline-flex justify-start gap-2 px-4 py-3 text-sm font-semibold cursor-pointer text-white rounded-lg shadow outline-none"
          >
            <div className="font-light">
              <span className="font-bold mr-1">Model:</span>
              <span>{currentModel?.name}</span>
            </div>
            <ChevronRight fontSize="small" className="rotate-90" />
          </button>

          <DropDownMenu
            state={isModelOpen}
            items={supportedModels}
            onSelect={handleSelectModel}
            selectedItem={modelName}
            closeDropDown={() => setIsModelOpen(false)}
            className="top-12"
          />
        </div>
      ) : (
        <nav className="w-full flex justify-between items-center fixed top-0 leading-0 px-8 py-4">
          <Link className="font-semibold" href={"/"}>
            Open Chat
          </Link>
          <div className="flex gap-4">
            <Link
              href={"/sign-in"}
              className="w-max px-4 py-2 border rounded-md text-sm border-neutral-200 hover:border-white bg-neutral-200 hover:bg-white text-black capitalize"
            >
              sign in
            </Link>
            <Link
              href={"/sign-up"}
              className="w-max px-4 py-2 border rounded-md text-sm border-neutral-400 text-neutral-300 capitalize hover:border-white hover:text-white"
            >
              sign up
            </Link>
          </div>
        </nav>
      )}

      {user && (
        <div className="pr-4 w-max flex justify-end items-center gap-4">
          <button
            className="flex justify-center items-center gap-1 text-sm font-semibold hover:bg-neutral-900 cursor-pointer px-4 py-2 rounded-full"
            onClick={() => console.log("Sharing chat…")}
          >
            Share
            <ShareRounded fontSize="inherit" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMoreOptionsOpen((prev) => !prev)}
              className="p-3 cursor-pointer flex items-center justify-center hover:bg-neutral-900 rounded-md"
            >
              <MoreHoriz fontSize="inherit" />
            </button>

            <DropDownMenu
              state={isMoreOptionsOpen}
              items={[
                { id: "delete", name: "Delete Chat" },
                { id: "archive", name: "Archive Chat" },
              ]}
              onSelect={handleMoreOptionSelect}
              closeDropDown={() => setIsMoreOptionsOpen(false)}
              className="right-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
