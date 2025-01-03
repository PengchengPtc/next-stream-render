import { NextResponse } from "next/server";

// 服务端数据
export async function GET() {
  return NextResponse.json({
    data: {
      message: "Hello from the server!",
    },
  });
}
