"use client";
import React, { useState } from "react";
import { useAuth } from "@/context";
import { useRouter } from "next/navigation";
import { Header, SignInForm } from "@/components";

const SignIn = () => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/chat");
    } catch (err) {
      setError(err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center">
      <Header />
      <div className="border border-neutral-800 text-gray-100 rounded-lg w-full max-w-md p-8">
        <SignInForm theme="dark" />
      </div>
    </div>
  );
};

export default SignIn;
