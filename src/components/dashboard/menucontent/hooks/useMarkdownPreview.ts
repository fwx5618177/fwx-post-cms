import { useRef, useCallback } from "react";
import { marked } from "marked";

/**
 * Markdown预览Hook
 * 管理Markdown内容的预览逻辑
 */
export const useMarkdownPreview = () => {
    const showRef = useRef<HTMLDivElement>(null);

    // 渲染Markdown内容到预览区域
    const renderMarkdown = useCallback((content: string) => {
        if (showRef.current && content) {
            const result = marked.parse(content);
            showRef.current.innerHTML = result;
        }
    }, []);

    // 处理Markdown内容变化
    const handleMarkdownChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;
            renderMarkdown(value);
        },
        [renderMarkdown],
    );

    // 清空预览内容
    const clearPreview = useCallback(() => {
        if (showRef.current) {
            showRef.current.innerHTML = "";
        }
    }, []);

    return {
        showRef,
        handleMarkdownChange,
        renderMarkdown,
        clearPreview,
    };
};
