import { db } from "@/db";
import { users } from "@/db/schema/users";
import {
  ActionResult,
  CompleteError,
  ErrorEnum,
  NotFoundError,
  resultify,
} from "@/lib/result";
import { TelegramUserData } from "@telegram-auth/server";
import * as nh from "next/headers";
import { auth } from "./auth";
import { Article, articles, redirects } from "@/db/schema/models";
import { OutputData } from "@editorjs/editorjs";
import { LibsqlError } from "@libsql/client";
import { and, desc, eq, sql } from "drizzle-orm";
import { Err, Ok, Result } from "ts-results-es";
import { revalidatePath } from "next/cache";

export async function generateCode() {
  "use server";
  const cookies = nh.cookies();
  if (cookies.has("code")) {
    return cookies.get("code")!.value;
  }
}

export async function createUserOrUpdate(user: TelegramUserData) {
  return resultify(
    db
      .insert(users)
      .values({
        id: user.id.toString(),
        name: user.first_name,
        image: user.photo_url,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: user.first_name,
          image: user.photo_url,
        },
      })
      .returning()
  );
}

export async function addRedirect(source: string, dest: string) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Not Authenticated");
  const { id } = session.user!;
  const result = await db.insert(redirects).values({
    source,
    dest,
    added_by: id!,
  });
  console.log(result);
}

export async function publishArticle(
  data: Pick<Article, "title" | "content" | "slug"> & {
    time: number;
    content: OutputData["blocks"];
  }
): Promise<ActionResult<string>> {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Not Authenticated");
  const { id } = session.user!;
  const result = await resultify(
    db
      .insert(articles)
      .values({
        added_by: id!,
        content: data.content,
        editor_time: data.time,
        slug: data.slug,
        title: data.title,
      })
      .returning()
  );
  if (result.isErr()) {
    const error = result.error;
    if (error instanceof LibsqlError) {
      if (
        error.code === "SQLITE_CONSTRAINT" &&
        error.message.includes("articles.slug")
      ) {
        return {
          ok: false,
          error: {
            message: "Article already exists",
            code: ErrorEnum.AlreadyExists,
          },
        };
      }
    }
    return {
      ok: false,
      error: {
        message: error.message,
        code: ErrorEnum.Unknown,
      },
    };
  }
  return {
    ok: true,
    data: result.value[0].slug,
  };
}

export async function updateArticle(
  slug: string,
  data: Partial<Pick<Article, "slug" | "title" | "content">>
): Promise<ActionResult<string>> {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Not Authenticated");
  const { id } = session.user!;
  const articleResult = await resultify(
    db
      .select({ added_by: articles.added_by })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1)
      .all()
      .then((d) => d.at(0))
  );
  if (articleResult.isErr())
    return {
      ok: false,
      error: {
        message: articleResult.error.message,
        code: ErrorEnum.Unknown,
      },
    };
  const article = articleResult.value;
  if (!article)
    return {
      ok: false,
      error: {
        message: "Article not found",
        code: ErrorEnum.NotFound,
      },
    };
  if (article.added_by !== id)
    return {
      ok: false,
      error: {
        message: "You are not the author of this article",
        code: ErrorEnum.NoPermission,
      },
    };
  console.log(data);
  const result = await resultify(
    db
      .update(articles)
      //TODO FIX ZOD TYPES
      //TODO HARMFUL (DIRECT DATA INSERT)
      // @ts-expect-error zod types
      .set(data)
      .where(and(eq(articles.slug, slug), eq(articles.added_by, id)))
      .returning({
        slug: articles.slug,
      })
  );
  if (result.isErr())
    return {
      ok: false,
      error: {
        message: result.error.message,
        code: ErrorEnum.Unknown,
      },
    };
  revalidatePath(`/${slug}`);

  return {
    ok: true,
    data: result.value[0].slug,
  };
}

export async function fetchArticle(
  slug: string,
  for_edit = false
): Promise<
  Result<
    Pick<Article, "title" | "slug" | "added_at"> & {
      author: string;
      author_id: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: any;
    },
    Error
  >
> {
  const result = await resultify(
    db
      .select({
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        added_at: articles.added_at,
        author: users.name,
        author_id: users.id,
      })
      .from(articles)
      .leftJoin(users, eq(articles.added_by, users.id))
      .where(eq(articles.slug, slug))
      .limit(1)
      .all()
      .then((d) => d.at(0))
  );
  if (result.isOk()) {
    if (!result.value) return Err(new NotFoundError());
    if (for_edit) {
      const current_user = await auth();
      if (!current_user) return Err(new NotFoundError());
      // prettier-ignore
      if(current_user.user?.id !== result.value.author_id) return Err(new NotFoundError());
    }
    //TODO FIXME
    //@ts-expect-error zod types
    return Ok(result.value);
  }
  return Err(result.error);
}

export async function fetchArticleSlugs(): Promise<
  Result<
    {
      slug: string;
    }[],
    Error
  >
> {
  const result = await resultify(
    db.select({ slug: articles.slug }).from(articles).all()
  );
  if (result.isOk()) {
    return Ok(result.value);
  }
  return Err(result.error);
}

export async function fetchArticleProps(slug: string): Promise<
  Result<
    {
      slug: string;
      title: string;
      added_at: Date;
    },
    Error
  >
> {
  const result = await resultify(
    db
      .select({
        slug: articles.slug,
        title: articles.title,
        added_at: articles.added_at,
      })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1)
      .all()
      .then((d) => d.at(0))
  );
  if (result.isOk()) {
    if (!result.value) return Err(new NotFoundError());
    return Ok(result.value);
  }
  return Err(result.error);
}

export async function fetchMyArticles(offset = 0): Promise<
  Result<
    {
      slug: string;
      title: string;
      added_at: Date;
      count: number;
    }[],
    Error
  >
> {
  const session = await auth();
  console.log(session?.user);
  if (!session) return Err(new NotFoundError());
  if (!session?.user?.id)
    return Err(new CompleteError("Not Authenticated", ErrorEnum.NoPermission));

  const LIMIT = 10;
  const result = await resultify(
    db.query.articles.findMany({
      orderBy: desc(articles.added_at),
      columns: {
        slug: true,
        title: true,
        added_at: true,
      },
      limit: LIMIT,
      offset,
      where: eq(articles.added_by, session.user.id),
      extras: {
        count:
          sql<number>`(select count(*) from ${articles} where ${articles.added_by} = ${session.user.id})`.as(
            "count"
          ),
      },
    })
  );
  return result;
}
