import React, { useState, useRef, useEffect, useCallback } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import styles from "@styles/pages/article-edit-vditor.module.scss";
import sharedStyles from "@styles/pages/editor-shared.module.scss";
import Loading from "@components/Loading";
import OssUpload from "@components/OssUpload";
import EditorHeader from "@/components/EditorHeader";
import type { PublishStep } from "@/components/EditorSteps";
import { computeEditorStats } from "@/utils/editorStats";
import { usePublishForm } from "@/hooks/usePublishForm";
import { useParams } from "react-router-dom";
import { articleApi } from "@/services/api";

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
    const {
        form,
        update,
        setContent,
        isSaving,
        isDirty,
        issues,
        scheduleAutoSave,
        autoSave,
        publish,
        lastSavedAt,
        lastPublishedAt,
        lastError,
    } = usePublishForm({ content: defaultMarkdown });
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
                placeholder: "开始撰写您的文章内容...",
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

    // 统一 Vditor 工具栏 tooltip：映射 aria-label/title 到 data-tooltip，并移除 title 避免浏览器默认提示
    useEffect(() => {
        if (!isReady || !containerRef.current) return;
        const root = containerRef.current as HTMLElement;
        const toolbar = root.querySelector(".vditor-toolbar");
        if (!toolbar) return;

        const syncTooltips = () => {
            const items = toolbar.querySelectorAll<HTMLElement>(".vditor-tooltipped");
            items.forEach(el => {
                const text = el.getAttribute("aria-label") || el.getAttribute("title");
                if (text) {
                    el.setAttribute("data-tooltip", text);
                    el.removeAttribute("title");
                }
            });
        };

        // 首次同步
        syncTooltips();

        // 监听动态变更
        const observer = new MutationObserver(() => syncTooltips());
        observer.observe(toolbar, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["title", "aria-label"],
        });

        return () => observer.disconnect();
    }, [isReady]);

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
    // 路由 id 存在时，拉取文章详情同步表单与步骤
    const { id } = useParams();
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await articleApi.detail(id);
                Object.entries(data || {}).forEach(([key, value]) => {
                    if (key in form) {
                        // @ts-ignore
                        update(key as any, value as any);
                    }
                });
                if (typeof data?.content === "string") {
                    setContent(data.content);
                }
            } catch (e) {
                console.error("加载文章详情失败", e);
            }
        })();
    }, [id]);

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
        <div className={sharedStyles.page}>
            <div className={sharedStyles.main}>
                <EditorHeader
                    issues={issues}
                    stats={stats}
                    isSaving={isSaving}
                    isDirty={isDirty}
                    disabled={!isReady}
                    onSaveDraft={saveDraftNow}
                    onPublish={publishNow}
                    lastSavedAt={lastSavedAt}
                    lastPublishedAt={lastPublishedAt}
                    lastError={lastError}
                    auditStatus={form.auditStatus}
                    section={form.section}
                    scheduledAt={form.scheduledAt ?? ""}
                    onChangeAuditStatus={s => update("auditStatus", s)}
                    onChangeSection={s => update("section", s)}
                    onChangeScheduledAt={val => update("scheduledAt", val)}
                    step={((): PublishStep => {
                        if (form.status === "published") return "published";
                        if (form.auditStatus === "approved") return "confirm";
                        if (form.auditStatus === "rejected") return "review";
                        return "draft";
                    })()}
                    onStepChange={async step => {
                        switch (step) {
                            case "draft":
                                update("auditStatus", "pending");
                                update("status", "draft");
                                break;
                            case "review":
                                update("auditStatus", "pending");
                                update("status", "draft");
                                break;
                            case "confirm":
                                update("auditStatus", "approved");
                                update("status", "draft");
                                break;
                            case "published": {
                                const res = await publish();
                                if (!res.ok) return;
                                break;
                            }
                        }
                    }}
                    extraActions={
                        <button className={sharedStyles.button} onClick={togglePreview} disabled={!isReady}>
                            {showPreview ? "返回编辑" : "预览模式"}
                        </button>
                    }
                />
                <div className={`${sharedStyles.card} ${sharedStyles.titleBar}`}>
                    <input
                        className={sharedStyles.titleInputMain}
                        placeholder="请输入文章标题..."
                        value={form.title}
                        onChange={e => update("title", e.target.value)}
                    />
                </div>

                {/* 文章信息表单 */}
                <div className={sharedStyles.articleForm}>
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章标题 *</label>
                        <input
                            type="text"
                            className={sharedStyles.titleInput}
                            placeholder="请输入文章标题..."
                            value={form.title}
                            onChange={e => update("title", e.target.value)}
                        />
                    </div>
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章类型</label>
                        <select
                            className={sharedStyles.typeSelect}
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
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章封面</label>
                        <div className={sharedStyles.coverRow}>
                            <div className={sharedStyles.coverUploader}>
                                <OssUpload value={form.coverUrl} onChange={(url: string) => update("coverUrl", url)} />
                            </div>
                            {form.coverUrl && (
                                <img src={form.coverUrl} alt="cover" className={sharedStyles.coverPreview} />
                            )}
                        </div>
                    </div>
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章摘要</label>
                        <textarea
                            className={sharedStyles.excerptInput}
                            placeholder="用于列表与分享的简短摘要，建议 50-120 字"
                            rows={3}
                            value={form.excerpt}
                            onChange={e => update("excerpt", e.target.value)}
                        />
                    </div>
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章标签</label>
                        <div className={sharedStyles.selectedTags}>
                            {form.tags.map((tag, index) => (
                                <span key={index} className={sharedStyles.tag}>
                                    {tag}
                                    <button
                                        type="button"
                                        className={sharedStyles.removeTag}
                                        onClick={() => removeTag(tag)}
                                        aria-label={`移除标签 ${tag}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {showTagInput ? (
                                <input
                                    type="text"
                                    className={sharedStyles.tagInput}
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
                                <button
                                    type="button"
                                    className={sharedStyles.addTagBtn}
                                    onClick={() => setShowTagInput(true)}
                                >
                                    + 添加标签
                                </button>
                            )}
                        </div>
                        <div className={sharedStyles.predefinedTags}>
                            <span className={sharedStyles.predefinedLabel}>常用标签：</span>
                            {predefinedTags
                                .filter(tag => !form.tags.includes(tag))
                                .slice(0, 10)
                                .map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={sharedStyles.predefinedTag}
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
            <aside className={`${sharedStyles.aside} ${sharedStyles.card} ${sharedStyles.articleForm}`}>
                <h4 className={sharedStyles.asideTitle}>发布设置</h4>
                <div>
                    <div>
                        当前审核状态：
                        {form.auditStatus === "approved"
                            ? "已通过"
                            : form.auditStatus === "rejected"
                            ? "已驳回"
                            : "待审核"}
                    </div>
                    <div>分区：{form.section || "未设置"}</div>
                    <div>定时发布：{form.scheduledAt ? new Date(form.scheduledAt).toLocaleString() : "未设置"}</div>
                </div>
                <div className={sharedStyles.asideHint}>提示：如需设置/清除定时发布时间，可在顶部栏进行操作。</div>
            </aside>
        </div>
    );
};

export default ArticleEditVditor;
