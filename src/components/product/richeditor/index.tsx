// 移除 antd，使用原生布局
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { queryPathKey } from "@/request";
import Instro from "@/components/instro";
import EditorRich from "./editor";
import "./richtext.css";
import React from "react";
import styles from "@/styles/pages/richeditor.module.scss";

const RichEditor: React.FC = () => {
    const { t } = useTranslation();
    const showRef = useRef<HTMLDivElement>(null);

    const handleShow = (value: string) => {
        (showRef.current as HTMLDivElement).innerHTML = value;
    };

    return (
        <div className={styles.container}>
            <h3
                style={{
                    margin: 0,
                    textAlign: "center",
                }}
            >
                Rich Text
            </h3>

            <Instro routeKey={queryPathKey(window.location.pathname)} />

            <h3
                style={{
                    margin: 12,
                }}
            >
                {t("richeditor.title.wangeditor")}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: 12 }}>
                <div style={{ background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}>
                    <EditorRich onChange={handleShow} />
                </div>
                <div
                    style={{
                        background: "#232428",
                        border: "1px solid #36373a",
                        borderRadius: 6,
                        padding: 12,
                        height: 700,
                        overflowY: "auto",
                        wordBreak: "break-all",
                    }}
                >
                    <div className="performance_div" ref={showRef}></div>
                </div>
            </div>
        </div>
    );
};

export default RichEditor;
