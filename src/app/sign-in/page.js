"use client";
import React, { useEffect } from "react";
import { Header, SignInForm } from "@/components";
import { useAuth } from "@/context";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // Redirect to home if user is logged in
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null; // Avoid flicker or showing sign-in page while checking
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start pt-48">
      <Header />
      <div className="border border-neutral-800 text-gray-100 rounded-lg w-full max-w-md p-8">
        <SignInForm theme="dark" />
      </div>
    </div>
  );
};

export default SignIn;
