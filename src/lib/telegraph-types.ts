import { z } from "zod";

export const TagName = z.union([
  z.literal("a"),
  z.literal("aside"),
  z.literal("b"),
  z.literal("blockquote"),
  z.literal("br"),
  z.literal("code"),
  z.literal("em"),
  z.literal("figcaption"),
  z.literal("figure"),
  z.literal("h3"),
  z.literal("h4"),
  z.literal("hr"),
  z.literal("i"),
  z.literal("iframe"),
  z.literal("img"),
  z.literal("li"),
  z.literal("ol"),
  z.literal("p"),
  z.literal("pre"),
  z.literal("s"),
  z.literal("strong"),
  z.literal("u"),
  z.literal("ul"),
  z.literal("video"),
]);

export type TagName = z.infer<typeof TagName>;

export const TNodeElement: z.ZodType<NodeElement> = z.object({
  tag: TagName,
  attrs: z.record(z.string()).optional(),
  children: z.array(z.lazy(() => TNode)),
});

interface NodeElement {
  tag: TagName;
  attrs?: Record<string, string>;
  children: TNode[];
}

export const TNode = z.union([z.string(), TNodeElement]);
export type TNode = z.infer<typeof TNode>;

export const Page = z.object({
  path: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  author_name: z.string().optional(),
  author_url: z.string().optional(),
  image_url: z.string().optional(),
  content: TNode.array(),
  views: z.number(),
});
export type Page = z.infer<typeof Page>;

export const Account = z.object({
  short_name: z.string(),
  author_name: z.string(),
  author_url: z.string(),
  access_token: z.string().optional(),
  auth_url: z.string().optional(),
  page_count: z.number().optional(),
});
export type Account = z.infer<typeof Account>;

const PageList = z.object({
  total_count: z.number(),
  pages: Page.array(),
});
export type PageList = z.infer<typeof PageList>;

export const PageViews = z.object({
  views: z.number(),
});
export type PageViews = z.infer<typeof PageViews>;
