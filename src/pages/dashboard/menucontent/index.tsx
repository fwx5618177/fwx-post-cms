import { Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import * as marked from 'marked'
import { useEffect, useRef, useState } from 'react'
import api from './api'

const { Option } = Select

const MenuContent = () => {
    const { t } = useTranslation()

    const showRef = useRef<HTMLDivElement>(null)
    const [routeList, setRouteList] = useState<
        {
            label: string
            value: string
        }[]
    >([])

    const handleChange = _ => {
        const value = _?.target?.value
        const result = marked.parse(value)
        console.log(result)
        ;(showRef.current as HTMLDivElement).innerHTML = result
    }

    const queryRouteList = async () => {
        const result: {
            label: string
            key: string
            path: string
        }[] = (await api.queryRouteList({})) as any

        console.log(result)

        if (result && Array.isArray(result) && result.length > 0) {
            const items: {
                label: string
                value: string
            }[] = result?.map(ci => ({
                label: ci?.label,
                value: ci?.key,
            }))
            setRouteList(items)
        } else {
            setRouteList([])
        }
    }

    useEffect(() => {
        queryRouteList()
    }, [])

    return (
        <>
            <Card
                bordered={false}
                hoverable
                style={{
                    margin: 12,
                }}
            >
                <Form name='form'>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={t('menucontent.name.form.label')} name={'name'}>
                                <Select placeholder={t('menucontent.name.form.select.text')}>
                                    {routeList?.map((ci, index) => (
                                        <Option key={index + '_routeList'} value={ci?.value}>
                                            {ci?.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label={t('menucontent.name.form.content')} name={'content'}>
                                <Input.TextArea onChange={handleChange} showCount placeholder={t('menucontent.name.form.content.text')} allowClear autoSize={{ minRows: 5, maxRows: 8 }}></Input.TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card
                style={{
                    margin: 12,
                    height: 300,
                    overflow: 'scroll',
                }}
            >
                {/* {markedShow} */}
                <div ref={showRef}></div>
            </Card>
        </>
    )
}

export default MenuContent
