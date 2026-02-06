import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
import { transformers } from "@/lib/highlight-code";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);

      return plugins;
    },
  },
});

export const docs = defineDocs({
  dir: "docs",
  // TODO: Fix this when we upgrade to zod v4.
  // docs: {
  //   schema: frontmatterSchema.extend({
  //     links: z.optional(
  //       z.object({
  //         doc: z.string().optional(),
  //         api: z.string().optional(),
  //       })
  //     ),
  //   }),
  // },
});
