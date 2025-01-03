"use client"

import { DataItem } from '@/app/components/DataList'
import React, { Suspense, lazy, useEffect, useState } from 'react'
const DataList = lazy(() => import('@/app/components/DataList'))
import request from "@/app/service/fetch";

export default function DataReport() {
  const [data, setData] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/manyData')
      request.get('/api/manyData');
      const reader = response.body?.getReader()
      
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setLoading(false)
          break
        }

        // 解析数据块
        const chunk = new TextDecoder().decode(value)
        const { data: newData, progress } = JSON.parse(chunk)
        
        setData(prev => [...prev, ...newData])
        setProgress(progress * 100)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      {/* 进度条 */}
      {loading && (
        <div className="mb-4">
          <div className="text-sm mb-2">加载进度: {progress.toFixed(0)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 数据列表 */}
      <Suspense fallback={<div>加载中...</div>}>
        {data.length > 0 && <DataList data={data as DataItem[]} />}
      </Suspense>
    </div>
  )
}