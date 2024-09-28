"use client";
import { LoginButton as TelegramButton } from "@telegram-auth/react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <TelegramButton
      onAuthCallback={(data) => {
        // signIn("debug", {}, data);
        signIn("telegram", {}, data);
      }}
      botUsername="vvirebot"
    />
  );
}
