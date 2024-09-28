"use client";
import { SyncLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoginButton from "./login-button";

export default function HomeCTA() {
  const session = useSession();
  if (session.status === "loading") return <SyncLoader color="purple" />;

  return session.status === "authenticated" ? (
    <Link href={"/board"}>
      <button className="py-5 px-10 rounded-2xl bg-purple-100 hover:px-11 hover:py-6 hover:bg-purple-200 hover:-translate-y-3 hover:shadow-lg active:shadow-sm active:scale-95 transition-all">
        Dashboard
      </button>
    </Link>
  ) : (
    <LoginButton />
  );
}
