import { NotFoundError } from "@/lib/result";
import { notFound } from "next/navigation";
import { z } from "zod";
import PageNotAvailable from "./page-not-available";
import { DateTime } from "luxon";
import { fetchArticle } from "../actions";
import ClickToEdit from "./click-to-edit";
export const revalidate = 0;

const BaseBlock = z.object({
  id: z.string(),
});
const HeaderBlock = BaseBlock.extend({
  type: z.literal("header"),
  data: z.object({
    text: z.string(),
    level: z.number().min(1).max(6),
  }),
});
const ParagraphBlock = BaseBlock.extend({
  type: z.literal("paragraph"),
  data: z.object({
    text: z.string(),
  }),
});
const Block = z.union([HeaderBlock, ParagraphBlock]);

export default async function RenderPage({
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
  const content = Block.array().safeParse(result.value.content);
  if (!content.success) {
    console.log(content.error);
    return <PageNotAvailable />;
  }

  if (result)
    return (
      <main className="p-6 my-10 mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1>{article.title}</h1>
          <ClickToEdit author_id={article.author_id} slug={article.slug} />
        </div>
        <article className="prose-xl prose-p:text-lg">
          <p className="text-gray-500 italic">
            {DateTime.fromJSDate(article.added_at!).toFormat("dd LLL yyyy")} -
            by {article.author}
          </p>
          {content.data.map((block) => {
            if (block.type === "header") {
              const H = `h${block.data.level}` as "h1" | "h2" | "h3" | "h4";
              return <H key={block.id}>{block.data.text}</H>;
            }
            if (block.type === "paragraph") {
              return <p key={block.id}>{block.data.text}</p>;
            }
          })}
        </article>
      </main>
    );
}
