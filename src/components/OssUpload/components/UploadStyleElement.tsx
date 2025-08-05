import React from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { UploadStyleElementProps } from "../types";
import { UploadButton } from "./UploadButton";

const { Dragger } = Upload;

/**
 * 上传样式元素组件
 * 根据uploadStyle渲染不同的上传组件
 */
export const UploadStyleElement: React.FC<UploadStyleElementProps> = ({
    uploadStyle,
    uploadProps,
    fileList,
    maxCount,
    listType,
}) => {
    const { t } = useTranslation();

    const handleDrop = (e: React.DragEvent) => {
        console.log("Dropped files", e.dataTransfer.files);
    };

    switch (uploadStyle) {
        case "dragger":
            return (
                <Dragger {...uploadProps} onDrop={handleDrop}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">{t("component.ossupload.dragger.title")}</p>
                    <p className="ant-upload-hint">{t("component.ossupload.dragger.body")}</p>
                </Dragger>
            );
        case "click":
        default:
            return (
                <Upload {...uploadProps}>
                    {fileList.length >= maxCount ? null : <UploadButton listType={listType} />}
                </Upload>
            );
    }
};
