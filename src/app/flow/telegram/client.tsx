"use client";

import { useAsyncFn, useMount } from "react-use";
import { type generateCode as _generateCode } from "@/app/actions";

interface Props {
  generateCode: typeof _generateCode;
}

export function TelegramClientFlow({ generateCode }: Props) {
  const [d, invoke] = useAsyncFn(async () => {
    generateCode();
  }, []);
  useMount(() => invoke());
  console.log(d);

  return <div>hello</div>;
}
