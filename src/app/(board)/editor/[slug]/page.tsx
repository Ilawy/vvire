import dynamic from "next/dynamic";
import { Suspense } from "react";
import { fetchArticle, publishArticle, updateArticle } from "@/app/actions";
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
  const result = await fetchArticle(slug);
  if (result.isErr()) {
    if (result.error instanceof NotFoundError) notFound();
    return <div>{result.error.message}</div>;
  }
  const article = result.value;
  console.log(article);

  return (
    <div>
      <h1>Editor</h1>
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
    </div>
  );
}
