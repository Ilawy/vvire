import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";

import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import NestedList from "@editorjs/nested-list";
//@ts-expect-error Typeless
import Checklist from "@editorjs/checklist";
// // @ts-expect-error Typeless
// import Embed from "@editorjs/embed";
import Table from "@editorjs/table";

export default function createEditorJS(
  data?: OutputData,
  config?: EditorConfig
) {
  const finalConfig: EditorConfig = {
    holder: "editorjs",
    data,

    //TODO CHECK US
    tools: {
      //@ts-expect-error Type conflict
      header: {
        class: Header,
        inlineToolbar: true,
      },
      //@ts-expect-error Type conflict
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      delimiter: Delimiter,
      //@ts-expect-error Type conflict
      list: {
        class: NestedList,
        inlineToolbar: true,
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      //@ts-expect-error Type conflict
      table: {
        class: Table,
        inlineToolbar: true,
      },
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
    inlineToolbar: true,
    ...(config || {}),
  };
  return new EditorJS(finalConfig);
}
