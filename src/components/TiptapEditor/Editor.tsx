import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Focus from "@tiptap/extension-focus";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

// 导入所需的语言
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml"; // 用于 HTML
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import php from "highlight.js/lib/languages/php";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import yaml from "highlight.js/lib/languages/yaml";

import { EditorProps, EditorRefMethods } from "./types";
import styles from "./tiptap-editor.module.scss";
import {
    RiBold,
    RiItalic,
    RiUnderline,
    RiStrikethrough,
    RiCodeLine,
    RiH1,
    RiH2,
    RiH3,
    RiH4,
    RiH5,
    RiH6,
    RiListUnordered,
    RiListOrdered,
    RiDoubleQuotesL,
    RiLinkM,
    RiImageLine,
    RiTable2,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
    RiAlignLeft,
    RiAlignCenter,
    RiAlignRight,
    RiAlignJustify,
    RiMarkPenLine,
    RiSubscript,
    RiSuperscript,
    RiSeparator,
    RiCheckboxLine,
    RiCodeBoxLine,
    RiFontColor,
    RiPaintBrushLine,
} from "react-icons/ri";

// 创建 lowlight 实例并注册语言
const lowlight = createLowlight();

// 注册所有支持的语言
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("css", css);
lowlight.register("html", xml); // HTML 使用 xml 语法
lowlight.register("xml", xml);
lowlight.register("json", json);
lowlight.register("markdown", markdown);
lowlight.register("sql", sql);
lowlight.register("bash", bash);
lowlight.register("shell", bash); // shell 使用 bash 语法
lowlight.register("php", php);
lowlight.register("go", go);
lowlight.register("rust", rust);
lowlight.register("yaml", yaml);
lowlight.register("yml", yaml); // yml 使用 yaml 语法

/**
 * Tiptap富文本编辑器组件
 *
 * 基于Tiptap的富文本编辑器，支持丰富的文档编辑功能，类似 Notion 风格
 */
const Editor = forwardRef<EditorRefMethods, EditorProps>(
    ({ defaultValue = "", readonly = false, placeholder = "开始输入...", height = "400px", onUpdate }, ref) => {
        // 当前激活的颜色
        const [currentColor, setCurrentColor] = useState("#e1e1e1");
        const [currentHighlight, setCurrentHighlight] = useState("#ffeb3b");
        const [showLanguageSelect, setShowLanguageSelect] = useState(false);

        // 编程语言列表
        const languages = [
            { value: "javascript", label: "JavaScript" },
            { value: "typescript", label: "TypeScript" },
            { value: "python", label: "Python" },
            { value: "java", label: "Java" },
            { value: "cpp", label: "C++" },
            { value: "css", label: "CSS" },
            { value: "html", label: "HTML" },
            { value: "xml", label: "XML" },
            { value: "json", label: "JSON" },
            { value: "markdown", label: "Markdown" },
            { value: "sql", label: "SQL" },
            { value: "bash", label: "Bash" },
            { value: "shell", label: "Shell" },
            { value: "php", label: "PHP" },
            { value: "go", label: "Go" },
            { value: "rust", label: "Rust" },
            { value: "yaml", label: "YAML" },
            { value: "yml", label: "YML" },
        ];

        // 创建编辑器实例
        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    codeBlock: false, // 禁用默认代码块，使用增强版
                }),
                Placeholder.configure({
                    placeholder,
                }),
                TextStyle,
                Color.configure({
                    types: [TextStyle.name, ListItem.name],
                }),
                Highlight.configure({
                    multicolor: true,
                }),
                TextAlign.configure({
                    types: ["heading", "paragraph"],
                    alignments: ["left", "center", "right", "justify"],
                }),
                ListItem,
                Table.configure({
                    resizable: true,
                    handleWidth: 5,
                    cellMinWidth: 100,
                }),
                TableRow,
                TableHeader,
                TableCell,
                Image.configure({
                    HTMLAttributes: {
                        class: "tiptap-image",
                    },
                    allowBase64: false,
                }),
                Link.configure({
                    openOnClick: false,
                    linkOnPaste: false,
                    HTMLAttributes: {
                        class: "tiptap-link",
                    },
                }),
                Typography,
                Underline,
                Subscript,
                Superscript,
                FontFamily.configure({
                    types: ["textStyle"],
                }),
                Focus.configure({
                    className: "has-focus",
                    mode: "all",
                }),
                Dropcursor,
                Gapcursor,
                HardBreak,
                HorizontalRule,
                TaskList,
                TaskItem.configure({
                    nested: true,
                    HTMLAttributes: {
                        class: "taskItem",
                    },
                }),
                CharacterCount.configure({
                    limit: null,
                }),
                CodeBlockLowlight.configure({
                    lowlight,
                    defaultLanguage: "javascript",
                    HTMLAttributes: {
                        class: "hljs",
                        spellcheck: "false",
                    },
                    languageClassPrefix: "language-",
                }),
            ],
            content: defaultValue,
            editable: !readonly,
            autofocus: false,
            injectCSS: false,
            enableInputRules: true,
            enablePasteRules: true,
            parseOptions: {
                preserveWhitespace: "full",
            },
            onUpdate: ({ editor }) => {
                onUpdate?.({ html: editor.getHTML(), text: editor.getText() });
            },
        });

        // 监听只读状态变化
        useEffect(() => {
            if (editor) {
                editor.setEditable(!readonly);
            }
        }, [editor, readonly]);

        // 暴露编辑器方法给外部组件
        useImperativeHandle(
            ref,
            () => ({
                // 获取编辑器实例
                getEditor: () => editor,
                // 获取HTML内容
                getHtml: () => {
                    return editor?.getHTML() || "";
                },
                // 获取纯文本内容
                getText: () => {
                    return editor?.getText() || "";
                },
                // 设置内容
                setContent: (content: string) => {
                    editor?.commands.setContent(content);
                },
                // 清空内容
                clear: () => {
                    editor?.commands.clearContent();
                },
            }),
            [editor],
        );

        // 插入代码块
        const insertCodeBlock = (language: string) => {
            editor?.chain().focus().toggleCodeBlock({ language }).run();
            setShowLanguageSelect(false);
        };

        // 工具栏按钮配置
        const toolbarButtons = [
            // 撤销重做
            {
                icon: RiArrowGoBackLine,
                title: "撤销 (Ctrl+Z)",
                action: () => editor?.chain().focus().undo().run(),
                disabled: !editor?.can().undo(),
            },
            {
                icon: RiArrowGoForwardLine,
                title: "重做 (Ctrl+Y)",
                action: () => editor?.chain().focus().redo().run(),
                disabled: !editor?.can().redo(),
            },
            { type: "separator" },

            // 文本格式
            {
                icon: RiBold,
                title: "粗体 (Ctrl+B)",
                action: () => editor?.chain().focus().toggleBold().run(),
                active: editor?.isActive("bold"),
            },
            {
                icon: RiItalic,
                title: "斜体 (Ctrl+I)",
                action: () => editor?.chain().focus().toggleItalic().run(),
                active: editor?.isActive("italic"),
            },
            {
                icon: RiUnderline,
                title: "下划线 (Ctrl+U)",
                action: () => editor?.chain().focus().toggleUnderline().run(),
                active: editor?.isActive("underline"),
            },
            {
                icon: RiStrikethrough,
                title: "删除线",
                action: () => editor?.chain().focus().toggleStrike().run(),
                active: editor?.isActive("strike"),
            },
            {
                icon: RiCodeLine,
                title: "行内代码",
                action: () => editor?.chain().focus().toggleCode().run(),
                active: editor?.isActive("code"),
            },
            {
                icon: RiSubscript,
                title: "下标",
                action: () => editor?.chain().focus().toggleSubscript().run(),
                active: editor?.isActive("subscript"),
            },
            {
                icon: RiSuperscript,
                title: "上标",
                action: () => editor?.chain().focus().toggleSuperscript().run(),
                active: editor?.isActive("superscript"),
            },
            {
                icon: RiMarkPenLine,
                title: "高亮",
                action: () => editor?.chain().focus().toggleHighlight().run(),
                active: editor?.isActive("highlight"),
            },
            { type: "separator" },

            // 标题
            {
                icon: RiH1,
                title: "标题1",
                action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                active: editor?.isActive("heading", { level: 1 }),
            },
            {
                icon: RiH2,
                title: "标题2",
                action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                active: editor?.isActive("heading", { level: 2 }),
            },
            {
                icon: RiH3,
                title: "标题3",
                action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                active: editor?.isActive("heading", { level: 3 }),
            },
            {
                icon: RiH4,
                title: "标题4",
                action: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
                active: editor?.isActive("heading", { level: 4 }),
            },
            {
                icon: RiH5,
                title: "标题5",
                action: () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
                active: editor?.isActive("heading", { level: 5 }),
            },
            {
                icon: RiH6,
                title: "标题6",
                action: () => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
                active: editor?.isActive("heading", { level: 6 }),
            },
            { type: "separator" },

            // 对齐
            {
                icon: RiAlignLeft,
                title: "左对齐",
                action: () => editor?.chain().focus().setTextAlign("left").run(),
                active: editor?.isActive({ textAlign: "left" }),
            },
            {
                icon: RiAlignCenter,
                title: "居中对齐",
                action: () => editor?.chain().focus().setTextAlign("center").run(),
                active: editor?.isActive({ textAlign: "center" }),
            },
            {
                icon: RiAlignRight,
                title: "右对齐",
                action: () => editor?.chain().focus().setTextAlign("right").run(),
                active: editor?.isActive({ textAlign: "right" }),
            },
            {
                icon: RiAlignJustify,
                title: "两端对齐",
                action: () => editor?.chain().focus().setTextAlign("justify").run(),
                active: editor?.isActive({ textAlign: "justify" }),
            },
            { type: "separator" },

            // 列表
            {
                icon: RiListUnordered,
                title: "无序列表",
                action: () => editor?.chain().focus().toggleBulletList().run(),
                active: editor?.isActive("bulletList"),
            },
            {
                icon: RiListOrdered,
                title: "有序列表",
                action: () => editor?.chain().focus().toggleOrderedList().run(),
                active: editor?.isActive("orderedList"),
            },
            {
                icon: RiCheckboxLine,
                title: "任务列表",
                action: () => editor?.chain().focus().toggleTaskList().run(),
                active: editor?.isActive("taskList"),
            },
            {
                icon: RiDoubleQuotesL,
                title: "引用",
                action: () => editor?.chain().focus().toggleBlockquote().run(),
                active: editor?.isActive("blockquote"),
            },
            { type: "separator" },

            // 插入
            {
                icon: RiCodeBoxLine,
                title: "代码块",
                action: () => setShowLanguageSelect(!showLanguageSelect),
                active: editor?.isActive("codeBlock"),
            },
            {
                icon: RiSeparator,
                title: "分隔线",
                action: () => editor?.chain().focus().setHorizontalRule().run(),
            },
            {
                icon: RiLinkM,
                title: "插入链接",
                action: () => {
                    const url = window.prompt("输入链接地址:");
                    if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                    }
                },
            },
            {
                icon: RiImageLine,
                title: "插入图片",
                action: () => {
                    const url = window.prompt("输入图片地址:");
                    if (url) {
                        editor?.chain().focus().setImage({ src: url }).run();
                    }
                },
            },
            {
                icon: RiTable2,
                title: "插入表格",
                action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            },
            { type: "separator" },

            // 其他
            {
                icon: RiFormatClear,
                title: "清除格式",
                action: () => editor?.chain().focus().unsetAllMarks().run(),
            },
        ];

        if (!editor) {
            return <div className={styles.loading}>编辑器加载中...</div>;
        }

        const characterCount = editor.storage.characterCount || { characters: () => 0, words: () => 0 };

        return (
            <div className={styles.container}>
                {/* 气泡菜单 - 选中文本时显示 */}
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className={styles.bubbleMenu}>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? styles.active : ""}
                    >
                        <RiBold />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive("italic") ? styles.active : ""}
                    >
                        <RiItalic />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive("underline") ? styles.active : ""}
                    >
                        <RiUnderline />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={editor.isActive("highlight") ? styles.active : ""}
                    >
                        <RiMarkPenLine />
                    </button>
                </BubbleMenu>

                {/* 浮动菜单 - 空行时显示 */}
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className={styles.floatingMenu}>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive("heading", { level: 1 }) ? styles.active : ""}
                    >
                        <RiH1 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive("heading", { level: 2 }) ? styles.active : ""}
                    >
                        <RiH2 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive("bulletList") ? styles.active : ""}
                    >
                        <RiListUnordered />
                    </button>
                </FloatingMenu>

                {!readonly && (
                    <div className={styles.toolbar}>
                        {toolbarButtons.map((button, index) => {
                            if (button.type === "separator") {
                                return <div key={index} className={styles.separator} />;
                            }

                            const IconComponent = button.icon;
                            if (!IconComponent) return null;

                            return (
                                <button
                                    key={index}
                                    className={`${styles.toolbarButton} ${button.active ? styles.active : ""}`}
                                    onClick={button.action}
                                    disabled={button.disabled}
                                    title={button.title}
                                >
                                    <IconComponent />
                                </button>
                            );
                        })}

                        {/* 颜色选择器 */}
                        <div className={styles.colorControls}>
                            <div className={styles.colorPicker}>
                                <RiFontColor />
                                <input
                                    type="color"
                                    value={currentColor}
                                    onChange={e => {
                                        setCurrentColor(e.target.value);
                                        editor?.chain().focus().setColor(e.target.value).run();
                                    }}
                                    title="文字颜色"
                                />
                            </div>
                            <div className={styles.colorPicker}>
                                <RiPaintBrushLine />
                                <input
                                    type="color"
                                    value={currentHighlight}
                                    onChange={e => {
                                        setCurrentHighlight(e.target.value);
                                        editor?.chain().focus().toggleHighlight({ color: e.target.value }).run();
                                    }}
                                    title="高亮颜色"
                                />
                            </div>
                        </div>

                        {/* 代码语言选择 */}
                        {showLanguageSelect && (
                            <div className={styles.languageSelect}>
                                <div className={styles.languageGrid}>
                                    {languages.map(lang => (
                                        <button
                                            key={lang.value}
                                            onClick={() => insertCodeBlock(lang.value)}
                                            className={styles.languageButton}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.editor} style={{ height }}>
                    <EditorContent editor={editor} />
                </div>

                {/* 状态栏 */}
                {!readonly && (
                    <div className={styles.statusBar}>
                        <span className={styles.stats}>
                            字符: {characterCount.characters()} | 单词: {characterCount.words()}
                        </span>
                    </div>
                )}
            </div>
        );
    },
);

// 设置组件显示名称，便于调试
Editor.displayName = "TiptapEditor";

export default Editor;
