import { AutoChart } from '@antv/auto-chart'
import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

const Charts = () => {
    const chartsRef = useRef<HTMLDivElement>(null)

    const render = () => {
        if (chartsRef.current?.childElementCount) {
            chartsRef.current.innerHTML = ''
        }

        const data = [
            { field1: 'a', field2: '100' },
            { field1: 'b', field2: '300' },
            { field1: 'c', field2: '800' },
        ]

        const root = createRoot(chartsRef.current as Element)

        root.render(<AutoChart title='CASE 1' description='auto chart analysis' data={data} language={'zh-CN'} />)
    }

    useEffect(() => {
        render()
    }, [])

    return (
        <>
            <div ref={chartsRef}></div>
        </>
    )
}

export default Charts
