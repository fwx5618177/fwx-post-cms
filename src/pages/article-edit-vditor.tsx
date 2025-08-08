import React, { useState, useRef, useEffect, useCallback } from "react";
import { RiSaveLine } from "react-icons/ri";
import Vditor from "vditor";
import "vditor/dist/index.css";
import styles from "@styles/pages/article-edit-vditor.module.scss";
import Loading from "@components/Loading";
import OssUpload from "@components/OssUpload";

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

// 文章数据接口
interface ArticleData {
    title: string;
    content: string;
    tags: string[];
    type: string;
    status: "draft" | "published";
    coverUrl?: string;
    excerpt?: string;
}

const ArticleEditVditor: React.FC = () => {
    // 编辑器实例引用
    const vditorRef = useRef<Vditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 状态管理
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const autoSaveTimerRef = useRef<number | null>(null);
    const [articleData, setArticleData] = useState<ArticleData>({
        title: "",
        content: defaultMarkdown,
        tags: [],
        type: "tech",
        status: "draft",
        coverUrl: "",
        excerpt: "",
    });
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
                    setArticleData(prev => ({ ...prev, content: value }));
                    setIsDirty(true);
                    // 启动防抖自动保存
                    if (autoSaveTimerRef.current) window.clearTimeout(autoSaveTimerRef.current);
                    autoSaveTimerRef.current = window.setTimeout(() => {
                        handleAutoSave();
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
    }, []);

    // 获取 Markdown 内容
    const getMarkdown = useCallback((): string => {
        if (vditorRef.current) {
            return vditorRef.current.getValue();
        }
        return "";
    }, []);

    // 自动保存（草稿）
    const handleAutoSave = useCallback(() => {
        if (!isReady) return;
        setIsSaving(true);
        const markdown = getMarkdown();
        const draft: ArticleData = { ...articleData, content: markdown, status: "draft" };
        // 这里可以调用草稿保存接口
        console.log("自动保存草稿:", draft);
        setTimeout(() => {
            setIsSaving(false);
            setIsDirty(false);
        }, 400);
    }, [articleData, getMarkdown, isReady]);

    // 添加标签
    const addTag = useCallback(
        (tag: string) => {
            const trimmedTag = tag.trim();
            if (trimmedTag && !articleData.tags.includes(trimmedTag)) {
                setArticleData(prev => ({
                    ...prev,
                    tags: [...prev.tags, trimmedTag],
                }));
            }
            setNewTag("");
            setShowTagInput(false);
        },
        [articleData.tags],
    );

    // 移除标签
    const removeTag = useCallback((tagToRemove: string) => {
        setArticleData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    }, []);

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
    const saveContent = useCallback(
        (status: "draft" | "published" = "draft") => {
            const markdown = getMarkdown();

            const finalArticleData: ArticleData = {
                ...articleData,
                content: markdown,
                status,
            };

            // 验证必填字段
            if (!finalArticleData.title.trim()) {
                alert("请输入文章标题");
                return;
            }

            if (!finalArticleData.content.trim()) {
                alert("请输入文章内容");
                return;
            }

            if (status === "published") {
                const ok = window.confirm("确定要发布文章吗？发布后将对外可见。");
                if (!ok) return;
            }

            // 这里可以添加保存到服务器的逻辑
            console.log("保存内容:", finalArticleData);

            // 显示保存成功提示
            alert(`文章已${status === "published" ? "发布" : "保存为草稿"}`);
            setIsDirty(false);
        },
        [getMarkdown, articleData],
    );

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
            <div className={styles.header}>
                <h1>Vditor Markdown 编辑器</h1>

                <div className={styles.controls}>
                    <div className={styles.modeInfo} aria-live="polite">
                        {isSaving ? "自动保存中…" : isDirty ? "有未保存更改" : "已保存"}
                    </div>
                    <button
                        className={`${styles.button} ${styles.secondary}`}
                        onClick={() => saveContent("draft")}
                        disabled={!isReady}
                    >
                        <RiSaveLine /> 保存草稿
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={() => saveContent("published")}
                        disabled={!isReady}
                    >
                        <RiSaveLine /> 发布文章
                    </button>
                </div>
            </div>

            {/* 文章信息表单 */}
            <div className={styles.articleForm}>
                {/* 标题输入 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章标题 *</label>
                    <input
                        type="text"
                        className={styles.titleInput}
                        placeholder="请输入文章标题..."
                        value={articleData.title}
                        onChange={e => setArticleData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>

                {/* 文章类型选择 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章类型</label>
                    <select
                        className={styles.typeSelect}
                        value={articleData.type}
                        onChange={e => setArticleData(prev => ({ ...prev, type: e.target.value }))}
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
                            <OssUpload
                                value={articleData.coverUrl}
                                onChange={(url: string) => setArticleData(prev => ({ ...prev, coverUrl: url }))}
                            />
                        </div>
                        {articleData.coverUrl && (
                            <img src={articleData.coverUrl} alt="cover" className={styles.coverPreview} />
                        )}
                    </div>
                </div>

                {/* 摘要 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章摘要</label>
                    <textarea
                        className={styles.excerptInput}
                        placeholder="用于列表与分享的简短摘要，建议 50-120 字"
                        rows={3}
                        value={articleData.excerpt}
                        onChange={e => setArticleData(prev => ({ ...prev, excerpt: e.target.value }))}
                    />
                </div>

                {/* 标签管理 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>文章标签</label>

                    {/* 已选择的标签 */}
                    <div className={styles.selectedTags}>
                        {articleData.tags.map((tag, index) => (
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
                            .filter(tag => !articleData.tags.includes(tag))
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
                <div ref={containerRef} className={styles.vditorContainer}></div>
                {!isReady && <Loading />}
            </div>
        </div>
    );
};

export default ArticleEditVditor;
