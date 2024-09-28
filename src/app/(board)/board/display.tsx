"use client";
import { Redirect } from "@/db/schema/models";

export default function Display({
  items,
}: {
  items: Omit<Redirect, "added_by">[];
}) {
  console.log(items);

  return (
    <div>
      <ul className="p-6">
        {items.map((item) => {
          return (
            <li key={item.id}>
              {item.source} -&gt; {item.dest}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
