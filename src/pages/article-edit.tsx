import React, { useEffect, useState, useCallback } from "react";
import sharedStyles from "@styles/pages/editor-shared.module.scss";
import EditorHeader from "@/components/EditorHeader";
import type { PublishStep } from "@/components/EditorSteps";
import { usePublishForm } from "@/hooks/usePublishForm";
import { computeEditorStats } from "@/utils/editorStats";
import { useParams } from "react-router-dom";
import { articleApi } from "@/services/api";
import OssUpload from "@/components/OssUpload";

interface ArticleForm {
    title: string;
    category: string;
    tags: string[];
    content: string;
    coverImage: string;
    excerpt: string;
}

type EditMode = "view" | "edit";
type PreviewMode = "none" | "desktop" | "mobile";

type PublishStep = "draft" | "review" | "confirm" | "published";
type PublishStatus = "idle" | "loading" | "success" | "error";

interface PublishStepInfo {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const PUBLISH_STEPS: Record<PublishStep, PublishStepInfo> = {
    draft: {
        title: "Draft",
        description: "Edit and prepare your article",
        icon: <FaPen />,
    },
    review: {
        title: "Review",
        description: "Review and check content",
        icon: <FaEye />,
    },
    confirm: {
        title: "Confirm",
        description: "Confirm article details",
        icon: <FaCheck />,
    },
    published: {
        title: "Published",
        description: "Article is live",
        icon: <FaCheck />,
    },
};

const ArticleEdit = () => {
    const { id } = useParams();
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
    } = usePublishForm({ content: "" });
    const [previewMode, setPreviewMode] = useState<PreviewMode>("none");
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

    const [currentTag, setCurrentTag] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [previewMode, setPreviewMode] = useState<PreviewMode>("none");
    const [publishStep, setPublishStep] = useState<PublishStep>("draft");
    const [publishStatus, setPublishStatus] = useState<PublishStatus>("idle");
    const [publishError, setPublishError] = useState<string>("");
    const [changedFields, setChangedFields] = useState<string[]>([]);

    const categories = ["Technology", "Programming", "Design", "Business", "Other"];

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
                if (typeof data?.content === "string") setContent(data.content);
            } catch (e) {
                console.error("加载文章详情失败", e);
            }
        })();
    }, [id]);

    const stats = React.useMemo(() => computeEditorStats(form.content || ""), [form.content]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as any;
        if (name === "title") update("title", value);
        if (name === "content") update("content", value);
        if (name === "category") update("section", value);
        if (name === "excerpt") update("excerpt", value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isViewMode) return;
        const value = e.target.value;
        if (value === "custom") {
            setCustomCategory("");
        } else {
            setArticle(prev => ({
                ...prev,
                category: value,
            }));
        }
    };

    const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewMode) return;
        const value = e.target.value;
        setCustomCategory(value);
        setArticle(prev => ({
            ...prev,
            category: value,
        }));
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            if (!form.tags.includes(currentTag.trim())) {
                update("tags", [...form.tags, currentTag.trim()]);
            }
            setCurrentTag("");
        }
    };

    const addTag = useCallback(
        (tag: string) => {
            const trimmed = tag.trim();
            if (trimmed && !form.tags.includes(trimmed)) update("tags", [...form.tags, trimmed]);
            setNewTag("");
            setShowTagInput(false);
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

    const removeTag = (tagToRemove: string) => {
        update(
            "tags",
            form.tags.filter(tag => tag !== tagToRemove),
        );
    };

    const handleToolbarAction = (action: string) => {
        if (isViewMode) return;
        // TODO: Implement toolbar actions
        console.log("Toolbar action:", action);
    };

    const saveDraftNow = React.useCallback(() => void autoSave(), [autoSave]);

    const handleBack = () => {
        navigate("/content/article/list");
    };

    const handlePreviewModeChange = (newMode: PreviewMode) => {
        setPreviewMode(prevMode => (prevMode === newMode ? "none" : newMode));
    };

    const handlePublishStepChange = (step: PublishStep) => {
        setPublishStep(step);
        if (step === "review") {
            handleModeChange("view");
            // 记录变更的字段
            const changes: string[] = [];
            if (article.title) changes.push("title");
            if (article.content) changes.push("content");
            if (article.category) changes.push("category");
            if (article.tags.length > 0) changes.push("tags");
            if (article.coverImage) changes.push("coverImage");
            if (article.excerpt) changes.push("excerpt");
            setChangedFields(changes);
        }
    };

    const handleApproveReview = () => {
        handlePublishStepChange("confirm");
    };

    const handlePublish = async () => {
        const res = await publish();
        if (!res.ok) return;
        setPublishStatus("success");
        handlePublishStepChange("published");
    };

    const renderPreview = () => {
        if (previewMode === "none") return null;

        return (
            <div className={`${styles.preview} ${styles[previewMode]}`}>
                <div className={styles.previewContent}>
                    <h1>{article.title}</h1>
                    <div className={styles.articleMeta}>
                        <span className={styles.category}>{article.category}</span>
                        {article.tags.map(tag => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className={styles.content}>{article.content}</div>
                </div>
            </div>
        );
    };

    const renderPublishSteps = () => {
        const steps: PublishStep[] = ["draft", "review", "confirm", "published"];
        const currentStepIndex = steps.indexOf(publishStep);

        return (
            <div className={styles.publishSteps}>
                {steps.map((step, index) => {
                    const stepInfo = PUBLISH_STEPS[step];
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isClickable = index <= currentStepIndex + 1;

                    return (
                        <div
                            key={step}
                            className={`${styles.step} ${isActive ? styles.active : ""} ${
                                isCompleted ? styles.completed : ""
                            } ${isClickable ? styles.clickable : ""}`}
                            onClick={() => isClickable && handlePublishStepChange(step)}
                        >
                            <div className={styles.stepIcon}>{stepInfo.icon}</div>
                            <div className={styles.stepContent}>
                                <div className={styles.stepTitle}>{stepInfo.title}</div>
                                <div className={styles.stepDescription}>{stepInfo.description}</div>
                            </div>
                            {index < steps.length - 1 && <div className={styles.stepConnector} />}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStepContent = () => {
        switch (publishStep) {
            case "draft":
                return (
                    <div className={styles.mainContent}>
                        <div className={styles.editorContainer}>
                            {!isViewMode && (
                                <div className={styles.toolbar}>
                                    <button onClick={() => handleToolbarAction("bold")} title="Bold">
                                        <FaBold />
                                    </button>
                                    <button onClick={() => handleToolbarAction("italic")} title="Italic">
                                        <FaItalic />
                                    </button>
                                    <button onClick={() => handleToolbarAction("underline")} title="Underline">
                                        <FaUnderline />
                                    </button>
                                    <button onClick={() => handleToolbarAction("strikethrough")} title="Strikethrough">
                                        <FaStrikethrough />
                                    </button>
                                    <div className={styles.divider} />
                                    <button onClick={() => handleToolbarAction("list")} title="List">
                                        <FaListUl />
                                    </button>
                                    <button onClick={() => handleToolbarAction("quote")} title="Quote">
                                        <FaQuoteRight />
                                    </button>
                                    <button onClick={() => handleToolbarAction("code")} title="Code">
                                        <FaCode />
                                    </button>
                                    <button onClick={() => handleToolbarAction("image")} title="Image">
                                        <FaImage />
                                    </button>
                                    <button onClick={() => handleToolbarAction("link")} title="Link">
                                        <FaLink />
                                    </button>
                                </div>
                            )}
                            <div className={styles.editor}>
                                <textarea
                                    name="content"
                                    value={article.content}
                                    onChange={handleInputChange}
                                    placeholder="Write your article content here..."
                                    readOnly={isViewMode}
                                />
                                {previewMode !== "none" && renderPreview()}
                            </div>
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.sidebarSection}>
                                <h3>Article Settings</h3>

                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    {isViewMode ? (
                                        <input
                                            type="text"
                                            value={article.category}
                                            readOnly
                                            className={styles.viewInput}
                                        />
                                    ) : (
                                        <div className={styles.categoryInput}>
                                            <select
                                                name="category"
                                                value={
                                                    categories.includes(article.category) ? article.category : "custom"
                                                }
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                                <option value="custom">Custom Category</option>
                                            </select>
                                            {(!categories.includes(article.category) || customCategory) && (
                                                <input
                                                    type="text"
                                                    value={customCategory || article.category}
                                                    onChange={handleCustomCategoryChange}
                                                    placeholder="Enter custom category"
                                                    className={styles.customCategoryInput}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Tags</label>
                                    {!isViewMode && (
                                        <div className={styles.tagInput}>
                                            <input
                                                type="text"
                                                value={currentTag}
                                                onChange={e => setCurrentTag(e.target.value)}
                                                onKeyDown={handleTagInput}
                                                placeholder="Add tags..."
                                            />
                                        </div>
                                    )}
                                    <div className={styles.tagList}>
                                        {article.tags.map(tag => (
                                            <span key={tag} className={styles.tag}>
                                                {tag}
                                                {!isViewMode && <button onClick={() => removeTag(tag)}>&times;</button>}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Cover Image URL</label>
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={article.coverImage}
                                        onChange={handleInputChange}
                                        placeholder="Enter image URL"
                                        readOnly={isViewMode}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Excerpt</label>
                                    <textarea
                                        name="excerpt"
                                        value={article.excerpt}
                                        onChange={handleInputChange}
                                        placeholder="Write a brief excerpt..."
                                        rows={4}
                                        readOnly={isViewMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "review":
                return (
                    <div className={styles.reviewContent}>
                        <div className={styles.changesOverview}>
                            <h3>Changes Overview</h3>
                            <div className={styles.changesList}>
                                {changedFields.map(field => (
                                    <div key={field} className={styles.changeItem}>
                                        <FaCheck className={styles.changeIcon} />
                                        <span className={styles.fieldName}>{field}</span>
                                        has been updated
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.previewContent}>
                            <h1>{article.title}</h1>
                            <div className={styles.articleMeta}>
                                <span className={styles.category}>{article.category}</span>
                                {article.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.content}>{article.content}</div>
                        </div>
                        <div className={styles.reviewActions}>
                            <button className={styles.rejectButton} onClick={() => handlePublishStepChange("draft")}>
                                <FaTimes /> Back to Edit
                            </button>
                            <button className={styles.approveButton} onClick={handleApproveReview}>
                                <FaCheck /> Approve & Continue
                            </button>
                        </div>
                    </div>
                );

            case "confirm":
                return (
                    <div className={styles.confirmContent}>
                        <div className={styles.confirmationDetails}>
                            <h3>Please Confirm Article Details</h3>
                            <div className={styles.detailsList}>
                                <div className={styles.detailItem}>
                                    <strong>Title:</strong> {article.title}
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Category:</strong> {article.category}
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Tags:</strong> {article.tags.join(", ")}
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Content Length:</strong> {article.content.length} characters
                                </div>
                            </div>
                            <div className={styles.confirmWarning}>
                                <FaExclamationTriangle />
                                <p>
                                    Please note that once published, the article will be immediately visible to readers.
                                </p>
                            </div>
                        </div>
                        <div className={styles.confirmActions}>
                            <button className={styles.backButton} onClick={() => handlePublishStepChange("review")}>
                                <FaArrowLeft /> Back to Review
                            </button>
                            <button
                                className={`${styles.publishButton} ${
                                    publishStatus === "loading" ? styles.loading : ""
                                }`}
                                onClick={handlePublish}
                                disabled={publishStatus === "loading"}
                            >
                                <FaCheck /> {publishStatus === "loading" ? "Publishing..." : "Publish Now"}
                            </button>
                        </div>
                    </div>
                );

            case "published":
                return (
                    <div className={styles.publishedContent}>
                        {publishStatus === "success" ? (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <FaCheck />
                                </div>
                                <h2>Article Published Successfully!</h2>
                                <p>Your article is now live and available to readers.</p>
                                <div className={styles.publishedActions}>
                                    <button
                                        className={styles.viewButton}
                                        onClick={() => {
                                            // TODO: Navigate to published article view
                                            navigate(`/content/article/edit/${id}?mode=view`);
                                        }}
                                    >
                                        <FaEye /> View Article
                                    </button>
                                    <button className={styles.backToListButton} onClick={handleBack}>
                                        <FaArrowLeft /> Back to List
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.errorMessage}>
                                <div className={styles.errorIcon}>
                                    <FaTimes />
                                </div>
                                <h2>Publication Failed</h2>
                                <p>{publishError || "An error occurred while publishing your article."}</p>
                                <div className={styles.errorActions}>
                                    <button className={styles.retryButton} onClick={handlePublish}>
                                        Try Again
                                    </button>
                                    <button
                                        className={styles.backButton}
                                        onClick={() => handlePublishStepChange("confirm")}
                                    >
                                        Back to Confirmation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
        }
    };

    const currentStep: PublishStep = React.useMemo(() => {
        if (form.status === "published") return "published";
        if (form.auditStatus === "approved") return "confirm";
        if (form.auditStatus === "rejected") return "review";
        return "draft";
    }, [form.status, form.auditStatus]);

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
                    onPublish={handlePublish}
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
                />
                <div className={`${sharedStyles.card} ${sharedStyles.titleBar}`}>
                    <input
                        className={sharedStyles.titleInputMain}
                        placeholder="请输入文章标题..."
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={sharedStyles.articleForm}>
                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.label}>文章摘要</label>
                        <textarea
                            className={sharedStyles.excerptInput}
                            name="excerpt"
                            rows={3}
                            value={form.excerpt}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className={sharedStyles.card}>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={e => {
                            handleInputChange(e);
                            scheduleAutoSave();
                        }}
                        placeholder="在此处编写文章内容…"
                        style={{ width: "100%", minHeight: 360 }}
                    />
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
                <div>审核状态：{form.auditStatus}</div>
                <div>分区：{form.section || "未设置"}</div>
                <div>定时发布：{form.scheduledAt ? new Date(form.scheduledAt).toLocaleString() : "未设置"}</div>
                <div className={sharedStyles.asideHint}>提示：如需设置/清除定时发布时间，可在顶部栏进行操作。</div>
            </aside>
        </div>
    );
};

export default ArticleEdit;
