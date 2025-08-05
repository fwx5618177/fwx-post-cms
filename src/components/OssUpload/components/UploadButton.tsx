import React from "react";
import { Button } from "antd";
import { PlusOutlined, UploadOutlined, FileImageOutlined } from "@ant-design/icons";
import { UploadButtonProps } from "../types";

/**
 * 上传按钮组件
 * 根据不同的listType显示不同的上传按钮样式
 */
export const UploadButton: React.FC<UploadButtonProps> = ({ listType }) => {
    switch (listType) {
        case "picture":
            return (
                <Button type="primary" icon={<FileImageOutlined />}>
                    Click Image to Upload
                </Button>
            );
        case "picture-card":
            return (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            );
        case "text":
            return (
                <Button type="primary" icon={<UploadOutlined />}>
                    Click to Upload
                </Button>
            );
        default:
            return (
                <Button type="primary" icon={<UploadOutlined />}>
                    Click to Upload
                </Button>
            );
    }
};
