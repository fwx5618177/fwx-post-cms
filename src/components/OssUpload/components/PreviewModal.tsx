import React from "react";
import { Modal } from "antd";
import { PreviewModalProps } from "../types";

/**
 * 预览模态框组件
 * 用于显示图片预览
 */
export const PreviewModal: React.FC<PreviewModalProps> = ({ previewState, onCancel }) => {
    const { visible, image, title } = previewState;

    return (
        <Modal open={visible} title={title} footer={null} onCancel={onCancel} width={800} centered>
            <img
                alt="preview"
                style={{
                    width: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                }}
                src={image}
            />
        </Modal>
    );
};
