import * as nh from "next/headers";

export async function generateCode() {
  "use server";
  const cookies = nh.cookies();
  if (cookies.has("code")) {
    return cookies.get("code")!.value;
  }
}
