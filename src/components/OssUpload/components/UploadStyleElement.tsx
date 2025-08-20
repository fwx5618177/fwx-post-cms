import React from "react";
import { useTranslation } from "react-i18next";
import { UploadStyleElementProps } from "../types";
import { UploadButton } from "./UploadButton";

export const UploadStyleElement: React.FC<UploadStyleElementProps> = ({
    uploadStyle,
    uploadProps,
    fileList,
    maxCount,
    listType,
}) => {
    const { t } = useTranslation();

    if (uploadStyle === "dragger") {
        return (
            <label
                style={{
                    display: "block",
                    border: "1px dashed #444",
                    padding: 16,
                    borderRadius: 6,
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                <input
                    type="file"
                    multiple={uploadProps.multiple}
                    accept={uploadProps.accept}
                    style={{ display: "none" }}
                    onChange={e => {
                        const files = Array.from(e.target.files || []);
                        const mapped = files.map(f => ({
                            uid: `${Date.now()}_${f.name}`,
                            name: f.name,
                            originFileObj: f,
                        }));
                        uploadProps.onChange?.({ fileList: mapped as any });
                    }}
                />
                <div style={{ color: "#9aa0a6" }}>{t("component.ossupload.dragger.title")}</div>
                <div style={{ color: "#6c757d", fontSize: 12 }}>{t("component.ossupload.dragger.body")}</div>
            </label>
        );
    }

    return (
        <div>
            {fileList.length < maxCount && <UploadButton listType={listType} />}
            <input
                type="file"
                multiple={uploadProps.multiple}
                accept={uploadProps.accept}
                onChange={e => {
                    const files = Array.from(e.target.files || []);
                    const mapped = files.map(f => ({ uid: `${Date.now()}_${f.name}`, name: f.name, originFileObj: f }));
                    uploadProps.onChange?.({ fileList: mapped as any });
                }}
            />
        </div>
    );
};
