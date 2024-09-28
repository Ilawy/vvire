"use client";

import { useEffectOnce } from "react-use";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useState } from "react";

import Header from "@editorjs/header";
import Quote from "@editorjs/quote";

import {
  type publishArticle as _publishArticle,
  type updateArticle as _updateArticle,
} from "@/app/actions";
import { useForm } from "react-hook-form";
import { ErrorEnum, resultifyJson, CompleteError } from "@/lib/result";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Result } from "ts-results-es";

const VERSION = "2.30.6";

interface FormProps {
  title: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

type EditorProps =
  | {
      operation: "create";
      func: typeof _publishArticle;
    }
  | {
      operation: "update";
      data: Omit<OutputData, "version"> & {
        title: string;
        slug: string;
      };
      func: typeof _updateArticle;
    };

export default function Editor(props: EditorProps) {
  let done = false;
  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [showExtras, setShowExtras] = useState(false);
  const { register, handleSubmit, watch } = useForm<FormProps>();
  const currentFormData = watch();
  const router = useRouter();

  async function submit(formProps: FormProps) {
    if (!formProps.slug)
      formProps.slug = slugify(formProps.title.trim(), {
        lower: true,
      });

    if (!/^[a-z0-9-]{4,}$/.test(formProps.slug)) {
      console.log("bad slug");
      return;
    }

    if (!editor) return;
    const output = await editor.save();
    if (output.blocks.length === 0) {
      //TODO show error
      console.log("show error");
      return;
    }
    let result: Result<string, CompleteError>;
    if (props.operation === "create") {
      result = resultifyJson(
        await props.func({
          title: formProps.title,
          slug: formProps.slug,

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: output.blocks as any,
          time: output.time!,
        })
      );
    } else {
      result = resultifyJson(
        await props.func(props.data.slug, {
          slug: formProps.slug,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: output.blocks as any,
          title: formProps.title,
        })
      );
    }

    console.log(result);

    if (result.isOk()) {
      toast.success("published successfully");
      router.push(`/${result.value}`);
      return;
    }
    if (
      result.error instanceof CompleteError &&
      result.error.code === ErrorEnum.AlreadyExists
    ) {
    }
  }
  useEffectOnce(() => {
    if (done) return;
    const data =
      props.operation === "update"
        ? {
            version: VERSION,
            blocks: props.data.blocks,
            time: props.data.time,
          }
        : undefined;
    const editor = new EditorJS({
      holder: "editorjs",
      data,
      tools: {
        header: Header,
        quote: Quote,
      },
      placeholder: "Your Story...",
      onReady() {},
    });
    setEditor(editor);
    done = true;
  });
  return (
    <main className="max-w-3xl mx-auto p-3">
      <form onSubmit={handleSubmit(submit)} className="contents">
        <div className="flex items-center  flex-wrap my-3 gap-3">
          <input
            placeholder="Title"
            type="text"
            className="text-3xl px-3 py-2.5 flex-1"
            required
            defaultValue={props.operation === "update" ? props.data.title : ""}
            {...register("title")}
          />
          <button className="border rounded-lg px-3 py-2">Publish</button>
          <button
            className="border rounded-lg px-3 py-2"
            type="button"
            onClick={() => setShowExtras(!showExtras)}
          >
            ...
          </button>
        </div>
        <div
          className={cn(
            "overflow-hidden transition-all ease-in-out duration-500",
            showExtras ? "max-h-16" : "max-h-0"
          )}
        >
          <label className="flex items-center gap-3 flex-wrap border w-fit p-3 rounded-lg">
            Slug
            <input
              type="text"
              defaultValue={props.operation === "update" ? props.data.slug : ""}
              placeholder={slugify(
                currentFormData.title ? currentFormData.title.trim() : "",
                {
                  lower: true,
                }
              )}
              className="border p-1 rounded-lg"
              pattern="[a-z0-9-]+"
              {...register("slug")}
            />
          </label>
        </div>
        <article className="prose-xl" id="editorjs"></article>
      </form>
    </main>
  );
}
