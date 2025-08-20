import React, { useState, useRef, useCallback, useEffect } from "react";
import { RiEditLine, RiEyeLine, RiDeleteBinLine } from "react-icons/ri";
import { TiptapEditor, EditorRefMethods } from "@components/TiptapEditor";
import EditorHeader from "@/components/EditorHeader";
import OssUpload from "@/components/OssUpload";
import { usePublishForm } from "@/hooks/usePublishForm";
import { computeEditorStats } from "@/utils/editorStats";
import styles from "@styles/pages/article-edit-tiptap.module.scss";
import sharedStyles from "@styles/pages/editor-shared.module.scss";
import type { PublishStep } from "@/components/EditorSteps";
import { useParams } from "react-router-dom";
import { articleApi } from "@/services/api";

// 默认 HTML 内容
const defaultHtml = `<h1>Tiptap 富文本编辑器</h1>

<p>这是一个功能强大的富文本编辑器，基于 <strong>Tiptap</strong> 构建，类似 <em>Notion</em> 的体验。</p>

<h2>✨ 主要功能</h2>

<ul>
  <li><strong>丰富的文本格式</strong>：粗体、斜体、<u>下划线</u>、<s>删除线</s>、<mark>高亮</mark>、<sup>上标</sup>、<sub>下标</sub></li>
  <li><strong>多级标题</strong>：支持 H1-H6 六级标题</li>
  <li><strong>智能列表</strong>：有序列表、无序列表、任务列表</li>
  <li><strong>代码支持</strong>：行内 <code>代码</code> 和代码块，支持语法高亮</li>
  <li><strong>表格和媒体</strong>：插入表格、图片、链接</li>
</ul>

<h3>📝 任务列表示例</h3>

<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">完成富文本编辑器开发</li>
  <li data-type="taskItem" data-checked="false">添加更多扩展功能</li>
  <li data-type="taskItem" data-checked="false">编写用户文档</li>
</ul>

<h3>💻 代码示例</h3>

<pre><code class="language-javascript">// JavaScript 代码示例
function createEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder],
    content: defaultContent,
    editable: true
  });
  
  return editor;
}</code></pre>

<blockquote>
  <p><strong>提示</strong>：选中文本时会出现气泡菜单，空行时会显示浮动菜单，让编辑更加便捷！</p>
</blockquote>

<h3>🎨 文本对齐和样式</h3>

<p style="text-align: center">这是居中对齐的段落</p>

<p style="text-align: right">这是右对齐的段落</p>

<h3>📊 表格示例</h3>

<table>
  <tr>
    <th>功能</th>
    <th>支持程度</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>文本格式</td>
    <td>✅ 完全支持</td>
    <td>粗体、斜体、下划线等</td>
  </tr>
  <tr>
    <td>代码高亮</td>
    <td>✅ 完全支持</td>
    <td>支持多种编程语言</td>
  </tr>
  <tr>
    <td>段落移动</td>
    <td>✅ 完全支持</td>
    <td>类似 Notion 的体验</td>
  </tr>
</table>

<hr>

<p><strong>开始使用：</strong>尝试选择文本、创建列表、插入代码块，体验丰富的编辑功能！</p>`;

const ArticleEditTiptap: React.FC = () => {
    // 编辑器引用
    const editorRef = useRef<EditorRefMethods>(null);

    // 状态管理
    const [readonly, setReadonly] = useState<boolean>(false);
    const [htmlContent, setHtmlContent] = useState<string>(defaultHtml);
    const [statsState, setStatsState] = useState<{ text: string }>({ text: "" });
    const stats = React.useMemo(() => computeEditorStats(statsState.text), [statsState.text]);
    // 路由 id 存在时，拉取文章详情同步表单与步骤
    const { id } = useParams();
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await articleApi.detail(id);
                // 假定后端返回 { title, content, tags, type, status, auditStatus, section, scheduledAt, coverUrl, excerpt }
                Object.entries(data || {}).forEach(([key, value]) => {
                    // 仅同步已存在字段
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
        content: defaultHtml,
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
            if (trimmed && !form.tags.includes(trimmed)) {
                update("tags", [...form.tags, trimmed]);
            }
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

    const handleStepChange = useCallback(
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
        const currentHtml = editorRef.current?.getHtml() || "";
        setHtmlContent(currentHtml);
        setReadonly(prev => !prev);
    }, []);

    // 移除复制相关功能

    // 清空内容
    const clearContent = useCallback(() => {
        editorRef.current?.clear();
        setHtmlContent("");
        setContent("");
    }, [setContent]);

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

                            {/* 移除复制 HTML/纯文本按钮 */}

                            <button className={`${sharedStyles.button} ${styles.danger}`} onClick={clearContent}>
                                <RiDeleteBinLine /> 清空内容
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

                <div className={styles.editorWrapper}>
                    <TiptapEditor
                        ref={editorRef}
                        defaultValue={htmlContent}
                        readonly={readonly}
                        placeholder="开始撰写您的文章内容..."
                        height="calc(100vh - 200px)"
                        onUpdate={({ html, text }) => {
                            setHtmlContent(html);
                            setStatsState({ text });
                            setContent(html);
                            scheduleAutoSave();
                        }}
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

export default ArticleEditTiptap;
