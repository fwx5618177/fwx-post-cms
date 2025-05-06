import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { LiveProvider, LivePreview } from "react-live";
import styles from "@styles/pages/mail-template-edit.module.scss";

function isReactCode(code: string) {
    const trimmed = code.trim();
    return (
        /^\(\s*\)\s*=>/.test(trimmed) ||
        /^function\s*\(/.test(trimmed) ||
        /^class\s+/.test(trimmed) ||
        /^return\s*\(/.test(trimmed) ||
        /^<React\.Fragment>/.test(trimmed)
    );
}

const MailTemplateEdit: React.FC = () => {
    const [code, setCode] = useState<string>(
        `() => (\n  <div style={{padding:'32px',background:'#fff',color:'#222',borderRadius:12}}>\
    <h1>欢迎邮件模板</h1>\n    <p>这里是你的模板内容。</p>\n  </div>\n)`,
    );
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("saving");
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => setStatus("idle"), 1200);
        }, 1200);
    };

    return (
        <div className={styles.mailTemplateEditPage}>
            <div className={styles.header}>
                <h1>新建邮件模板</h1>
            </div>
            <div className={styles.main}>
                <div className={styles.leftPanel}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>模板名称：</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>描述：</label>
                            <input value={desc} onChange={e => setDesc(e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.editorWrap}>
                            <MonacoEditor
                                height="100%"
                                defaultLanguage={isReactCode(code) ? "javascript" : "html"}
                                theme="vs-dark"
                                value={code}
                                onChange={v => setCode(v || "")}
                                options={{
                                    fontSize: 15,
                                    minimap: { enabled: false },
                                    fontFamily: "Fira Mono, monospace",
                                    lineHeight: 1.7,
                                    fontWeight: "500",
                                    scrollbar: { vertical: "auto" },
                                }}
                            />
                        </div>
                        <button type="submit" className={styles.saveButton} disabled={status === "saving"}>
                            {status === "saving" ? "保存中..." : status === "success" ? "已保存！" : "保存模板"}
                        </button>
                    </form>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.previewPanel}>
                        <div className={styles.previewLabel}>实时预览</div>
                        <div className={styles.previewBox}>
                            {isReactCode(code) ? (
                                <LiveProvider code={code}>
                                    <LivePreview />
                                </LiveProvider>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: code }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailTemplateEdit;
