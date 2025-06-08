import React, { useState, useRef, useEffect, useCallback } from "react";
import { RiSaveLine } from "react-icons/ri";
import Vditor from "vditor";
import "vditor/dist/index.css";
import styles from "@styles/pages/article-edit-vditor.module.scss";

// 默认 Markdown 内容
const defaultMarkdown = `# Vditor 编辑器示例

这是一个功能强大的 **Markdown** 编辑器，支持以下功能：

- 分屏预览模式
- 代码高亮
- 数学公式支持
- 图表绘制
- 文件上传

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Vditor!");
}
\`\`\`

## 数学公式

行内公式：$E = mc^2$

块级公式：
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

> 引用示例：这是一个优秀的 Markdown 编辑器！

| 功能 | 支持 |
| --- | --- |
| Markdown | ✅ |
| 代码高亮 | ✅ |
| 数学公式 | ✅ |
| 图表 | ✅ |

`;

const ArticleEditVditor: React.FC = () => {
    // 编辑器实例引用
    const vditorRef = useRef<Vditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 状态管理
    const [isReady, setIsReady] = useState<boolean>(false);

    // 初始化编辑器
    useEffect(() => {
        if (containerRef.current && !vditorRef.current) {
            const vditor = new Vditor(containerRef.current, {
                height: "100%",
                mode: "ir",
                placeholder: "请输入内容...",
                theme: "dark",
                value: defaultMarkdown,
                cache: {
                    enable: false,
                },
                preview: {
                    delay: 1000,
                    mode: "both",
                    markdown: {
                        toc: true,
                        footnotes: true,
                        codeBlockPreview: true,
                    },
                    hljs: {
                        enable: true,
                        lineNumber: true,
                        style: "github-dark",
                    },
                    math: {
                        engine: "KaTeX",
                    },
                },
                upload: {
                    url: "/api/upload",
                    success: (editor: HTMLElement, msg: string) => {
                        console.log("上传成功:", msg);
                    },
                    error: (msg: string) => {
                        console.error("上传失败:", msg);
                    },
                },
                after: () => {
                    vditorRef.current = vditor;
                    setIsReady(true);
                    console.log("Vditor 编辑器初始化完成");
                },
            });
        }

        // 清理函数
        return () => {
            if (vditorRef.current) {
                vditorRef.current.destroy();
                vditorRef.current = null;
            }
        };
    }, []);

    // 获取 Markdown 内容
    const getMarkdown = useCallback((): string => {
        if (vditorRef.current) {
            return vditorRef.current.getValue();
        }
        return "";
    }, []);

    // 保存内容
    const saveContent = useCallback(() => {
        const markdown = getMarkdown();

        // 这里可以添加保存到服务器的逻辑
        console.log("保存内容:", { markdown });
    }, [getMarkdown]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Vditor Markdown 编辑器</h1>

                <div className={styles.controls}>
                    <button className={`${styles.button} ${styles.primary}`} onClick={saveContent} disabled={!isReady}>
                        <RiSaveLine /> 保存内容
                    </button>
                </div>
            </div>

            <div className={styles.editorWrapper}>
                <div ref={containerRef} className={styles.vditorContainer}></div>
                {!isReady && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <span>编辑器加载中...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleEditVditor;
