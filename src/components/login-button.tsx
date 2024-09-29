"use client";
import { LoginButton as TelegramButton } from "@telegram-auth/react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const username = process.env.NEXT_PUBLIC_BOT_USERNAME;
  if (!username) throw new Error("NEXT_PUBLIC_BOT_USERNAME is not defined");
  return (
    <TelegramButton
      onAuthCallback={(data) => {
        // signIn("debug", {}, data);
        signIn("telegram", {}, data);
      }}
      botUsername={username}
    />
  );
}
