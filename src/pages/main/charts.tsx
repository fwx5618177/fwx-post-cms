import { useCallback, useEffect, useRef, useState } from 'react'
import { Chart } from '@antv/g2'

const MainCharts = ({ data }) => {
    const chartRef = useRef<HTMLDivElement>(null)
    const [chartLists, setChartLists] = useState<Chart[]>([])

    const render = useCallback(() => {
        const chartsNum = chartRef.current?.childElementCount as number

        if (chartsNum) {
            ;(chartRef.current as HTMLDivElement).innerHTML = ''
        }

        // Step 1: 创建 Chart 对象
        const chart = new Chart({
            container: chartRef.current as HTMLElement, // 指定图表容器 ID
            // container: chartsDom, // 指定图表容器 ID
            width: 600, // 指定图表宽度
            height: 300, // 指定图表高度
        })

        // Step 2: 载入数据源
        chart.data(data)

        // Step 3: 创建图形语法，绘制柱状图
        chart.interval().position('genre*sold')

        // Step 4: 渲染图表
        chart.render()

        setChartLists([...chartLists, chart])
    }, [])

    useEffect(() => {
        data.length && render()
    }, [data])

    console.log(chartLists)

    return (
        <>
            <div id='main_charts' ref={chartRef}></div>
        </>
    )
}

export default MainCharts
