import React, { useState, useRef, useCallback, useEffect } from "react";
import { RiEditLine, RiEyeLine } from "react-icons/ri";
import { Milkdown, EditorRefMethods } from "@components/MilkdownEditor";
import EditorHeader from "@/components/EditorHeader";
import { usePublishForm } from "@/hooks/usePublishForm";
import { computeEditorStats } from "@/utils/editorStats";
import styles from "@styles/pages/article-edit-milkdown.module.scss";
import sharedStyles from "@styles/pages/editor-shared.module.scss";
import OssUpload from "@/components/OssUpload";
import type { PublishStep } from "@/components/EditorSteps";
import { useParams } from "react-router-dom";
import { articleApi } from "@/services/api";

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
    const [statsState, setStatsState] = useState<{ text: string }>({ text: "" });
    const stats = React.useMemo(() => computeEditorStats(statsState.text), [statsState.text]);
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
                    setMarkdown(data.content);
                }
            } catch (e) {
                console.error("加载文章详情失败", e);
            }
        })();
    }, [id]);

    // 发布表单
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
    } = usePublishForm({
        content: defaultMarkdown,
    });
    const articleTypes = [
        { value: "tech", label: "技术文章" },
        { value: "tutorial", label: "教程指南" },
        { value: "experience", label: "经验分享" },
        { value: "news", label: "新闻资讯" },
        { value: "review", label: "产品评测" },
        { value: "other", label: "其他" },
    ];
    const predefinedTags = ["JavaScript", "TypeScript", "React", "Vue", "Node.js", "前端", "后端", "算法", "教程"];
    const [newTag, setNewTag] = useState<string>("");
    const [showTagInput, setShowTagInput] = useState<boolean>(false);
    const addTag = useCallback(
        (tag: string) => {
            const trimmed = tag.trim();
            if (trimmed && !form.tags.includes(trimmed)) update("tags", [...form.tags, trimmed]);
            setNewTag("");
            setShowTagInput(false);
        },
        [form.tags, update],
    );
    const removeTag = useCallback(
        (tagToRemove: string) => {
            update(
                "tags",
                form.tags.filter(tag => tag !== tagToRemove),
            );
        },
        [form.tags, update],
    );
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

    // 步骤：从表单状态推导 + 响应步骤切换
    const currentStep: PublishStep = React.useMemo(() => {
        if (form.status === "published") return "published";
        if (form.auditStatus === "approved") return "confirm";
        if (form.auditStatus === "rejected") return "review";
        return "draft";
    }, [form.status, form.auditStatus]);

    const handleStepChange = React.useCallback(
        async (step: PublishStep) => {
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
        },
        [publish, update],
    );

    // 切换只读/编辑模式
    const toggleReadonly = useCallback(() => {
        const currentMarkdown = editorRef.current?.getMarkdown() || "";
        setMarkdown(currentMarkdown);
        console.log(currentMarkdown);
        setReadonly(prev => !prev);
    }, []);

    // 复制/显示功能移除

    // 保存和发布
    const saveDraftNow = useCallback(() => void autoSave(), [autoSave]);
    const publishNow = useCallback(async () => {
        const res = await publish();
        if (!res.ok) return;
        alert("文章已发布");
    }, [publish]);

    return (
        <div className={sharedStyles.page}>
            <div className={sharedStyles.main}>
                <EditorHeader
                    issues={issues}
                    stats={stats}
                    isSaving={isSaving}
                    isDirty={isDirty}
                    disabled={false}
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
                    step={currentStep}
                    onStepChange={handleStepChange}
                    extraActions={
                        <>
                            <button className={sharedStyles.button} onClick={toggleReadonly}>
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
                        </>
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

                <div className={styles.editorWrapper}>
                    <Milkdown
                        ref={editorRef}
                        defaultValue={markdown}
                        readonly={readonly}
                        onUpdate={({ markdown: md, html: _html }) => {
                            setMarkdown(md);
                            setStatsState({ text: md });
                            setContent(md);
                            scheduleAutoSave();
                        }}
                    />
                </div>

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
                                        if (newTag.trim()) addTag(newTag);
                                        else setShowTagInput(false);
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
                                        onClick={() => addTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <aside className={`${sharedStyles.aside} ${sharedStyles.card} ${sharedStyles.articleForm}`}>
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
                        {form.coverUrl && <img src={form.coverUrl} alt="cover" className={sharedStyles.coverPreview} />}
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
                                    if (newTag.trim()) addTag(newTag);
                                    else setShowTagInput(false);
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
                                    onClick={() => addTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                    </div>
                </div>
            </aside>
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

export default ArticleEditMilkdown;
