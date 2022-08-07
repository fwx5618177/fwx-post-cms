import { Button, Card, Col, Descriptions, Form, Input, Row, Select, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import * as marked from 'marked'
import { useEffect, useRef, useState } from 'react'
import api from './api'
import { CheckOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Option } = Select

const MenuContent = () => {
    const [form] = Form.useForm()
    const { t } = useTranslation()

    const showRef = useRef<HTMLDivElement>(null)
    const [routeList, setRouteList] = useState<
        {
            label: string
            value: string
        }[]
    >([])
    const [versions, setVersions] = useState<
        {
            label: string
            value: string
        }[]
    >([])

    const [loadStatus, setLoadStatus] = useState<boolean>(false)
    const [detailInfos, setDetailInfos] = useState<any>(null)

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

    const onReset = () => {
        form.resetFields()
    }

    const onFinish = async (values: any) => {
        console.log('Success:', values)

        const { content, title, name } = values

        const contentConf = {
            content,
            title,
            routekeyname: name,
        }

        const result = await api.createContent(contentConf)

        console.log(result, contentConf)
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const queryContenList = async () => {
        const result = await api.list()

        console.log(result)

        if (result && Array.isArray(result) && result.length > 0) {
            const data: {
                label: string
                value: string
            }[] = result?.map(ci => ({
                label: `${ci?.title} - ${ci?.routekeyname}`,
                value: ci?.title,
            }))
            setVersions(data)
        } else {
            setVersions([])
        }
    }

    const handleDetailInfo = async (title: string) => {
        const result = await api.detail(title)

        if (result && Array.isArray(result) && result.length > 0) {
            const data = result[0]

            const value = data?.content
            const re = marked.parse(value)

            ;(showRef.current as HTMLDivElement).innerHTML = re

            setDetailInfos(data)
        } else {
            setDetailInfos(null)
        }
    }

    useEffect(() => {
        queryRouteList()
        queryContenList()
    }, [])

    const layout = {
        // labelCol: { span: 4 },
        // wrapperCol: { span: 16 },
    }

    return (
        <>
            <h3
                style={{
                    margin: 12,
                }}
            >
                {t('menucontent.header.title.add')}
            </h3>
            <Card
                bordered={false}
                hoverable
                style={{
                    margin: 12,
                }}
            >
                <Row
                    gutter={24}
                    style={{
                        margin: 6,
                    }}
                >
                    <Col span={12}>
                        <span></span>
                        <Switch
                            checkedChildren={
                                <>
                                    {t('menucontent.header.title.switch.text.add')}
                                    <CheckOutlined />
                                </>
                            }
                            unCheckedChildren={
                                <>
                                    {t('menucontent.header.title.switch.text.load')}
                                    <CheckOutlined />
                                </>
                            }
                            onChange={(checked: boolean) => setLoadStatus(checked)}
                        />
                    </Col>
                </Row>
                {loadStatus && (
                    <Form
                        {...layout}
                        form={form}
                        name='basic'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete='off'
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={t('menucontent.name.form.label')}
                                    name={'name'}
                                    rules={[{ required: true, message: t('routepagelevel.text') }]}
                                >
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
                            <Col span={12}>
                                <Form.Item
                                    label={t('menucontent.name.form.title')}
                                    name={'title'}
                                    rules={[{ required: true, message: t('routepagelevel.text') }]}
                                >
                                    <Input
                                        showCount
                                        placeholder={t('menucontent.name.form.title.text')}
                                        allowClear
                                    ></Input>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label={t('menucontent.name.form.content')}
                                    name={'content'}
                                    rules={[{ required: true, message: t('routepagelevel.text') }]}
                                >
                                    <Input.TextArea
                                        onChange={handleChange}
                                        showCount
                                        placeholder={t('menucontent.name.form.content.text')}
                                        allowClear
                                        autoSize={{ minRows: 5, maxRows: 8 }}
                                    ></Input.TextArea>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button type='primary' htmlType='submit'>
                                    {t('button.submit')}
                                </Button>

                                <Button
                                    style={{
                                        marginLeft: 8,
                                    }}
                                    htmlType='button'
                                    onClick={onReset}
                                >
                                    {t('button.reset')}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}

                {!loadStatus && (
                    <>
                        <Row gutter={24}>
                            <Col span={24}>
                                <span
                                    style={{
                                        marginRight: 6,
                                    }}
                                >
                                    Select:
                                </span>
                                <Select
                                    style={{
                                        width: 300,
                                    }}
                                    placeholder={t('menucontent.header.title.switch.text.load.select')}
                                    onSelect={handleDetailInfo}
                                >
                                    {versions?.map((ci, index) => (
                                        <Option key={index + '_versions'} value={ci?.value}>
                                            {ci?.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>

                        {detailInfos && (
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Descriptions
                                        title='Versions'
                                        bordered
                                        // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                    >
                                        <Descriptions.Item label='title'>{detailInfos?.title}</Descriptions.Item>
                                        <Descriptions.Item label='time'>
                                            {detailInfos &&
                                                moment(detailInfos?.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label='routekeyname'>
                                            {detailInfos?.routekeyname}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        )}
                    </>
                )}
            </Card>

            <h3
                style={{
                    margin: 12,
                }}
            >
                {t('menucontent.header.title.show')}
            </h3>
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
