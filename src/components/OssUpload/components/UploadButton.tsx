import React from "react";
import { RiAddLine, RiUpload2Line, RiImage2Line } from "react-icons/ri";
import { UploadButtonProps } from "../types";

/**
 * 上传按钮组件
 * 根据不同的listType显示不同的上传按钮样式
 */
export const UploadButton: React.FC<UploadButtonProps> = ({ listType }) => {
    switch (listType) {
        case "picture":
            return (
                <button type="button">
                    <RiImage2Line /> Click Image to Upload
                </button>
            );
        case "picture-card":
            return (
                <div>
                    <RiAddLine />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            );
        case "text":
            return (
                <button type="button">
                    <RiUpload2Line /> Click to Upload
                </button>
            );
        default:
            return (
                <button type="button">
                    <RiUpload2Line /> Click to Upload
                </button>
            );
    }
};
