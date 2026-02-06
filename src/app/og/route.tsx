import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  const [fonts] = await Promise.all([loadAssets()]);

  return new ImageResponse(
    <div
      tw="flex h-full w-full bg-black text-white"
      style={{ fontFamily: "Geist Sans" }}
    >
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 left-16 w-[1px]" />
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 right-16 w-[1px]" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] top-16" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] bottom-16" />
      <div tw="flex absolute flex-row bottom-18 right-18 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="48"
          height="48"
        >
          <path
            d="M5 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5zm0 2h14v16H5V4z"
            fill="currentColor"
          />
          <path
            d="M8 7h8v1H8V7zm0 3h8v1H8v-1zm0 3h6v1H8v-1z"
            fill="currentColor"
            opacity="0.6"
          />
          <path d="M17 6v3l-2-1.5L17 6z" fill="currentColor" />
        </svg>
      </div>
      <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
        <div
          tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]"
          style={{
            textWrap: "balance",
            fontWeight: 600,
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </div>
        <div
          tw="text-[40px] leading-[1.5] flex-grow-1 text-stone-400"
          style={{
            fontWeight: 500,
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts,
    },
  );
}
