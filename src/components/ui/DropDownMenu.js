"use client";

import { useOnClickOutside } from "@/hooks";
import React, { useRef } from "react";

const DropDownMenu = ({
  state = false,
  closeDropDown,
  items = [],
  onSelect = () => {},
  selecteditem = null,
  align = "top",
  spacing = "0",
  className = "",
}) => {
  const positionClasses = {
    top: `top-${spacing}`,
    bottom: `bottom-${spacing}`,
    left: `left-${spacing}`,
    right: `right-${spacing}`,
  };

  const DropDownRef = useRef(null);
  useOnClickOutside(DropDownRef, () => closeDropDown());
  return (
    state && (
      <div
        className={`absolute z-10 w-40 bg-neutral-900 border border-neutral-700 rounded-xl shadow p-1 ${
          positionClasses[align] || positionClasses.bottom
        }
        ${className}
        `}
        ref={DropDownRef}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 hover:text-white rounded-lg cursor-pointer font-medium capitalize ${
              selecteditem === item.id ? "text-white" : "text-neutral-400"
            }
            ${item.className ? item.className : ""}
            ${item.icon ? "flex flex-row justify-start items-center gap-2" : ""}
            `}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>
    )
  );
};

export default DropDownMenu;
