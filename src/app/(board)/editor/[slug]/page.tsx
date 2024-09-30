import dynamic from "next/dynamic";
import { fetchArticle, updateArticle } from "@/app/actions";
import { NotFoundError } from "@/lib/result";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";

const Editor = dynamic(() => import("../editor"), {
  ssr: false,
  loading: () => <>...</>,
});

export default async function EditorPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const result = await fetchArticle(slug, true);
  if (result.isErr()) {
    if (result.error instanceof NotFoundError) notFound();
    return <div>{result.error.message}</div>;
  }
  const article = result.value;
  console.log(article);

  return (
    <main className="p-6 my-10 mx-auto max-w-4xl overflow-hidden text-slate-800 dark:text-slate-200">
      <Editor
        operation="update"
        data={{
          blocks: article.content,
          time: DateTime.fromJSDate(article.added_at!).toUnixInteger(),
          slug: article.slug,
          title: article.title,
        }}
        func={updateArticle}
      />
    </main>
  );
}
