import { useAuth } from "@/context";
import { Google } from "@mui/icons-material";
import React from "react";

const SignInWithGoogle = ({
  isDark = true,
  isSubmitting = false,
  loading = false,
}) => {
  const { signInWithGoogle } = useAuth();
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in as:", user.displayName);
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isSubmitting || loading}
      className={`w-full flex items-center justify-center gap-2 transition-all duration-200 py-3 rounded-md font-medium disabled:opacity-50 cursor-pointer ${
        isDark
          ? "border border-neutral-400 hover:border-blue-400 text-neutral-300 bg-black/50 hover:bg-black hover:text-white"
          : "border border-blue-400 hover:border-blue-600 text-white bg-blue-600 hover:bg-blue-800"
      }`}
    >
      {isSubmitting || loading ? "Signing In..." : "Sign In with Google"}
      <Google fontSize="small" />
    </button>
  );
};

export default SignInWithGoogle;
