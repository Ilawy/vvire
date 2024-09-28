import { NotFoundError } from "@/lib/result";
import { fetchArticle, fetchArticleSlugs } from "../actions";
import Renderer from "./renderer";
import { notFound } from "next/navigation";

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const articlesResult = await fetchArticleSlugs();
  //FATAL
  if (articlesResult.isErr()) throw new Error(articlesResult.error.message);
  const articles = articlesResult.value;
  const paths = articles.map((art) => ({ slug: art.slug }));
  return paths;
};

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

  return <Renderer article={article} />;
}
