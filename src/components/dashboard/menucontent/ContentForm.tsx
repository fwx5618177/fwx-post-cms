import React from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import { FormValues, SelectOption } from "./types";

const { Option } = Select;

interface ContentFormProps {
    routeList: SelectOption[];
    onFinish: (values: FormValues) => Promise<void>;
    onFinishFailed: (errorInfo: {
        values: FormValues;
        errorFields: Array<{ name: string[]; errors: string[] }>;
        outOfDate: boolean;
    }) => void;
    onReset: () => void;
    onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
    routeList,
    onFinish,
    onFinishFailed,
    onReset,
    onContentChange,
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const layout = {};

    return (
        <Form
            {...layout}
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label={t("menucontent.name.form.label")}
                        name="name"
                        rules={[{ required: true, message: t("routepagelevel.text") }]}
                    >
                        <Select placeholder={t("menucontent.name.form.select.text")}>
                            {routeList?.map((item, index) => (
                                <Option key={index + "_routeList"} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label={t("menucontent.name.form.title")}
                        name="title"
                        rules={[{ required: true, message: t("routepagelevel.text") }]}
                    >
                        <Input showCount placeholder={t("menucontent.name.form.title.text")} allowClear />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        label={t("menucontent.name.form.content")}
                        name="content"
                        rules={[{ required: true, message: t("routepagelevel.text") }]}
                    >
                        <Input.TextArea
                            onChange={onContentChange}
                            showCount
                            placeholder={t("menucontent.name.form.content.text")}
                            allowClear
                            autoSize={{ minRows: 5, maxRows: 8 }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="primary" htmlType="submit">
                        {t("button.submit")}
                    </Button>
                    <Button style={{ marginLeft: 8 }} htmlType="button" onClick={onReset}>
                        {t("button.reset")}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};
