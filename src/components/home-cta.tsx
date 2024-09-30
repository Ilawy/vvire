"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoginButton from "./login-button";

export default function HomeCTA() {
  const session = useSession();
  if (session.status === "loading")
    return (
      <svg
        width={32}
        height={32}
        version="1.1"
        id="L4"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
      >
        <circle fill="#000" stroke="none" cx="6" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle fill="#000" stroke="none" cx="26" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle fill="#000" stroke="none" cx="46" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    );

  return session.status === "authenticated" ? (
    <Link href={"/board"}>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Dashboard
      </button>
    </Link>
  ) : (
    <LoginButton />
  );
}
