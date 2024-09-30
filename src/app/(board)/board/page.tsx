import { fetchMyArticles } from "@/app/actions";
import Display from "./display";

export const revalidate = 0;

export default async function BoardPage(props: {
  searchParams: {
    page?: string;
    q?: string;
  };
}) {
  const page = isNaN(Number(props.searchParams.page))
    ? 0
    : Number(props.searchParams.page);
  const result = await fetchMyArticles(page * 10);
  if (result.isErr()) {
    return <div>{result.error.message}</div>;
  }

  console.log(result);

  return (
    <main className="p-6 my-10 mx-auto max-w-4xl dark:text-slate-200">
      <h2>Welcome Back</h2>
      {
        <Display
          items={result.value}
          total={result?.value?.[0]?.count || 0}
          page={page}
          search={props.searchParams.q}
        />
      }
    </main>
  );
}
