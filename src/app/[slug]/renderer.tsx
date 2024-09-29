import { z } from "zod";
import PageNotAvailable from "./page-not-available";
import { fetchArticle } from "../actions";
import ClickToEdit from "./click-to-edit";
import { DateTime } from "luxon";

const BaseBlock = z.object({
  id: z.string(),
});
const HeadingBlock = BaseBlock.extend({
  type: z.literal("header"),
  data: z.object({
    text: z.string(),
    level: z.number().min(1).max(6),
  }),
});
const ParagraphBlock = BaseBlock.extend({
  type: z.literal("paragraph"),
  data: z.object({
    text: z.string(),
  }),
});
const QuoteBlock = BaseBlock.extend({
  type: z.literal("quote"),
  data: z.object({
    text: z.string(),
    caption: z.string().optional(),
    alignment: z.enum(["left", "center", "right"]).optional().default("left"),
  }),
});
const DelimiterBlock = BaseBlock.extend({
  type: z.literal("delimiter"),
  data: z.object({}),
});
const ListBlockItem: z.ZodType<IListBlockItem> = z.object({
  content: z.string(),
  items: z.array(z.lazy(() => ListBlockItem)),
});
const ListBlock: z.ZodType<IListBlock> = BaseBlock.extend({
  type: z.literal("list"),
  data: z.object({
    style: z.enum(["ordered", "unordered"]),
    items: ListBlockItem.array(),
  }),
});
interface IListBlockItem {
  content: string;
  items: IListBlockItem[];
}
interface IListBlock {
  type: "list";
  data: {
    style: "ordered" | "unordered";
    items: IListBlockItem[];
  };
}
const CheckListBlock = BaseBlock.extend({
  type: z.literal("checklist"),
  data: z.object({
    items: z
      .object({
        text: z.string(),
        checked: z.boolean(),
      })
      .array(),
  }),
});
const TableBlock = BaseBlock.extend({
  type: z.literal("table"),
  data: z.object({
    withHeadings: z.boolean(),
    content: z.array(z.array(z.string())),
  }),
});

const Block = z.union([
  HeadingBlock,
  ParagraphBlock,
  QuoteBlock,
  DelimiterBlock,
  ListBlock,
  CheckListBlock,
  TableBlock,
]);

interface BlockProps<B> {
  block: B;
}

function Heading({ block }: BlockProps<z.infer<typeof HeadingBlock>>) {
  const H = `h${block.data.level}` as "h1" | "h2" | "h3" | "h4";
  return <H dangerouslySetInnerHTML={{ __html: block.data.text }}></H>;
}

function Paragraph({ block }: BlockProps<z.infer<typeof ParagraphBlock>>) {
  return <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>;
}

function Quote({ block }: BlockProps<z.infer<typeof QuoteBlock>>) {
  return (
    <blockquote>
      <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
      <figcaption
        dangerouslySetInnerHTML={{ __html: block.data.caption || "" }}
      ></figcaption>
    </blockquote>
  );
}

function Delimiter() {
  return <hr />;
}

function List({ block }: BlockProps<z.infer<typeof ListBlock>>) {
  const L = block.data.style === "ordered" ? "ol" : "ul";
  return (
    <L>
      {block.data.items.map((item) => (
        <li key={item.content}>
          <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
          <List
            block={{
              type: block.type,
              data: { style: block.data.style, items: item.items },
            }}
          />
        </li>
      ))}
    </L>
  );
}

function CheckList({ block }: BlockProps<z.infer<typeof CheckListBlock>>) {
  return (
    <ul className="checklist">
      {block.data.items.map((item) => (
        <li key={item.text}>
          <input type="checkbox" readOnly checked={item.checked} />
          <span dangerouslySetInnerHTML={{ __html: item.text }}></span>
        </li>
      ))}
    </ul>
  );
}

function Table({ block }: BlockProps<z.infer<typeof TableBlock>>) {
  return (
    <table className="border w-full p-3">
      <tbody>
        {block.data.content.map((row, i) => (
          <tr key={i} className="border">
            {row.map((cell, j) => (
              <td
                key={j}
                className="border p-3"
                dangerouslySetInnerHTML={{ __html: cell }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface Props {
  article: ReturnType<Awaited<ReturnType<typeof fetchArticle>>["unwrap"]>;
}
export default function Renderer({ article }: Props) {
  const content = z.array(Block).safeParse(article.content);
  if (!content.success) {
    console.dir(content.error.issues, { depth: null });

    return <PageNotAvailable />;
  }

  return (
    <main className="p-6 my-10 mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1>{article.title}</h1>
        <ClickToEdit author_id={article.author_id} slug={article.slug} />
      </div>
      <article className="prose-xl prose-p:text-lg">
        <p className="text-gray-500 italic">
          {DateTime.fromJSDate(article.added_at!).toFormat("dd LLL yyyy")} - by{" "}
          {article.author}
        </p>
        {content.data.map((block) => {
          if (block.type === "header")
            return <Heading key={block.id} block={block} />;
          if (block.type === "paragraph")
            return <Paragraph key={block.id} block={block} />;
          if (block.type === "quote")
            return <Quote key={block.id} block={block} />;
          if (block.type === "delimiter") return <Delimiter key={block.id} />;
          if (block.type === "list") return <List key={"X"} block={block} />;
          if (block.type === "checklist")
            return <CheckList key={block.id} block={block} />;
          if (block.type === "table")
            return <Table key={block.id} block={block} />;
          else throw new Error("Unknown block type");
        })}
      </article>
    </main>
  );
}
