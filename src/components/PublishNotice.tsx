import React from "react";
import styles from "@styles/components/publish-notice.module.scss";

export interface PublishNoticeProps {
    issues: string[];
}

const PublishNotice: React.FC<PublishNoticeProps> = ({ issues }) => {
    if (!issues.length) return null;
    return (
        <div className={styles.notice} role="alert" aria-live="polite">
            <strong>发布校验未通过：</strong>
            <ul>
                {issues.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default PublishNotice;
