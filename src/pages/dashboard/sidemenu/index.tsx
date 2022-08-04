import { bgLayoutSet, routeTable } from '../../../common/routes.controller'
import { CheckOutlined, CloseOutlined, DownOutlined, RightCircleTwoTone, SettingTwoTone } from '@ant-design/icons'
import { Badge, Button, Card, Col, Form, Input, Radio, Row, Switch, Tree, Select } from 'antd'
import { treeData } from 'mocks/routeData'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './style.css'
import { confRouteLevel } from './conf'
import api from './api'

const { Option } = Select

const SideMenu: React.FC = () => {
    const [form] = Form.useForm()
    const { t } = useTranslation()

    // 设置背景归类
    const [bgSortsStatus, setBgSortsStatus] = useState<boolean>(true)

    // 设置为父还是组件
    const [outletSet, setOutletSet] = useState<boolean>(true)

    // style
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    }
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    }

    const onFinish = async (values: any) => {
        console.log('Success:', values)

        const { menushow, pageLevel, key, label, path, outlet, casesensitive } = values

        const routeConf = {
            menushow,
            level: String(pageLevel),
            key,
            label,
            path,
            outlet,
            casesensitive,
        }

        console.log(routeConf)

        const result = await api.createRoute(routeConf)

        console.log(result)
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const onReset = () => {
        form.resetFields()
    }

    const onSelect = (selectedKeys: React.Key[], info: any) => {
        console.log('selected', selectedKeys, info)
    }

    return (
        <>
            <header className='SideMenu_header'>
                <span></span>
                <h3>{t('sidemenu')}</h3>
            </header>

            <Row gutter={24}>
                <Col span={12}>
                    <Badge.Ribbon text={t('routebadge.ribbon')}>
                        <Card
                            // hoverable
                            style={{
                                margin: 12,
                                height: 600,
                                overflowY: 'scroll',
                            }}
                            title={
                                <>
                                    <div className='route_conf_card_title'>
                                        <SettingTwoTone />
                                        <h3
                                            style={{
                                                textAlign: 'center',
                                            }}
                                        >
                                            {t('routecard.text')}
                                        </h3>
                                    </div>
                                </>
                            }
                            size={'small'}
                        >
                            <Form {...layout} form={form} name='basic' initialValues={{ routebgshowstatus: bgSortsStatus }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
                                <Form.Item name='routebgshowstatus' label={t('routebgshowstatus')} rules={[{ required: true, message: t('routebgshowstatus.text') }]}>
                                    <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked onChange={(checked: boolean) => setBgSortsStatus(checked)} />
                                </Form.Item>

                                {bgSortsStatus && (
                                    <Form.Item name='menushow' label={t('routemenushow')} rules={[{ required: true, message: t('routemenushow.text') }]}>
                                        <Select placeholder='Select'>
                                            {bgLayoutSet()?.map((ci, index) => (
                                                <Option key={index + '_bglayout'} value={ci?.value}>
                                                    {ci?.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}

                                <Form.Item name='pageLevel' label={t('routepagelevel')} rules={[{ required: true, message: t('routepagelevel.text') }]}>
                                    <Select
                                        placeholder='Select'
                                        onSelect={_ => {
                                            if (_ === 2) {
                                                setOutletSet(false)
                                            }
                                        }}
                                    >
                                        {confRouteLevel?.map((ci, index) => (
                                            <Option key={index + '_confRoute'} value={ci?.value}>
                                                {ci?.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item name='key' label={t('routekey')} rules={[{ required: true, message: t('routekey.text') }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name='label' label={t('routelabel')} rules={[{ required: true, message: t('routelabel.text') }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name='path' label={t('routepath')} rules={[{ required: true, message: t('routepath.text') }]}>
                                    <Input />
                                </Form.Item>

                                {/* <Form.Item name='icon' label={t('routeicon')} rules={[{ required: true, message: t('routeicon.text') }]}>
                                    <Input />
                                </Form.Item> */}

                                {/* <Form.Item name='index' label={t('routeindex')} rules={[{ required: true, message: t('routeindex.text') }]}>
                                    <Input />
                                </Form.Item> */}

                                {/* <Form.Item name='child' label={t('routechild')} rules={[{ required: true, message: t('routechild.text') }]}>
                                    <Input />
                                </Form.Item> */}

                                {/* <Form.Item name='component' label={t('routecomponent')} rules={[{ required: true, message: t('routecomponent.text') }]}>
                                    <Input />
                                </Form.Item> */}

                                {outletSet && (
                                    <Form.Item name='outlet' label={t('routeoutlet')} rules={[{ required: true, message: t('routeoutlet.text') }]}>
                                        <Radio.Group
                                            options={[
                                                {
                                                    label: t('routeoutlet.text.radio.status.start'),
                                                    value: true,
                                                },
                                                {
                                                    label: t('routeoutlet.text.radio.status.close'),
                                                    value: false,
                                                },
                                            ]}
                                            optionType={'button'}
                                            buttonStyle={'solid'}
                                        />
                                    </Form.Item>
                                )}

                                <Form.Item name='casesensitive' label={t('routecasesensitive')} rules={[{ required: true, message: t('routecasesensitive.text') }]}>
                                    <Radio.Group
                                        options={[
                                            {
                                                label: t('routecasesensitive.radio.status.start'),
                                                value: true,
                                            },
                                            {
                                                label: t('routecasesensitive.radio.status.close'),
                                                value: false,
                                            },
                                        ]}
                                        optionType={'button'}
                                        buttonStyle={'solid'}
                                    />
                                </Form.Item>

                                <Form.Item {...tailLayout}>
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
                                </Form.Item>
                            </Form>
                        </Card>
                    </Badge.Ribbon>
                </Col>

                <Col span={12}>
                    <Badge.Ribbon text={t('routebadge.ribbonshow')} color='volcano'>
                        <Card
                            title={t('routetable.treedata')}
                            headStyle={{
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center',
                            }}
                            hoverable
                            style={{
                                margin: 12,
                                minHeight: 600,
                            }}
                        >
                            <Tree
                                height={500}
                                // switcherIcon={<RightCircleTwoTone />}
                                showLine
                                showIcon
                                defaultExpandAll
                                onSelect={onSelect}
                                // switcherIcon={<DownOutlined />}
                                // treeData={treeData}
                                treeData={routeTable()}
                            />
                        </Card>
                    </Badge.Ribbon>
                </Col>
            </Row>
        </>
    )
}

export default SideMenu
