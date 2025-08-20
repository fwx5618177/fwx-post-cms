import React from "react";
// 移除 antd，使用原生布局与表单
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                    <textarea onChange={handleChange} rows={20} style={{ width: "100%" }} />
                </div>
                <div>
                    <div className="markdown_editor_self" ref={showRef}></div>
                </div>
            </div>
        </div>
    );
};

export default MarkdonwEditor;
