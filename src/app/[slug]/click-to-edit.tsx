"use client";

import { useSession } from "next-auth/react";
import { Edit3Icon } from "lucide-react";
import Link from "next/link";

export default function ClickToEdit({
  author_id,
  slug,
}: {
  author_id: string;
  slug: string;
}) {
  const session = useSession();

  return session.status === "loading" ? (
    "..."
  ) : session.status === "unauthenticated" ? null : session.status ===
      "authenticated" &&
    session.data.user &&
    session.data.user.id === author_id ? (
    <Link href={`/editor/${slug}`}>
      <button className="p-2 border shadow-sm rounded-lg hover:bg-slate-100 active:bg-slate-200">
        <Edit3Icon />
      </button>
    </Link>
  ) : null;
}
