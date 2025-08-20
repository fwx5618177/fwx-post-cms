import React from "react";
import { PreviewModalProps } from "../types";

/**
 * 预览模态框组件
 * 用于显示图片预览
 */
export const PreviewModal: React.FC<PreviewModalProps> = ({ previewState, onCancel }) => {
    const { visible, image, title } = previewState;

    if (!visible) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 1050,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    background: "#232428",
                    border: "1px solid #36373a",
                    borderRadius: 8,
                    width: 800,
                    maxWidth: "90vw",
                    padding: 12,
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <img alt="preview" style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }} src={image} />
                <div style={{ textAlign: "right", marginTop: 8 }}>
                    <button onClick={onCancel}>关闭</button>
                </div>
            </div>
        </div>
    );
};
