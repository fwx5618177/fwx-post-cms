import { Card, Col, Row } from "antd";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { queryPathKey } from "@/request/lib";
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

            <Row
                gutter={24}
                style={{
                    margin: 12,
                }}
            >
                <Col span={12}>
                    <Card>
                        <EditorRich onChange={handleShow} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card
                        style={{
                            height: 700,
                            overflowY: "scroll",
                            wordBreak: "break-all",
                        }}
                        bordered={true}
                        hoverable
                    >
                        <div className="performance_div" ref={showRef}></div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RichEditor;
