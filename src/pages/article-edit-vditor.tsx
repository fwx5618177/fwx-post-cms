import React, { useState, useRef, useEffect, useCallback } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import styles from "@styles/pages/article-edit-vditor.module.scss";
import Loading from "@components/Loading";
import OssUpload from "@components/OssUpload";
import EditorHeader from "@/components/EditorHeader";
import { computeEditorStats } from "@/utils/editorStats";
import { usePublishForm } from "@/hooks/usePublishForm";

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

// 文章类型选项
const articleTypes = [
    { value: "tech", label: "技术文章" },
    { value: "tutorial", label: "教程指南" },
    { value: "experience", label: "经验分享" },
    { value: "news", label: "新闻资讯" },
    { value: "review", label: "产品评测" },
    { value: "other", label: "其他" },
];

// 预设标签选项
const predefinedTags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Node.js",
    "Python",
    "Java",
    "Go",
    "Docker",
    "Kubernetes",
    "前端",
    "后端",
    "全栈",
    "移动开发",
    "数据库",
    "算法",
    "架构",
    "性能优化",
    "工具",
    "教程",
];

const ArticleEditVditor: React.FC = () => {
    // 编辑器实例引用
    const vditorRef = useRef<Vditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 状态管理
    const [isReady, setIsReady] = useState<boolean>(false);
    const { form, update, setContent, isSaving, isDirty, issues, scheduleAutoSave, autoSave, publish } = usePublishForm(
        { content: defaultMarkdown },
    );
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const autoSaveTimerRef = useRef<number | null>(null);
    const [newTag, setNewTag] = useState<string>("");
    const [showTagInput, setShowTagInput] = useState<boolean>(false);

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
                input: value => {
                    setContent(value);
                    // 启动防抖自动保存
                    if (autoSaveTimerRef.current) window.clearTimeout(autoSaveTimerRef.current);
                    autoSaveTimerRef.current = window.setTimeout(() => {
                        scheduleAutoSave();
                    }, 1000);
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
    }, [setContent, scheduleAutoSave]);

    // 获取 Markdown 内容
    const getMarkdown = useCallback((): string => {
        if (vditorRef.current) {
            return vditorRef.current.getValue();
        }
        return "";
    }, []);

    // 添加标签
    const addTag = useCallback(
        (tag: string) => {
            const trimmedTag = tag.trim();
            if (trimmedTag && !form.tags.includes(trimmedTag)) {
                update("tags", [...form.tags, trimmedTag]);
            }
            setNewTag("");
            setShowTagInput(false);
        },
        [form.tags, update],
    );

    // 移除标签
    const removeTag = useCallback(
        (tagToRemove: string) => {
            update(
                "tags",
                form.tags.filter(tag => tag !== tagToRemove),
            );
        },
        [form.tags, update],
    );

    // 处理预设标签点击
    const handlePredefinedTagClick = useCallback(
        (tag: string) => {
            addTag(tag);
        },
        [addTag],
    );

    // 处理新标签输入
    const handleNewTagSubmit = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag(newTag);
            }
            if (e.key === "Escape") {
                setNewTag("");
                setShowTagInput(false);
            }
        },
        [newTag, addTag],
    );

    // 保存内容
    const saveDraftNow = useCallback(() => void autoSave(), [autoSave]);
    const publishNow = useCallback(async () => {
        const res = await publish();
        if (!res.ok) return;
        alert("文章已发布");
    }, [publish]);

    // 预览模式切换
    const togglePreview = useCallback(() => {
        const next = !showPreview;
        setShowPreview(next);
        if (next && previewRef.current) {
            const markdown = getMarkdown();
            // 使用 Vditor 的静态预览渲染
            (Vditor as any)?.preview(previewRef.current, markdown, {
                theme: { current: "dark" },
                hljs: { style: "github-dark", lineNumber: true },
                markdown: { toc: true, footnotes: true },
                math: { engine: "KaTeX" },
            });
        }
    }, [showPreview, getMarkdown]);

    // 统计：字数/词数/阅读时长
    const stats = React.useMemo(() => computeEditorStats(form.content || ""), [form.content]);

    // 关闭或刷新时的未保存提示
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    return (
        <div className={styles.container}>
            <EditorHeader
                issues={issues}
                stats={stats}
                isSaving={isSaving}
                isDirty={isDirty}
                disabled={!isReady}
                onSaveDraft={saveDraftNow}
                onPublish={publishNow}
                extraActions={
                    <button className={styles.button} onClick={togglePreview} disabled={!isReady}>
                        {showPreview ? "返回编辑" : "预览模式"}
                    </button>
                }
            />

            {/* 文章信息表单 */}
            <div className={styles.articleForm}>
                {/* 标题输入 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章标题 *</label>
                    <input
                        type="text"
                        className={styles.titleInput}
                        placeholder="请输入文章标题..."
                        value={form.title}
                        onChange={e => update("title", e.target.value)}
                    />
                </div>

                {/* 文章类型选择 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章类型</label>
                    <select
                        className={styles.typeSelect}
                        value={form.type}
                        onChange={e => update("type", e.target.value)}
                    >
                        {articleTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 封面上传 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章封面</label>
                    <div className={styles.coverRow}>
                        <div className={styles.coverUploader}>
                            <OssUpload value={form.coverUrl} onChange={(url: string) => update("coverUrl", url)} />
                        </div>
                        {form.coverUrl && <img src={form.coverUrl} alt="cover" className={styles.coverPreview} />}
                    </div>
                </div>

                {/* 摘要 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章摘要</label>
                    <textarea
                        className={styles.excerptInput}
                        placeholder="用于列表与分享的简短摘要，建议 50-120 字"
                        rows={3}
                        value={form.excerpt}
                        onChange={e => update("excerpt", e.target.value)}
                    />
                </div>

                {/* 标签管理 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章标签</label>

                    {/* 已选择的标签 */}
                    <div className={styles.selectedTags}>
                        {form.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                                <button
                                    type="button"
                                    className={styles.removeTag}
                                    onClick={() => removeTag(tag)}
                                    aria-label={`移除标签 ${tag}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        {/* 添加新标签 */}
                        {showTagInput ? (
                            <input
                                type="text"
                                className={styles.tagInput}
                                placeholder="输入标签名称..."
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                                onKeyDown={handleNewTagSubmit}
                                onBlur={() => {
                                    if (newTag.trim()) {
                                        addTag(newTag);
                                    } else {
                                        setShowTagInput(false);
                                    }
                                }}
                                autoFocus
                            />
                        ) : (
                            <button type="button" className={styles.addTagBtn} onClick={() => setShowTagInput(true)}>
                                + 添加标签
                            </button>
                        )}
                    </div>

                    {/* 预设标签 */}
                    <div className={styles.predefinedTags}>
                        <span className={styles.predefinedLabel}>常用标签：</span>
                        {predefinedTags
                            .filter(tag => !form.tags.includes(tag))
                            .slice(0, 10)
                            .map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={styles.predefinedTag}
                                    onClick={() => handlePredefinedTagClick(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            <div className={styles.editorWrapper}>
                {showPreview ? (
                    <div ref={previewRef} className={styles.previewContainer} />
                ) : (
                    <div ref={containerRef} className={styles.vditorContainer}></div>
                )}
                {!isReady && <Loading />}
            </div>
        </div>
    );
};

export default ArticleEditVditor;
