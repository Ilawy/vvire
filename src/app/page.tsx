import Link from "next/link";
import { auth } from "./auth";
import LoginButton from "@/components/login-button";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div className="">
      <header className="border-b p-3">
        <small>About</small>
      </header>
      <main className="p-6 my-10 mx-auto max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-center">Your blog is just on click away</h1>
        <p className="text-2xl">Make content without wasting time</p>
        <div>
          {session ? (
            <Link href={"/board"}>
              <button className="py-5 px-10 rounded-2xl bg-purple-100 hover:px-11 hover:py-6 hover:bg-purple-200 hover:-translate-y-3 hover:shadow-lg active:shadow-sm active:scale-95 transition-all">
                Dashboard
              </button>
            </Link>
          ) : (
            <LoginButton />
          )}
        </div>
      </main>
    </div>
  );
}
