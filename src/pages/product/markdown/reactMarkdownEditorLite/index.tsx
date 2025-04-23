import { Row, Col, Input } from "antd";
import { useRef } from "react";
import * as marked from "marked";

import "./markdown.css";

const MarkdonwEditor = () => {
    const showRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // console.log(value)
        (showRef.current as HTMLDivElement).innerHTML = marked.parse(value);
    };

    return (
        <>
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
        </>
    );
};

export default MarkdonwEditor;
