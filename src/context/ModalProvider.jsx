"use client";
import { useOnClickOutside } from "@/hooks";
import { Close } from "@mui/icons-material";
import React, { createContext, useContext, useRef, useState } from "react";

const ModalContext = createContext(undefined);

export function ModalProvider({ children }) {
  const [isModal, setIsModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef(null);
  const openModal = (content) => {
    setModalContent(content);
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
    setModalContent(null);
  };

  useOnClickOutside(modalRef, () => closeModal());
  const values = {
    isModal,
    openModal,
    closeModal,
    modalContent,
  };

  return (
    <ModalContext.Provider value={values}>
      {isModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="pointer-events-auto p-8 bg-white rounded-xl min-w-md text-black relative max-w-xl w-full"
              ref={modalRef}
            >
              <button
                className="text-gray-400 aspect-square w-8 absolute top-2 right-2 cursor-pointer hover:text-gray-800"
                onClick={closeModal}
              >
                <Close fontSize="inherit" />
              </button>
              {modalContent}
            </div>
          </div>
        </>
      )}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
