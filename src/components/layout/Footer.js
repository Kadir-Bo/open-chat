"use client";

import { useAuth } from "@/context";
import React from "react";

const Footer = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    !user && (
      <footer className="w-full h-max flex items-center justify-between py-2 px-8">
        <div className="p-4">Footer</div>
      </footer>
    )
  );
};
export default Footer;
