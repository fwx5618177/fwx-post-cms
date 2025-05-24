import { Editor } from "@tiptap/react";

/**
 * 编辑器引用暴露的方法接口
 */
export interface EditorRefMethods {
    /** 获取编辑器实例 */
    getEditor: () => Editor | null;
    /** 获取HTML内容 */
    getHtml: () => string;
    /** 获取纯文本内容 */
    getText: () => string;
    /** 设置内容 */
    setContent: (content: string) => void;
    /** 清空内容 */
    clear: () => void;
}

/**
 * 编辑器组件的属性接口
 */
export interface EditorProps {
    /** 默认内容，HTML格式 */
    defaultValue?: string;
    /** 是否为只读模式 */
    readonly?: boolean;
    /** 占位符文本 */
    placeholder?: string;
    /** 编辑器高度 */
    height?: string;
}
