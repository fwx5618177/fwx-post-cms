import { Button, Card, Form, Input } from "antd";

const SourceCode = () => {
    const [form] = Form.useForm();

    return (
        <>
            <Card
                style={{
                    margin: 8,
                }}
            >
                <Form name="baseForm" form={form}>
                    <Form.Item name={"path"} label={"path"}>
                        <Input placeholder="Input absolute path name" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Scan
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default SourceCode;
