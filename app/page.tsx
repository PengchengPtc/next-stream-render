import React, { Suspense } from "react";
import request from "@/app/service/fetch";

// 使用 React 的 lazy 加载异步组件
const LazyComponent = React.lazy(async () => {
  const { data } = await request.get("/api/data");

  return {
    default: () => <div className="bg-red-500">服务端数据: {data.message}</div>,
  };
});

export default function Home() {
  return (
    <div>
      <h1>流式渲染 + Suspense + 数据加载示例</h1>
      <Suspense fallback={<div>Loading Lazy Component...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
