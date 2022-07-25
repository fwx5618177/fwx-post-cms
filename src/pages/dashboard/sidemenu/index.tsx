import { Button, Card, Form, Input } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './style.css'

const SideMenu: React.FC = () => {
    const [form] = Form.useForm()
    const { t } = useTranslation()

    const onFinish = (values: any) => {
        console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const onReset = () => {
        form.resetFields()
    }

    return (
        <>
            <header className='SideMenu_header'>
                <span></span>
                <h3>{t('sidemenu')}</h3>
            </header>

            <Card
                style={{
                    margin: 12,
                }}
            >
                <Form name='basic' labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
                    <Form.Item name='key' label='路由key' rules={[{ required: true, message: '输入路由key值!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='label' label='路由名' rules={[{ required: true, message: '输入路由名!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='path' label='路由路径' rules={[{ required: true, message: '输入路由路径!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='path' label='路由路径' rules={[{ required: true, message: '输入路由路径!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
                        <Button type='primary' htmlType='submit'>
                            提交
                        </Button>

                        <Button
                            style={{
                                marginLeft: 8,
                            }}
                            htmlType='button'
                            onClick={onReset}
                        >
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default SideMenu
