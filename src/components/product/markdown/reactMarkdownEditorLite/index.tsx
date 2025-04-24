import React from "react";
import { Row, Col, Input } from "antd";
import { useRef } from "react";
import * as marked from "marked";
import styles from "@/styles/pages/markdown.module.scss";

const MarkdonwEditor: React.FC = () => {
    const showRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // console.log(value)
        (showRef.current as HTMLDivElement).innerHTML = marked.parse(value);
    };

    return (
        <div className={styles.container}>
            <Row gutter={24}>
                <Col span={12}>
                    <Input.TextArea
                        onChange={handleChange}
                        bordered={true}
                        allowClear
                        showCount
                        autoSize={{ minRows: 20, maxRows: 20 }}
                    />
                </Col>
                <Col span={12}>
                    <div className="markdown_editor_self" ref={showRef}></div>
                </Col>
            </Row>
        </div>
    );
};

export default MarkdonwEditor;
