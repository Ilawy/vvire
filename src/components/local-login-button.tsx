"use client";
import { signIn } from "next-auth/react";

export default function LocalLoginButton() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        // signIn("debug", {}, data);
        signIn("local", {}, {});
      }}
    >
      Login Locally
    </button>
  );
}
