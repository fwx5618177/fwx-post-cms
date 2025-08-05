import { useCallback } from "react";
import { useMarkdownPreview } from "./hooks/useMarkdownPreview";
import { useFormData } from "./hooks/useFormData";
import { FormValues, UpdateFormValues } from "./types";

/**
 * MenuContent主Hook
 * 整合了Markdown预览和表单数据管理的功能
 * 重构后职责更加清晰
 */
export const useMenuContent = () => {
    // 使用拆分后的hooks
    const { showRef, handleMarkdownChange, renderMarkdown } = useMarkdownPreview();
    const { routeList, versions, loadStatus, detailInfos, setLoadStatus, getDetailInfo, createContent, updateContent } =
        useFormData();

    // 处理表单提交
    const handleFormSubmit = useCallback(
        async (values: FormValues) => {
            await createContent(values);
        },
        [createContent],
    );

    // 处理表单提交失败
    const handleFormSubmitFailed = useCallback(
        (errorInfo: {
            values: FormValues;
            errorFields: Array<{ name: string[]; errors: string[] }>;
            outOfDate: boolean;
        }) => {
            console.log("Failed:", errorInfo);
        },
        [],
    );

    // 获取详细信息并渲染到预览区域
    const handleDetailInfo = useCallback(
        async (title: string) => {
            const data = await getDetailInfo(title);
            if (data?.content) {
                renderMarkdown(data.content);
            }
            return data;
        },
        [getDetailInfo, renderMarkdown],
    );

    // 处理更新
    const handleUpdate = useCallback(
        async (values: UpdateFormValues) => {
            await updateContent(values);
        },
        [updateContent],
    );

    // 重置表单（将在组件中实现，因为需要访问form实例）
    const handleReset = useCallback(() => {
        // 这个方法将在组件中实现，因为需要访问 form 实例
    }, []);

    return {
        showRef,
        routeList,
        versions,
        loadStatus,
        detailInfos,
        setLoadStatus,
        handleMarkdownChange,
        handleFormSubmit,
        handleFormSubmitFailed,
        handleDetailInfo,
        handleUpdate,
        handleReset,
    };
};
