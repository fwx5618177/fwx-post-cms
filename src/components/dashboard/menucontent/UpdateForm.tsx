import React from "react";
import { Button, Col, Form, Input, Row, Select, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { UpdateFormValues, SelectOption, ContentItem } from "./types";

const { Option } = Select;

interface UpdateFormProps {
    versions: SelectOption[];
    detailInfo: ContentItem | null;
    onUpdate: (values: UpdateFormValues) => Promise<void>;
    onVersionSelect: (title: string) => Promise<void>;
    onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onReset: () => void;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({
    versions,
    detailInfo,
    onUpdate,
    onVersionSelect,
    onContentChange,
    onReset,
}) => {
    const [updateForm] = Form.useForm();
    const { t } = useTranslation();

    return (
        <Form name="updateForm" form={updateForm} onFinish={onUpdate} autoComplete="off">
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="title" label="Title">
                        <Select
                            style={{ width: 300 }}
                            placeholder={t("menucontent.header.title.switch.text.load.select")}
                            onSelect={onVersionSelect}
                        >
                            {versions?.map((item, index) => (
                                <Option key={index + "_versions"} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24} style={{ marginTop: 8 }}>
                <Col span={24}>
                    <Form.Item name="updateContent" label="Text">
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

            {detailInfo && (
                <Row gutter={24}>
                    <Col span={24}>
                        <Descriptions title="Versions" bordered>
                            <Descriptions.Item label="title">{detailInfo.title}</Descriptions.Item>
                            <Descriptions.Item label="time">
                                {moment(detailInfo.createdAt).format("YYYY-MM-DD hh:mm:ss")}
                            </Descriptions.Item>
                            <Descriptions.Item label="routekeyname">{detailInfo.routekeyname}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            )}
        </Form>
    );
};
