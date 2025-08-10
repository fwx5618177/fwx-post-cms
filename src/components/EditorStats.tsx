import React from "react";
import styles from "@styles/components/editor-stats.module.scss";

export interface EditorStatsProps {
    charCount: number;
    wordCount: number;
    readingTimeMin: number;
    className?: string;
}

const EditorStats: React.FC<EditorStatsProps> = ({ charCount, wordCount, readingTimeMin, className }) => {
    return (
        <div className={`${styles.stats} ${className || ""}`.trim()} aria-live="polite">
            <span>字符: {charCount}</span>
            <span>词数: {wordCount}</span>
            <span>预计阅读: {readingTimeMin} 分钟</span>
        </div>
    );
};

export default EditorStats;
