"use client";
import React, { useState } from "react";
import { DropDownMenu } from "@/components";
import { Logout, Settings } from "@mui/icons-material";

const Sidebar = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuItems = [
    { id: "settings", name: "settings", icon: <Settings fontSize="small" /> },
    {
      id: "logout",
      name: "logout",
      className: "text-neutral-500",
      icon: <Logout fontSize="small" />,
    },
  ];
  // User Account Menu
  const handleCloseAccountMenu = () => {
    setAccountMenuOpen(false);
  };
  const handleSelectAccountMenu = (optionId) => {
    setAccountMenuOpen(false);

    if (optionId === "delete") {
      console.log("Deleting chat…");
    }
    if (optionId === "archive") {
      console.log("Archiving chat…");
    }
  };

  return (
    <div className="h-full w-[360px] p-4 flex flex-col border-r border-neutral-800 bg-neutral-950">
      {/* Logo / Header */}
      <div className="mb-6">
        <span className="font-bold text-sm text-white">Open Chat</span>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-white text-sm cursor-pointer">
          Chat 1
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-white text-sm cursor-pointer">
          Chat 2
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-white text-sm cursor-pointer">
          Chat 3
        </button>
      </div>

      {/* Account Menu */}
      <div className="pt-4 border-t border-neutral-800 mt-4 relative">
        <DropDownMenu
          state={accountMenuOpen}
          items={accountMenuItems}
          onSelect={handleSelectAccountMenu}
          closeDropDown={handleCloseAccountMenu}
          align="bottom"
          spacing="12"
          className="w-full"
        />
        <button
          className="w-full text-left px-3 py-3 rounded-lg hover:bg-neutral-800 text-white text-sm cursor-pointer"
          onClick={() => setAccountMenuOpen((prev) => !prev)}
        >
          user@usermail.com
          {/* <div>
            <img src="" alt="" />
          </div> */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
