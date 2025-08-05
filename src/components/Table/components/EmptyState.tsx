import React from "react";
import { FaInbox, FaExclamationTriangle } from "react-icons/fa";
import styles from "../table.module.scss";

interface EmptyStateProps {
    emptyText: React.ReactNode;
}

interface ErrorStateProps {
    errorText?: string;
}

export function EmptyState({ emptyText }: EmptyStateProps) {
    return (
        <div className={styles.empty}>
            <FaInbox className={styles.emptyIcon} size={64} />
            <div className={styles.emptyText}>{typeof emptyText === "string" ? emptyText : emptyText}</div>
        </div>
    );
}

export function ErrorState({ errorText = "加载失败，请重试" }: ErrorStateProps) {
    return (
        <div className={styles.errorState}>
            <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: 12 }} />
            <div className={styles.errorText}>{errorText}</div>
        </div>
    );
}
