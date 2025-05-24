import React, { useState, useRef, useCallback } from "react";
import { RiEditLine, RiEyeLine, RiSaveLine, RiClipboardLine } from "react-icons/ri";
import { Milkdown, EditorRefMethods } from "@components/MilkdownEditor";
import styles from "@styles/pages/article-edit-milkdown.module.scss";

// 默认 Markdown 内容
const defaultMarkdown = `# Milkdown 编辑器示例

这是一个 **Markdown** 编辑器，支持以下功能：

- 切换只读/编辑模式
- 获取 Markdown 内容
- 获取 HTML 内容
- 默认内容设置

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Milkdown!");
}
\`\`\`

> 引用示例：这是一个优秀的编辑器！

`;

const ArticleEditMilkdown: React.FC = () => {
    // 编辑器引用
    const editorRef = useRef<EditorRefMethods>(null);

    // 状态管理
    const [readonly, setReadonly] = useState<boolean>(false);
    const [markdown, setMarkdown] = useState<string>(defaultMarkdown);

    // 切换只读/编辑模式
    const toggleReadonly = useCallback(() => {
        const currentMarkdown = editorRef.current?.getMarkdown() || "";
        setMarkdown(currentMarkdown);
        console.log(currentMarkdown);
        setReadonly(prev => !prev);
    }, []);

    // 复制 Markdown 内容到剪贴板
    const copyMarkdown = useCallback(() => {
        const currentMarkdown = editorRef.current?.getMarkdown() || "";
        console.log("md:", currentMarkdown);
        navigator.clipboard
            .writeText(currentMarkdown)
            .then(() => {
                alert("Markdown 内容已复制到剪贴板");
            })
            .catch(err => {
                console.error("复制失败:", err);
            });
    }, []);

    // 复制 HTML 内容到剪贴板
    const copyHtml = useCallback(() => {
        const html = editorRef.current?.getHtml() || "";
        console.log("html:", html);
        navigator.clipboard
            .writeText(html)
            .then(() => {
                alert("HTML 内容已复制到剪贴板");
            })
            .catch(err => {
                console.error("复制失败:", err);
            });
    }, []);

    // 显示当前内容
    const showContent = useCallback(() => {
        const currentMarkdown = editorRef.current?.getMarkdown() || "";
        const html = editorRef.current?.getHtml() || "";
        console.log("当前 Markdown:", currentMarkdown);
        console.log("当前 HTML:", html);
        console.log("状态中的 Markdown:", markdown);
        alert(
            `Markdown 长度: ${currentMarkdown.length}\nHTML 长度: ${html.length}\n状态中 Markdown 长度: ${markdown.length}`,
        );
    }, [markdown]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Markdown 编辑器</h1>

                <div className={styles.controls}>
                    <div className={styles.switch}>
                        <span>模式:</span>
                        <button className={styles.button} onClick={toggleReadonly}>
                            {readonly ? (
                                <>
                                    <RiEditLine /> 切换到编辑模式
                                </>
                            ) : (
                                <>
                                    <RiEyeLine /> 切换到只读模式
                                </>
                            )}
                        </button>
                    </div>

                    <button className={styles.button} onClick={copyMarkdown}>
                        <RiClipboardLine /> 复制 Markdown
                    </button>

                    <button className={styles.button} onClick={copyHtml}>
                        <RiClipboardLine /> 复制 HTML
                    </button>

                    <button className={`${styles.button} ${styles.primary}`} onClick={showContent}>
                        <RiSaveLine /> 显示内容
                    </button>
                </div>
            </div>

            <div className={styles.editorWrapper}>
                <Milkdown ref={editorRef} defaultValue={markdown} readonly={readonly} />
            </div>
        </div>
    );
};

export default ArticleEditMilkdown;
