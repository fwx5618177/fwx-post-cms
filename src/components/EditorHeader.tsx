import React, { useState } from "react";
import styles from "@styles/components/editor-header.module.scss";
import EditorStats from "@/components/EditorStats";
import PublishNotice from "@/components/PublishNotice";
import EditorSteps, { PublishStep } from "@/components/EditorSteps";

export interface EditorHeaderProps {
    issues: string[];
    stats: { charCount: number; wordCount: number; readingTimeMin: number };
    isSaving?: boolean;
    isDirty?: boolean;
    disabled?: boolean;
    onSaveDraft: () => void;
    onPublish: () => void;
    extraActions?: React.ReactNode;
    lastSavedAt?: number | null;
    lastPublishedAt?: number | null;
    lastError?: string | null;
    // workflow
    auditStatus?: "pending" | "approved" | "rejected";
    section?: string;
    scheduledAt?: string | null;
    onChangeAuditStatus?: (s: "pending" | "approved" | "rejected") => void;
    onChangeSection?: (s: string) => void;
    onChangeScheduledAt?: (iso: string | null) => void;
    // steps
    step?: PublishStep;
    onStepChange?: (s: PublishStep) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
    issues,
    stats,
    isSaving,
    isDirty,
    disabled,
    onSaveDraft,
    onPublish,
    extraActions,
    lastSavedAt,
    lastPublishedAt,
    lastError,
    auditStatus,
    section,
    scheduledAt,
    onChangeAuditStatus,
    onChangeSection,
    onChangeScheduledAt,
    // steps
    step,
    onStepChange,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const auditText = (s?: "pending" | "approved" | "rejected") => {
        if (s === "approved") return "已通过";
        if (s === "rejected") return "已驳回";
        return "待审核";
    };

    const scheduledText = (iso?: string | null) => {
        if (!iso) return "未设置";
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    const handleStepsChange = (nextStep: PublishStep) => {
        if (nextStep === "review") {
            setToast("进入复审：请检查标题、摘要、封面和标签是否完善");
            window.setTimeout(() => setToast(null), 1800);
        } else if (nextStep === "confirm") {
            setToast("进入确认：请确认分区、审核状态与定时发布");
            window.setTimeout(() => setToast(null), 1800);
        } else if (nextStep === "published") {
            setToast("已发布：可在列表查看");
            window.setTimeout(() => setToast(null), 1800);
        }
        onStepChange?.(nextStep);
    };

    return (
        <div className={styles.headerWrapper}>
            {/* 将流程步骤条放到最上面并放大样式 */}
            {typeof step !== "undefined" && (
                <div className={styles.stepsBar}>
                    <EditorSteps current={step} onChange={handleStepsChange} />
                </div>
            )}
            <div className={styles.topRow}>
                <div className={styles.status} aria-live="polite">
                    {isSaving ? "自动保存中…" : isDirty ? "有未保存更改" : "已保存"}
                    {lastSavedAt ? ` · 上次保存：${new Date(lastSavedAt).toLocaleTimeString()}` : ""}
                    {lastPublishedAt ? ` · 上次发布：${new Date(lastPublishedAt).toLocaleTimeString()}` : ""}
                </div>
                {lastError && <div className={styles.errorTip}>错误：{lastError}</div>}
                <EditorStats
                    charCount={stats.charCount}
                    wordCount={stats.wordCount}
                    readingTimeMin={stats.readingTimeMin}
                />
                <div className={styles.actions}>
                    {extraActions}
                    <div className={styles.workflow}>
                        <label>
                            审核：
                            <select
                                value={auditStatus}
                                onChange={e => onChangeAuditStatus?.(e.target.value as any)}
                                disabled={disabled}
                            >
                                <option value="pending">待审核</option>
                                <option value="approved">已通过</option>
                                <option value="rejected">已驳回</option>
                            </select>
                        </label>
                        <label>
                            分区：
                            <input
                                type="text"
                                value={section ?? ""}
                                onChange={e => onChangeSection?.(e.target.value)}
                                placeholder="如：技术/生活/随笔"
                                disabled={disabled}
                            />
                        </label>
                        <label>
                            定时：
                            <input
                                type="datetime-local"
                                value={scheduledAt ?? ""}
                                onChange={e => onChangeScheduledAt?.(e.target.value || null)}
                                disabled={disabled}
                            />
                        </label>
                        {!!scheduledAt && (
                            <button
                                type="button"
                                className={`${styles.button} ${styles.tertiary}`}
                                onClick={() => {
                                    onChangeScheduledAt?.(null);
                                    setToast("已清除定时发布时间");
                                    window.setTimeout(() => setToast(null), 1500);
                                }}
                                disabled={disabled}
                                title="清除定时发布时间"
                            >
                                清除定时
                            </button>
                        )}
                    </div>
                    <button
                        className={`${styles.button} ${styles.secondary}`}
                        onClick={() => {
                            onSaveDraft();
                            setToast("草稿已保存");
                            window.setTimeout(() => setToast(null), 1500);
                        }}
                        disabled={disabled}
                    >
                        保存草稿
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={() => setShowConfirm(true)}
                        disabled={disabled}
                    >
                        发布文章
                    </button>
                </div>
            </div>
            <PublishNotice issues={issues} />

            {toast && <div className={styles.toast}>{toast}</div>}

            {showConfirm && (
                <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
                    <div className={styles.modal}>
                        <h3>确认发布</h3>
                        <div className={styles.modalBody}>
                            <div>
                                <strong>审核状态：</strong>
                                <span>{auditText(auditStatus)}</span>
                            </div>
                            <div>
                                <strong>分区：</strong>
                                <span>{section || "未设置"}</span>
                            </div>
                            <div>
                                <strong>定时发布时间：</strong>
                                <span>{scheduledText(scheduledAt)}</span>
                            </div>
                            {issues.length > 0 && (
                                <div className={styles.modalIssues}>
                                    <strong>发布前校验：</strong>
                                    <ul>
                                        {issues.map((it, idx) => (
                                            <li key={idx}>{it}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.button} onClick={() => setShowConfirm(false)}>
                                取消
                            </button>
                            <button
                                className={`${styles.button} ${styles.primary}`}
                                onClick={() => {
                                    setShowConfirm(false);
                                    onPublish();
                                }}
                                disabled={disabled}
                            >
                                确认发布
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorHeader;
