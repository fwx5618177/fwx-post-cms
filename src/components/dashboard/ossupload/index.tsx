import { Button, Card, Col, Form, Input, message, Row, Select, Switch, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import { uploadOSSDir, uploadStyle } from "@/request/interface";
import OSSUploadBase from "@/components/OssUpload";
import { UploadPost } from "./interface";
import { v4 as uuidv4 } from "uuid";
import api from "./api";

const { Option } = Select;

interface FormI {
    directory: string;
    dragger: "click" | "dragger";
    list: string;
    path: string;
    resoureParent: string;
    uploadFile: (UploadFile & { dist: string })[];
}

const OSSUpload = () => {
    const [listType, setListType] = useState<UploadProps["listType"]>("text");
    const [uploadStyle, setUploadStyle] = useState<uploadStyle>("click");
    const [uploadPath, setUploadPath] = useState<uploadOSSDir>("image");
    const [directoryStatus, setDirectoryStatus] = useState<boolean>(false);
    const [resource, setResource] = useState<string>("");

    const [form] = Form.useForm();

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleSubmit = async value => {
        console.log(value);

        const { uploadFile, resoureParent } = value as FormI;

        const result: UploadPost[] = uploadFile?.map(ci => ({
            uuid: uuidv4(),
            createdAt: new Date(),
            url: ci?.url as string,
            relativePath: ci?.dist as string,
            name: ci?.name as string,
            size: String(ci?.size),
            type: ci?.type as string,
            resoureParent: resoureParent,
        }));

        if (result.length > 1) {
            const data = await api.createData(result);
            console.log("count:", data);
            message.success(`${data}个上传成功!`);
        } else {
            const data = await api.createData(result[0]);
            console.log("add:", data);
            message.success(`${(data as any)?.name} 上传成功!`);
        }
    };

    const initialVal = {
        list: "text",
        dragger: "click",
        path: uploadPath,
    };

    return (
        <>
            <h3
                style={{
                    margin: 12,
                }}
            >
                OSS Upload
            </h3>

            <Card
                style={{
                    margin: 12,
                }}
            >
                <Form name="form" form={form} onFinish={handleSubmit} initialValues={initialVal}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name={"list"} label="List Type">
                                <Select placeholder="Please select" onSelect={_ => setListType(_)}>
                                    {(["text", "picture", "picture-card"] as UploadProps["listType"][])?.map(
                                        (ci, index) => (
                                            <Option key={index + "_listType"} value={ci}>
                                                {ci}
                                            </Option>
                                        ),
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name={"dragger"} label="Dragger Type">
                                <Select placeholder="Please select" onSelect={_ => setUploadStyle(_)}>
                                    {(["click", "dragger"] as uploadStyle[])?.map((ci, index) => (
                                        <Option key={index + "_uploadStyle"} value={ci}>
                                            {ci}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name={"path"} label="Upload Path">
                                <Select
                                    placeholder="Please select"
                                    onSelect={_ => {
                                        setUploadPath(_);
                                    }}
                                >
                                    {["upload", "image", "file", "video", "kaboom", "3DModel"]?.map((ci, index) => (
                                        <Option key={index + "_uploadpath"} value={ci}>
                                            {ci}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name={"directory"} label="directory switch">
                                <Switch
                                    checkedChildren={"开启"}
                                    unCheckedChildren={"关闭"}
                                    onChange={(checked: boolean) => setDirectoryStatus(checked)}
                                ></Switch>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name={"resoureParent"}
                                label={"Resource"}
                                required
                                rules={[
                                    {
                                        message: "Need to addthis resource parent",
                                    },
                                ]}
                            >
                                <Input
                                    onChange={e => {
                                        const value = e?.target.value;
                                        setResource(`/${value}`);
                                    }}
                                    placeholder="Please input your key words"
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item name={"uploadFile"}>
                                <OSSUploadBase
                                    listType={listType}
                                    uploadStyle={uploadStyle}
                                    uploadDir={(uploadPath + resource) as any}
                                    directory={directoryStatus}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>

                        <Button
                            style={{
                                marginLeft: 8,
                            }}
                            htmlType="button"
                            onClick={onReset}
                        >
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default OSSUpload;
