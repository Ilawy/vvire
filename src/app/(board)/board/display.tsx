"use client";
import { Article } from "@/db/schema/models";
import { cn } from "@/lib/utils";
import { EyeIcon, PlusIcon, SearchIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Display({
  items,
  total,
  page,
  search,
}: {
  items: Pick<Article, "id" | "slug" | "added_at" | "title">[];
  total: number;
  page: number;
  search?: string;
}) {
  const pages = Math.ceil(total / 10);
  const params = useSearchParams();
  return (
    <div>
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-stretch w-fit">
          <input
            type="text"
            className="border h-full p-3 rounded-tl-xl rounded-bl-xl"
            placeholder="Search"
            defaultValue={search}
          />
          <button className="bg-purple-200 px-4 rounded-tr-xl rounded-br-xl">
            <SearchIcon />
          </button>
        </div>
        <Link href={"/editor"}>
          <button className="border p-3 rounded-lg shadow-md">
            <PlusIcon />
          </button>
        </Link>
      </div>
      <ul className="my-3 grid grid-cols-1 md:grid-cols-3  gap-3 w-full">
        {items.map((item) => {
          return (
            <Link key={item.slug} href={`/${item.slug}`} className="contents">
              <li className="shadow border p-3">
                <div className="col-span-full py-2 flex" dir="auto">
                  <bdi>{item.title}</bdi>
                </div>
                <div className="col-span-full flex items-center justify-between p-1">
                  <small>
                    <i>
                      {DateTime.fromJSDate(item.added_at!).toFormat(
                        "dd LLL yyyy"
                      )}
                    </i>
                  </small>
                  <small className="flex items-center gap-1">
                    <EyeIcon size={16} /> <span>25</span>
                  </small>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {[...Array(pages)].map((_, i) => {
            const currentParams = new URLSearchParams(params);
            currentParams.set("page", `${i}`);
            return (
              <Link
                className={cn({ "font-bold": i === page })}
                href={`?${currentParams.toString()}`}
                key={i}
              >
                {i + 1}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
