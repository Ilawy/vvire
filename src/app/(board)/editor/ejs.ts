import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";

import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import NestedList from "@editorjs/nested-list";
//@ts-expect-error Typeless
import Checklist from "@editorjs/checklist";
//@ts-expect-error Typeless
import Embed from "@editorjs/embed";

export default function createEditorJS(
  data?: OutputData,
  config?: EditorConfig
) {
  const finalConfig = {
    holder: "editorjs",
    data,

    tools: {
      header: Header,
      quote: Quote,
      delimiter: Delimiter,
      list: NestedList,
      checklist: Checklist,
      embed: Embed,
      // embed: {
      //   class: Embed,
      //   config: {
      //     services: {
      //       codepen: true,
      //       youtube: true,
      //       github: true,
      //     },
      //   },
      // },
    },
    placeholder: "Your Story...",
    ...(config || {}),
  };
  return new EditorJS(finalConfig);
}
