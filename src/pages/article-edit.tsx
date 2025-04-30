import React, { useState, useEffect } from "react";
import styles from "@styles/pages/article-edit.module.scss";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
    FaImage,
    FaLink,
    FaListUl,
    FaQuoteRight,
    FaCode,
    FaBold,
    FaItalic,
    FaUnderline,
    FaStrikethrough,
    FaArrowLeft,
    FaEye,
    FaPen,
    FaDesktop,
    FaMobileAlt,
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
} from "react-icons/fa";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = (searchParams.get("mode") as EditMode) || "edit";
    const isViewMode = mode === "view";
    const isCreateMode = !id;

    const [article, setArticle] = useState<ArticleForm>({
        title: "",
        category: "",
        tags: [],
        content: "",
        coverImage: "",
        excerpt: "",
    });

    const [currentTag, setCurrentTag] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [previewMode, setPreviewMode] = useState<PreviewMode>("none");
    const [publishStep, setPublishStep] = useState<PublishStep>("draft");
    const [publishStatus, setPublishStatus] = useState<PublishStatus>("idle");
    const [publishError, setPublishError] = useState<string>("");
    const [changedFields, setChangedFields] = useState<string[]>([]);

    const categories = ["Technology", "Programming", "Design", "Business", "Other"];

    useEffect(() => {
        if (id) {
            // TODO: Fetch article data using id
            console.log("Fetching article with id:", id);
        }
    }, [id]);

    const handleModeChange = (newMode: EditMode) => {
        setSearchParams({ mode: newMode });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        setArticle(prev => ({
            ...prev,
            [name]: value,
        }));
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
        if (isViewMode) return;
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            if (!article.tags.includes(currentTag.trim())) {
                setArticle(prev => ({
                    ...prev,
                    tags: [...prev.tags, currentTag.trim()],
                }));
            }
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        if (isViewMode) return;
        setArticle(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleToolbarAction = (action: string) => {
        if (isViewMode) return;
        // TODO: Implement toolbar actions
        console.log("Toolbar action:", action);
    };

    const handleSave = () => {
        if (isViewMode) return;
        // TODO: Implement save functionality
        console.log("Saving article:", article);
    };

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
        try {
            setPublishStatus("loading");
            // TODO: 实际的发布 API 调用
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟 API 调用
            setPublishStatus("success");
            handlePublishStepChange("published");
        } catch (error) {
            setPublishStatus("error");
            setPublishError(error instanceof Error ? error.message : "Failed to publish article");
        }
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

    return (
        <div className={styles.articleEditPage}>
            <div className={styles.header}>
                <div className={styles.headerControls}>
                    {!isCreateMode && (
                        <>
                            <button className={styles.backButton} onClick={handleBack}>
                                <FaArrowLeft />
                            </button>
                            <div className={styles.divider} />
                        </>
                    )}
                    <input
                        type="text"
                        name="title"
                        value={article.title}
                        onChange={handleInputChange}
                        placeholder="Enter article title..."
                        className={styles.titleInput}
                        readOnly={isViewMode}
                    />
                </div>
                <div className={styles.actionControls}>
                    {!isCreateMode && (
                        <div className={styles.modeSwitch}>
                            <button
                                className={mode === "edit" ? styles.active : ""}
                                onClick={() => handleModeChange("edit")}
                            >
                                <FaPen />
                                Edit
                            </button>
                            <button
                                className={mode === "view" ? styles.active : ""}
                                onClick={() => handleModeChange("view")}
                            >
                                <FaEye />
                                View
                            </button>
                        </div>
                    )}
                    {!isViewMode && (
                        <>
                            <div className={styles.previewControls}>
                                <button
                                    className={previewMode === "desktop" ? styles.active : ""}
                                    onClick={() => handlePreviewModeChange("desktop")}
                                    title="Desktop Preview"
                                >
                                    <FaDesktop />
                                </button>
                                <button
                                    className={previewMode === "mobile" ? styles.active : ""}
                                    onClick={() => handlePreviewModeChange("mobile")}
                                    title="Mobile Preview"
                                >
                                    <FaMobileAlt />
                                </button>
                            </div>
                            <button
                                className={`${styles.publishButton} ${
                                    publishStep === "published" ? styles.published : ""
                                }`}
                                onClick={() => {
                                    const nextSteps: Record<PublishStep, PublishStep> = {
                                        draft: "review",
                                        review: "confirm",
                                        confirm: "published",
                                        published: "published",
                                    };
                                    handlePublishStepChange(nextSteps[publishStep]);
                                }}
                            >
                                {publishStep === "published" ? "Published" : "Publish"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {renderPublishSteps()}
            {renderStepContent()}
        </div>
    );
};

export default ArticleEdit;
