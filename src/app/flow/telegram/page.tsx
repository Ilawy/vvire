import { Suspense } from "react";
import { TelegramClientFlow } from "./client";
import { generateCode } from "@/app/actions";

export default function Page() {
  return (
    <main className="p-6 my-10 mx-auto max-w-4xl flex flex-col items-center gap-4">
      <div className="border p-3 w-full rounded-xl">
        <h2>Telegram Sign in</h2>
        <Suspense fallback="...">
          <TelegramClientFlow generateCode={generateCode} />
        </Suspense>
      </div>
    </main>
  );
}
