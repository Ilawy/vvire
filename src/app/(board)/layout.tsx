import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) return children;

  redirect("/");
}
