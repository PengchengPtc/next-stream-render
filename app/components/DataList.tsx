import React from 'react'

export interface DataItem {
  id: number
  name: string
  price: number
  sales: number
}

const DataList = ({ data }: { data: DataItem[] }) => {
  return (
    <div className="grid gap-4">
      {data.map(item => (
        <div key={item.id} className="p-4 border rounded">
          <div>商品：{item.name}</div>
          <div>价格：¥{item.price}</div>
          <div>销量：{item.sales}</div>
        </div>
      ))}
    </div>
  )
}

export default DataList