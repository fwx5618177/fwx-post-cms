import React, { forwardRef } from "react";
import { Card } from "antd";
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
            <Card
                style={{
                    margin: 12,
                    height: 300,
                    overflow: "scroll",
                    ...style,
                }}
                className={className}
            >
                <div ref={ref}></div>
            </Card>
        </>
    );
});
