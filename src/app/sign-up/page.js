"use client";
import React, { useState } from "react";
import { useAuth } from "@/context";
import { useRouter } from "next/navigation";
import { Header, SignInWithGoogle } from "@/components";
import Link from "next/link";

const SignUp = () => {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(email, password);
      router.push("/chat");
    } catch (err) {
      setError(err.message);
    }
    setIsSubmitting(false);
  };

  const resetFormError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start pt-48">
      <Header />
      <form
        onSubmit={handleSubmit}
        className="border border-neutral-800 text-gray-100 rounded-lg w-full p-8 relative max-w-md"
        onFocus={resetFormError}
      >
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

        <div>
          <label
            htmlFor="email"
            className="block text-neutral-400 mb-2 text-sm font-medium"
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
            htmlFor="password"
            className="block text-neutral-400 mb-2 text-sm font-medium"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-500"
            placeholder="password"
          />
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-neutral-400 mb-2 text-sm font-medium"
          >
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-500"
            placeholder="confirm password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full border border-neutral-400 hover:border-blue-400 text-neutral-300 bg-black/50 hover:bg-black hover:text-white cursor-pointer transition-all duration-200 py-3 rounded-md font-medium disabled:opacity-50"
        >
          {isSubmitting || loading ? "Signing Up..." : "Sign Up"}
        </button>
        <hr className="my-4 border-neutral-600" />
        <SignInWithGoogle />
        <div className="mt-8">
          <p className={`text-sm text-center text-gray-500`}>
            Already have an account?{" "}
            <Link
              href={"/sign-in"}
              className={`underline text-blue-500 font-medium`}
            >
              sign-in here
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

export default SignUp;
