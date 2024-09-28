import nextDynamic from "next/dynamic";

const HomeCTA = nextDynamic(() => import("@/components/home-cta"), {
  ssr: false,
});

export const dynamic = "force-static";

export default async function Home() {
  return (
    <div className="">
      <header className="border-b p-3">
        <small>About</small>
      </header>
      <main className="p-6 my-10 mx-auto max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-center">Your blog is just on click away</h1>
        <p className="text-2xl">Make content without wasting time</p>
        <div>
          <HomeCTA />
        </div>
      </main>
    </div>
  );
}
