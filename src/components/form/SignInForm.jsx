import { useAuth } from "@/context";
import Link from "next/link";
import React, { useState } from "react";

const SignInForm = ({ theme = "light", description = "" }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isDark = theme === "dark";

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="mb-6 ">
          <h2
            className={`text-2xl font-semibold mb-2 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Sign In
          </h2>
          {description && (
            <p className={`${isDark ? "text-white" : "text-gray-500"}`}>
              {description}
            </p>
          )}
        </div>
        <div>
          <label
            className={`block mb-1 text-sm font-medium ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
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
            className={`w-full mb-4 px-4 py-3 rounded border focus:outline-none focus:border-neutral-500 ${
              isDark
                ? "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500"
                : "bg-white border-gray-300 text-black placeholder-gray-400"
            }`}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            className={`block mb-1 text-sm font-medium ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
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
            className={`w-full mb-6 px-4 py-3 rounded border focus:outline-none focus:border-neutral-500 ${
              isDark
                ? "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500"
                : "bg-white border-gray-300 text-black placeholder-gray-400"
            }`}
            placeholder="password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className={`w-full transition-all duration-200 py-3 rounded-md font-semibold disabled:opacity-50 cursor-pointer ${
            isDark
              ? "border border-neutral-400 hover:border-blue-400 text-neutral-300 bg-black/50 hover:bg-black hover:text-white"
              : "border border-blue-400 hover:border-blue-600 text-white bg-blue-600 hover:bg-blue-800"
          }`}
        >
          {isSubmitting || loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="mt-8">
          <p
            className={`text-sm text-center ${
              isDark ? "text-white" : "text-gray-500"
            }`}
          >
            Don't have an account?{" "}
            <Link
              href={"/sign-up"}
              className={`underline text-blue-500 font-medium`}
            >
              sign-up here
            </Link>
          </p>
        </div>
        {error && (
          <div className="w-full absolute -bottom-28">
            <p className="border border-red-500 text-white text-center py-4 bg-neutral-950 rounded-lg">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignInForm;
