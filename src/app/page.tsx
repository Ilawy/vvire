import LocalLoginButton from "@/components/local-login-button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import nextDynamic from "next/dynamic";
import Link from "next/link";

const HomeCTA = nextDynamic(() => import("@/components/home-cta"), {
  ssr: false,
});

export const dynamic = "force-static";

export default async function Home() {
  return (
    <div className="">
      {/* <header className="border-b p-3">
        <small>About</small>
      </header> */}
      <main
        className={cn(
          "p-6 my-10 mx-auto max-w-4xl flex flex-col gap-4",
          "dark:prose-invert text-slate-800 dark:text-slate-200"
        )}
      >
        <h2 className="font-semibold">Streamline Your Publishing Workflow</h2>
        <p className="text-2xl">
          Focus on what matters most – creating great content. Our minimalist
          publishing tool helps you stay productive and efficient.
        </p>
        <div className="flex gap-4">
          <HomeCTA />
          {process.env.NODE_ENV === "development" && <LocalLoginButton />}
          <Link href={"/about"} className="flex items-center gap-2">
            Learn More <ArrowRight />
          </Link>
        </div>
        <section className="prose-xl">
          <h3>Changelog</h3>
          <div>
            <h4>29 Sept, 2024</h4>
            <ul>
              <li>
                <p>Initial release with basic features</p>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
