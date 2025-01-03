// 模拟多个异步组件，使用Suspense，实现流式渲染
import React from "react";
import { Suspense } from "react";


async function SlowComponent2() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div className="bg-blue-500">第二个异步组件</div>;
}

async function SlowComponent3() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <div className="bg-green-500">第三个异步组件</div>;
}
const LazyComponent = React.lazy(async () => {
  const data  = await fetch("/api/slowComponent1").then((res) => res.json());
  return {
    default: () => <div>{data}</div>,
  };
});

export default function StreamingPage() {
  return (
    <div id="root">
      <h1>流式渲染演示</h1>
      <Suspense fallback={<div>加载组件1...</div>}>
        <LazyComponent />
      </Suspense>
      <Suspense fallback={<div>加载组件2...</div>}>
        <SlowComponent2 />
      </Suspense>
      <Suspense fallback={<div>加载组件3...</div>}>
        <SlowComponent3 />
      </Suspense>
    </div>
  );
}
