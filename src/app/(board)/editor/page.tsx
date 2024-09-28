import dynamic from "next/dynamic";
import { publishArticle } from "@/app/actions";

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <>...</>,
});

export default function EditorPage() {
  return (
    <div>
      <h1>Editor</h1>
      <Editor operation="create" func={publishArticle} />
    </div>
  );
}
