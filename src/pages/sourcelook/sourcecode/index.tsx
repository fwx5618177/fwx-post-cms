import { Button, Card, Form, Input } from 'antd'
import api from './api'

export default () => {
    const [form] = Form.useForm()

    const handleSubmit = async (values: { path: string }) => {
        console.log(values)
        const result = await api.look({
            path: values?.path,
        })

        console.log(result)
    }

    return (
        <>
            <Card
                style={{
                    margin: 8,
                }}
            >
                <Form name='baseForm' form={form} onFinish={handleSubmit}>
                    <Form.Item name={'path'} label={'path'}>
                        <Input placeholder='Input absolute path name' />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Scan
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}
