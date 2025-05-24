import { useEditor } from "@milkdown/react";

/**
 * 编辑器引用暴露的方法接口
 */
export interface EditorRefMethods {
    /** 获取编辑器实例 */
    getEditor: () => ReturnType<typeof useEditor>["get"] | null;
    /** 获取Markdown内容 */
    getMarkdown: () => string;
    /** 获取HTML内容 */
    getHtml: () => string;
}

/**
 * 编辑器组件的属性接口
 */
export interface EditorProps {
    /** 默认内容，Markdown格式 */
    defaultValue?: string;
    /** 是否为只读模式 */
    readonly?: boolean;
}
