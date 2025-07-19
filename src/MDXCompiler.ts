import type { CompileOptions } from "@mdx-js/mdx";
import { Data, Effect } from "effect";
import mdxMermaid from "mdx-mermaid";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

class MDXCompileError extends Data.TaggedError("MDXCompileError")<{
  message: string;
  cause?: unknown;
}> {}

// TODO: add components as needed
const components = {};

const mdxOptions: CompileOptions = {
  remarkPlugins: [remarkGfm, mdxMermaid],
  rehypePlugins: [
    rehypeMdxImportMedia,
    rehypeSlug,
    [rehypePrettyCode, { keepBackground: false, theme: "synthwave-84" }],
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["subheading-anchor"],
          ariaLabel: "Link to section",
        },
      },
    ],
  ],
};

export class MDXCompiler extends Effect.Service<MDXCompiler>()(
  "app/MDXCompiler",
  {
    succeed: () => {
      const use = Effect.fn("MDXCompiler.use")(<T>(source: string) =>
        Effect.tryPromise({
          try: () =>
            compileMDX<T>({
              source,
              options: {
                parseFrontmatter: true,
                mdxOptions,
              },
              components: { ...components },
            }),
          catch: (error) =>
            new MDXCompileError({
              message: `MDX compilation failed: ${error instanceof Error ? error.message : String(error)}`,
              cause: error,
            }),
        })
      );

      return {
        use,
      } as const;
    },
  }
) {}
