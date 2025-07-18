"use client";
import { useAuth } from "@/context";
import Link from "next/link";
import React from "react";
const PublicNavigation = () => {
  return (
    <nav className="w-full mx-auto h-max flex items-center justify-between py-5 px-8">
      <div>
        <Link href="/" className="p-4 flex font-semibold">
          Open Chat
        </Link>
      </div>
      <div className="flex gap-2">
        <Link href={"/sign-in"} className="text-sm px-4 py-2">
          Sign In
        </Link>
        <Link
          href={"/sign-up"}
          className="text-sm px-4 py-2 bg-white text-black font-medium rounded"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};
const Header = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: Skeleton oder gar nichts
    return null;
  }

  return (
    <header className="fixed top-0 leading-0 w-full border-b border-neutral-800">
      {user ? null : <PublicNavigation />}
    </header>
  );
};

export default Header;
