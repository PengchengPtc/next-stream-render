// 用流式渲染，解决产品说咱们的数据报表生成太慢了，用户等得都睡着了的

import { NextResponse } from 'next/server'

// 生成模拟数据
function generateMockData(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: start + index,
    name: `商品${start + index}`,
    price: Math.floor(Math.random() * 1000),
    sales: Math.floor(Math.random() * 500)
  }))
}

export async function GET() {
  const encoder = new TextEncoder()
  const TOTAL_ITEMS = 1000
  const CHUNK_SIZE = 1
  // 数据分流
  const stream = new ReadableStream({
    async start(controller) {
      for (let start = 0; start < TOTAL_ITEMS; start += CHUNK_SIZE) {
        // 模拟处理延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const chunk = {
          data: generateMockData(start, CHUNK_SIZE),
          progress: (start + CHUNK_SIZE) / TOTAL_ITEMS
        }

        controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
      }
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}