// renderToPipeableStream 实现流式渲染，renderToPipeableStream API 则同时具备 Streaming 和 Suspense 的特性，不过在用法上更复杂。
import { NextResponse } from "next/server";
import { renderToPipeableStream } from "react-dom/server";
import Home from "@/app/page";
import { Suspense } from "react";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const { pipe } = renderToPipeableStream(
    <html>
      <head>
        <title>React 流式渲染示例</title>
      </head>
      <body>
        <div id="root">
          <Suspense fallback={<div>加载中...</div>}>
            <Home />
          </Suspense>
        </div>
      </body>
    </html>,
    {
      onShellReady() {
        pipe(stream.writable as unknown as NodeJS.WritableStream);
      },
      onError(err) {
        console.error("流式渲染错误:", err);
        writer.write(encoder.encode("渲染出错"));
        writer.close();
      },
    }
  );

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
