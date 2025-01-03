// nest.js 实现原生流式渲染
import { NextResponse } from "next/server";

// 模拟异步数据获取
async function getSlowData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "这是异步加载的数据";
}

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 发送初始 HTML
      controller.enqueue(
        encoder.encode(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>流式渲染示例</title>
            <style>
              .loading { color: #666; }
              .content { color: #333; }
            </style>
          </head>
          <body>
            <div id="root">
              <h1>流式渲染演示</h1>
              <p>这部分内容会立即显示</p>
      `)
      );
      // 发送加载状态
      controller.enqueue(
        encoder.encode(`
              <div id="loading" class="loading">
                <p>正在加载数据...</p>
              </div>
      `)
      );
      try {
        // 获取异步数据
        const slowData = await getSlowData();

        // 发送异步加载的内容
        controller.enqueue(
          encoder.encode(`
              <div id="async-content" class="content">
                <p>${slowData}</p>
                <p>加载完成时间: ${new Date().toLocaleTimeString()}</p>
              </div>
        `)
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(`
               <div style="color: red;">
                加载失败：${(error as Error).message || "未知错误"}
              </div>
        `)
        );
      }

      // 发送结束标记和清理脚本
      controller.enqueue(
        encoder.encode(`
            </div>
            <script>
              // 移除加载提示
              document.getElementById('loading').style.display = 'none';
            </script>
          </body>
        </html>
      `)
      );
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
