import React from "react";
import styles from "@styles/components/editor-header.module.scss";
import EditorStats from "@/components/EditorStats";
import PublishNotice from "@/components/PublishNotice";

export interface EditorHeaderProps {
    issues: string[];
    stats: { charCount: number; wordCount: number; readingTimeMin: number };
    isSaving?: boolean;
    isDirty?: boolean;
    disabled?: boolean;
    onSaveDraft: () => void;
    onPublish: () => void;
    extraActions?: React.ReactNode;
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
}) => {
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.topRow}>
                <div className={styles.status} aria-live="polite">
                    {isSaving ? "自动保存中…" : isDirty ? "有未保存更改" : "已保存"}
                </div>
                <EditorStats
                    charCount={stats.charCount}
                    wordCount={stats.wordCount}
                    readingTimeMin={stats.readingTimeMin}
                />
                <div className={styles.actions}>
                    {extraActions}
                    <button
                        className={`${styles.button} ${styles.secondary}`}
                        onClick={onSaveDraft}
                        disabled={disabled}
                    >
                        保存草稿
                    </button>
                    <button className={`${styles.button} ${styles.primary}`} onClick={onPublish} disabled={disabled}>
                        发布文章
                    </button>
                </div>
            </div>
            <PublishNotice issues={issues} />
        </div>
    );
};

export default EditorHeader;
