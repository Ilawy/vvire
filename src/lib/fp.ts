import { FormEvent, FormEventHandler } from "react";
import { z, ZodTypeAny } from "zod";
import { zfd } from "zod-form-data";

export function validateForm<T extends ZodTypeAny>(
  //@ts-expect-error zod type
  schema: ReturnType<typeof zfd.formData<T>>,
  callback: (data: z.infer<T>, event: FormEvent<HTMLFormElement>) => void
): FormEventHandler<HTMLFormElement> {
  return function (event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const result = schema.safeParse(fd);
    if (result.success) {
      return callback(result.data, event);
    }
    console.log(result.error);
  };
}
