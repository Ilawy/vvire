import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <header className="bg-red-200 p-3"></header>
      <main className="p-6 my-10 mx-auto max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-center">Your blog is just on click away</h1>
        <p className="text-2xl">Make content without wasting time</p>
        <div>
          <Link
            href={"/flow/telegram"}
            className="py-3 px-6 rounded-xl bg-blue-500 text-white"
          >
            Continue with Telegram
          </Link>
        </div>
      </main>
    </div>
  );
}
