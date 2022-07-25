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
                    <Form.Item name='menushow' label={t('routemenushow')} rules={[{ required: true, message: t('routemenushow.text') }]}>
                        <Input />
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

                    <Form.Item name='icon' label={t('routeicon')} rules={[{ required: true, message: t('routeicon.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='index' label={t('routeindex')} rules={[{ required: true, message: t('routeindex.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='child' label={t('routechild')} rules={[{ required: true, message: t('routechild.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='component' label={t('routecomponent')} rules={[{ required: true, message: t('routecomponent.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='outlet' label={t('routeoutlet')} rules={[{ required: true, message: t('routeoutlet.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='casesensitive' label={t('routecasesensitive')} rules={[{ required: true, message: t('routecasesensitive.text') }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
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
        </>
    )
}

export default SideMenu
