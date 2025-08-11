import React, { useState } from "react";
import {
  AccountSettings,
  InterfaceSettings,
  NotificationsSettings,
  PrivacySettings,
} from "@/components";

const UserSettingsModal = () => {
  const settingItems = [
    {
      id: "account",
      label: "Account Settings",
      component: <AccountSettings />,
    },
    {
      id: "interface",
      label: "User Interface",
      component: <InterfaceSettings />,
    },
    {
      id: "notifications",
      label: "Notifications",
      component: <NotificationsSettings />,
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      component: <PrivacySettings />,
    },
  ];

  const [activeSetting, setActiveSetting] = useState(settingItems[0].id);

  const currentContent = settingItems.find(
    (item) => item.id === activeSetting
  )?.component;

  return (
    <div className="max-w-3xl w-full flex flex-row justify-start items-start gap-4">
      {/* Sidebar Navigation */}
      <ul className="flex-1 flex flex-col gap-1 min-w-max border-r border-neutral-300 pr-4">
        {settingItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveSetting(item.id)}
            className={`cursor-pointer px-4 py-3 rounded-md text-sm text-neutral-700 font-medium ${
              activeSetting === item.id
                ? "bg-neutral-700 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>

      {/* Content Area */}
      <div className="w-full min-w-md">{currentContent}</div>
    </div>
  );
};

export default UserSettingsModal;
