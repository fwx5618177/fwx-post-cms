import TableCompare from './components/tableCompare'
import { PivotSheet } from '@antv/s2'
import { Card } from 'antd'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Schedule from './components/schedule'
import EditeTable from './components/EditeTable'
import Scroll from './components/Scroll'
const DynamicTable = () => {
    const { t } = useTranslation()
    const tableRef = useRef<HTMLDivElement>(null)

    const s2DataConfig = {
        fields: {
            rows: ['province', 'city'],
            columns: ['type'],
            values: ['price'],
        },
        data: [
            {
                province: '浙江',
                city: '杭州',
                type: '笔',
                price: '1',
            },
            {
                province: '浙江',
                city: '杭州',
                type: '纸张',
                price: '2',
            },
            {
                province: '浙江',
                city: '舟山',
                type: '笔',
                price: '17',
            },
            {
                province: '浙江',
                city: '舟山',
                type: '纸张',
                price: '6',
            },
            {
                province: '吉林',
                city: '丹东',
                type: '笔',
                price: '8',
            },
            {
                province: '吉林',
                city: '白山',
                type: '笔',
                price: '12',
            },
            {
                province: '吉林',
                city: '丹东',
                type: '纸张',
                price: '3',
            },
            {
                province: '吉林',
                city: '白山',
                type: '纸张',
                price: '25',
            },
            {
                province: '浙江',
                city: '杭州',
                type: '笔',
                cost: '0.5',
            },
            {
                province: '浙江',
                city: '杭州',
                type: '纸张',
                cost: '20',
            },
            {
                province: '浙江',
                city: '舟山',
                type: '笔',
                cost: '1.7',
            },
            {
                province: '浙江',
                city: '舟山',
                type: '纸张',
                cost: '0.12',
            },
            {
                province: '吉林',
                city: '丹东',
                type: '笔',
                cost: '10',
            },
            {
                province: '吉林',
                city: '白山',
                type: '笔',
                cost: '9',
            },
            {
                province: '吉林',
                city: '丹东',
                type: '纸张',
                cost: '3',
            },
            {
                province: '吉林',
                city: '白山',
                type: '纸张',
                cost: '1',
            },
        ],
    }

    const render = () => {
        if (tableRef.current?.childElementCount) {
            tableRef.current.innerHTML = ''
        }

        const s2Options = {
            width: 1000,
            height: 200,
        }

        const s2 = new PivotSheet(tableRef.current as HTMLElement, s2DataConfig as any, s2Options)

        s2.render()
    }

    useEffect(() => {
        render()
    }, [])

    return (
        <>
            <div
                style={{
                    margin: 12,
                }}
            >
                <h3>{t('s2table.header.title')}</h3>

                <Card bordered={false}>
                    <div ref={tableRef}></div>
                </Card>

                <h3>{t('s2table.header.title')}</h3>
                <Card bordered={false}>
                    <Schedule />
                </Card>

                <h3>{t('s2table.header.title')}</h3>
                <Card bordered={false}>
                    <TableCompare />
                </Card>

                <h3>{t('s2table.header.title')}</h3>
                <Card bordered={false}>
                    <EditeTable />
                </Card>

                <h3>{t('s2table.header.title')}</h3>
                <Card bordered={false}>
                    <Scroll />
                </Card>
            </div>
        </>
    )
}

export default DynamicTable
