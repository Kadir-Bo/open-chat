"use client";
import React, { useState } from "react";
import { useAuth } from "@/context";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex flex-col items-center justify-start pt-48  px-4 max-w-md mx-auto gap-8">
      <form
        onSubmit={handleSubmit}
        className="border border-neutral-800 text-gray-100 rounded-lg w-full p-8"
      >
        <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

        <div>
          <label
            className="block text-neutral-400 mb-2 text-sm font-medium"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            className="block text-neutral-400 mb-2 text-sm font-medium"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-500"
            placeholder="password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full border border-neutral-400 hover:border-purple-400 text-neutral-300 bg-black/50 hover:bg-black hover:text-white cursor-pointer transition-all duration-200 py-3 rounded-md font-semibold disabled:opacity-50"
        >
          {isSubmitting || loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {error && (
        <div className="w-full">
          <p className="border border-red-800/50 w-full text-white p-3 mb-4 text-center rounded-lg">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
