import dynamic from "next/dynamic";
import { publishArticle } from "@/app/actions";

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <>...</>,
});

export default function EditorPage() {
  return (
    <main className="p-3 my-10 mx-auto max-w-4xl overflow-hidden text-slate-800 dark:text-slate-200">
      <Editor operation="create" func={publishArticle} />
    </main>
  );
}
