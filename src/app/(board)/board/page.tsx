import AddRedirectModal from "./add-redirect-modal";
import { addRedirect } from "@/app/actions";
import { resultify } from "@/lib/result";
import { db } from "@/db";
import { redirects } from "@/db/schema/models";
import { eq } from "drizzle-orm";
import { auth } from "@/app/auth";
import Display from "./display";

export default async function BoardPage() {
  const session = await auth();
  // prettier-ignore
  const data = await resultify(db.select({
    id: redirects.id,
    source: redirects.source,
    dest: redirects.dest,
    added_at: redirects.added_at,
  }).from(redirects).where(eq(redirects.added_by, session!.user!.id!)).all())
  console.log(data);

  return (
    <div>
      <button>add redirect</button>
      <div className="p-6">hello world</div>
      {data.isOk() ? (
        <Display items={data.value} />
      ) : (
        <div>{data.error.message}</div>
      )}
      <div className="p-3 border rounded-md w-fit min-w-96 aspect-video m-3 flex flex-col gap-3">
        <h2>Add Redirect</h2>
        <AddRedirectModal addRedirect={addRedirect} />
      </div>
    </div>
  );
}
