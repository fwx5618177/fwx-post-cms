import { EnterOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, List, message, Radio, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import api from "./api";
import styles from "@/styles/pages/todoist.module.scss";

interface Performance {
    title: string;
    time: string;
    id: number;
}

const ListCard = () => {
    const [form] = Form.useForm();
    const [todoLists, setTodoLists] = useState<Performance[]>([]);

    const onFinish = async (value: any) => {
        const { briefTitle, detailInfos } = value;

        const result = await api.create({
            brief: briefTitle,
            detail: detailInfos,
        });

        if (result && Array.isArray(result) && result.length > 0) {
            message.success("新增成功");
            queryList();
        }
    };

    const queryList = async () => {
        const result = await api.list();

        if (result && Array.isArray(result) && result.length > 0) {
            const data: Performance[] = result?.map(ci => ({ title: ci?.brief, time: ci?.createdAt, id: ci?.id }));
            setTodoLists(data);
        } else {
            setTodoLists([]);
        }
    };

    const handleDetail = async (e: { target: { value: any } }) => {
        const brief = e?.target?.value;

        const result = await api.queryId(brief);

        if (result && Array.isArray(result) && result.length > 0) {
            const data = result[0];
            const { brief: briefTitle, detail: detailInfos } = data;
            form.setFieldsValue({
                briefTitle,
                detailInfos,
            });
        }
    };

    useEffect(() => {
        queryList();
    }, []);

    return (
        <div className={styles.container}>
            <h3
                style={{
                    margin: 12,
                }}
            >
                Todoist
            </h3>

            <Row
                gutter={24}
                style={{
                    margin: 12,
                }}
            >
                <Col span={12}>
                    <Card>
                        <Form name="basic" form={form} onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                label="title"
                                name={"briefTitle"}
                                rules={[{ required: true, message: "请输入" }]}
                            >
                                <Input placeholder="Input todoist" suffix={<EnterOutlined />} allowClear />
                            </Form.Item>

                            <Form.Item
                                label="detail"
                                name={"detailInfos"}
                                rules={[{ required: true, message: "请输入" }]}
                            >
                                <Input.TextArea
                                    placeholder="Input detail information"
                                    style={{
                                        marginTop: 1,
                                    }}
                                    autoSize={{ minRows: 10, maxRows: 10 }}
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item>
                                <div className="list_container_btn">
                                    <Button
                                        htmlType="submit"
                                        style={{
                                            margin: "0 atuo",
                                        }}
                                        type="primary"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card
                        style={{
                            height: 400,
                            overflowY: "scroll",
                        }}
                    >
                        <Radio.Group onChange={handleDetail}>
                            <List
                                size="small"
                                header="Todo Lists"
                                bordered
                                dataSource={todoLists}
                                renderItem={item => (
                                    <List.Item>
                                        <Radio value={item?.title}>
                                            {moment(item?.time).format("YYYY-MM-DD HH:mm:ss")}: {item?.title}
                                        </Radio>
                                    </List.Item>
                                )}
                            />
                        </Radio.Group>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ListCard;
