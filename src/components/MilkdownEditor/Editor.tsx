import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { EditorView } from "@milkdown/prose/view";
import { Node as ProsemirrorNode } from "@milkdown/prose/model";
import { editorViewCtx, serializerCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { DOMSerializer } from "@milkdown/prose/model";
import { EditorProps, EditorRefMethods } from "./types";
import "./milkdown-editor.module.scss";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "@milkdown/prose/view/style/prosemirror.css";
import "@milkdown/prose/tables/style/tables.css";
import "@milkdown/prose/gapcursor/style/gapcursor.css";

/**
 * Milkdown编辑器组件
 *
 * 基于Crepe的Markdown编辑器，支持设置默认内容、只读模式，
 * 并提供获取Markdown和HTML内容的功能
 */
const Editor = forwardRef<EditorRefMethods, EditorProps>(({ defaultValue = "", readonly = false, onUpdate }, ref) => {
    // 编辑器实例引用
    let crepe: Crepe | undefined;
    // 创建一个ref来存储编辑器实例，便于在外部方法中访问
    const editorRef = useRef<ReturnType<typeof useEditor>["get"] | null>(null);
    // 内部维护一个只读状态，避免直接使用props导致的重渲染问题
    const [isReadonly, setIsReadonly] = useState<boolean>(readonly);

    // 当外部readonly属性变化时，更新内部状态
    useEffect(() => {
        setIsReadonly(readonly);
    }, [readonly]);

    /**
     * 获取Markdown内容
     */
    const getMarkdown = useCallback((): string => {
        const editor = editorRef.current?.();
        if (!editor) return "";

        try {
            return editor.action(ctx => {
                const view = ctx.get(editorViewCtx) as EditorView;
                const serializer = ctx.get(serializerCtx) as (node: ProsemirrorNode) => string;
                return serializer(view.state.doc);
            });
        } catch (error) {
            console.warn("获取Markdown内容失败:", error);
            return "";
        }
    }, []);

    /**
     * 获取HTML内容
     */
    const getHtml = useCallback((): string => {
        const editor = editorRef.current?.();
        if (!editor) return "";

        try {
            return editor.action(ctx => {
                const view = ctx.get(editorViewCtx) as EditorView;
                const schema = view.state.schema;
                const domSerializer = DOMSerializer.fromSchema(schema);
                const dom = domSerializer.serializeFragment(view.state.doc.content);

                // 创建临时容器并获取HTML
                const tempContainer = document.createElement("div");
                tempContainer.appendChild(dom);
                return tempContainer.innerHTML;
            });
        } catch (error) {
            console.warn("获取HTML内容失败:", error);
            return "";
        }
    }, []);

    // 暴露编辑器方法给外部组件
    useImperativeHandle(
        ref,
        () => ({
            // 获取编辑器实例
            getEditor: () => editorRef.current,
            // 获取Markdown内容
            getMarkdown,
            // 获取HTML内容
            getHtml,
        }),
        [getMarkdown, getHtml],
    );

    const { get } = useEditor(
        root => {
            // 创建Crepe编辑器实例
            crepe = new Crepe({
                root,
                defaultValue,
                features: {
                    [CrepeFeature.CodeMirror]: true,
                    [CrepeFeature.ListItem]: true,
                    [CrepeFeature.LinkTooltip]: true,
                    [CrepeFeature.ImageBlock]: true,
                    [CrepeFeature.BlockEdit]: true,
                    [CrepeFeature.Cursor]: true,
                    [CrepeFeature.Placeholder]: true,
                    // 使用自定义 React Toolbar，禁用内置 Toolbar
                    [CrepeFeature.Toolbar]: false,
                },
            });

            // 根据内部状态设置只读状态
            if (isReadonly) {
                crepe.setReadonly(true);
            }

            return crepe;
        },
        [isReadonly, defaultValue],
    );

    // 存储编辑器实例到ref中
    editorRef.current = get;

    // 初始化编辑器并挂载变更监听
    useEffect(() => {
        const editor = get();
        if (!editor) return;

        editor.use(commonmark);

        let originalDispatch: any = null;

        const tryAttach = () => {
            try {
                editor.action((ctx: any) => {
                    let view: EditorView | undefined;
                    try {
                        view = ctx.get(editorViewCtx) as EditorView | undefined;
                    } catch {
                        view = undefined;
                    }
                    if (!view || !view.dispatchTransaction) return;
                    originalDispatch = view.dispatchTransaction;
                    view.dispatchTransaction = (tr: any) => {
                        originalDispatch.call(view, tr);
                        try {
                            const markdown = getMarkdown();
                            const html = getHtml();
                            onUpdate?.({ markdown, html });
                        } catch {}
                    };
                });
            } catch {
                // ignore and retry
            }
        };

        // 初次尝试挂载；若此时 view 尚未准备好，延时再试一次
        tryAttach();
        const retryTimer = window.setTimeout(tryAttach, 50);

        return () => {
            // 恢复原始 dispatchTransaction
            editor.action((ctx: any) => {
                const view = ctx.get(editorViewCtx) as EditorView | undefined;
                if (!view || !originalDispatch) return;
                view.dispatchTransaction = originalDispatch;
            });
            window.clearTimeout(retryTimer);
        };
    }, [get, getHtml, getMarkdown, onUpdate]);

    return <Milkdown />;
});

// 设置组件显示名称，便于调试
Editor.displayName = "MilkdownEditor";

export default Editor;
