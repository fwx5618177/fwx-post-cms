import { PivotSheet, S2Event } from '@antv/s2'
import { Button } from 'antd'
import insertCss from 'insert-css'
import { useEffect, useRef } from 'react'
import { scrollTableData } from '../mocks'

// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`
  #container > canvas {
    margin-top: 10px;
  }
`)

const Scroll = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const startRef = useRef<HTMLDivElement>(null)
    const stopRef = useRef<HTMLDivElement>(null)

    // 每次滚动的距离
    const STEP = 50

    // 每次滚动间隔时间
    const MS = 500

    // 计时器
    let timer

    const addScrollButton = (btn, stopBtn, s2, timer, STEP, MS) => {
        stopBtn.addEventListener('click', () => {
            clearInterval(timer)
        })

        btn.addEventListener('click', () => {
            // 如果没有纵向滚动条则不需要触发定时器
            if (!s2.facet.vScrollBar) {
                return
            }

            // 如果需要快速滚动, 可将 setInterval 替换成 requestAnimationFrame
            timer = setInterval(() => {
                // 获取当前 Y 轴滚动距离
                const { scrollY } = s2.facet.getScrollOffset()
                // 访问 https://s2.antv.vision/zh/docs/api 查看更多 API
                // 如果已经滚动到了底部，则回到顶部
                if (s2.facet.isScrollToBottom(scrollY)) {
                    console.log('滚动到底部')
                    s2.updateScrollOffset({
                        offsetY: {
                            value: 0,
                            animate: false,
                        },
                    })
                    return
                }
                console.log('开始滚动, 当前 scrollY:', scrollY)
                s2.updateScrollOffset({
                    offsetY: {
                        value: scrollY + STEP,
                        animate: true,
                    },
                })
            }, MS)
        })
    }

    const render = () => {
        if (scrollRef.current?.childElementCount) {
            scrollRef.current.innerHTML = ''
        }

        const s2Options = {
            width: 1050,
            height: 480,
            style: {
                cellCfg: {
                    // 让表格显示滚动条
                    height: 100,
                },
            },
        }
        const s2 = new PivotSheet(scrollRef.current as HTMLElement, scrollTableData, s2Options)

        // 记得在表格卸载后 或者 `s2.destroy()` 后清除定时器
        s2.on(S2Event.LAYOUT_DESTROY, () => {
            clearInterval(timer)
        })

        s2.render()

        addScrollButton(startRef.current, stopRef.current, s2, timer, STEP, MS)
    }

    useEffect(() => {
        render()
    }, [])

    return (
        <>
            <div>
                <Button ref={startRef} className='ant-btn ant-btn-default' type='primary'>
                    开始滚动
                </Button>
                <Button ref={stopRef} className='ant-btn ant-btn-default' type='primary'>
                    停止滚动
                </Button>
            </div>
            <div ref={scrollRef}></div>
        </>
    )
}

export default Scroll
