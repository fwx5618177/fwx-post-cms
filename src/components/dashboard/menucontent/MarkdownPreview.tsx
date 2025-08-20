import React, { forwardRef } from "react";
// 移除 antd Card
import { useTranslation } from "react-i18next";

interface MarkdownPreviewProps {
    className?: string;
    style?: React.CSSProperties;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(({ className, style }, ref) => {
    const { t } = useTranslation();

    return (
        <>
            <h3 style={{ margin: 12 }}>{t("menucontent.header.title.show")}</h3>
            <div
                style={{
                    margin: 12,
                    height: 300,
                    overflow: "auto",
                    background: "#232428",
                    border: "1px solid #36373a",
                    borderRadius: 6,
                    padding: 12,
                    ...style,
                }}
                className={className}
            >
                <div ref={ref}></div>
            </div>
        </>
    );
});
