"use client";
import { validateForm } from "@/lib/fp";
import { zfd } from "zod-form-data";
import { type addRedirect as _addRedirect } from "@/app/actions";

const InputSchema = zfd.formData({
  source: zfd.text(),
  dest: zfd.text(),
});

export default function AddRedirectModal({
  addRedirect,
}: {
  addRedirect: typeof _addRedirect;
}) {
  return (
    <form
      onSubmit={validateForm(InputSchema, (data) => {
        addRedirect(data.source, data.dest);
      })}
      className="flex flex-col gap-3"
    >
      <input
        name="source"
        type="text"
        className="border py-1 px-3"
        placeholder="Source"
      />
      <input
        name="dest"
        type="text"
        className="border py-1 px-3"
        placeholder="Dest"
      />
      <button>Add</button>
    </form>
  );
}
