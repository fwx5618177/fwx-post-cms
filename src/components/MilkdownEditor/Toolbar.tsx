import React from "react";
import { EditorView } from "@milkdown/prose/view";
import { editorViewCtx } from "@milkdown/kit/core";
import { toggleMark, setBlockType, wrapIn } from "@milkdown/prose/commands";
import { undo, redo } from "@milkdown/prose/history";
import {
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
    RiBold,
    RiItalic,
    RiCodeLine,
    RiH1,
    RiH2,
    RiH3,
    RiListUnordered,
    RiListOrdered,
    RiDoubleQuotesL,
    RiLinkM,
    RiImageLine,
    RiSeparator,
    RiCheckboxLine,
    RiTable2,
} from "react-icons/ri";
import styles from "@styles/components/milkdown-toolbar.module.scss";

export interface MilkdownToolbarProps {
    getEditor: (() => any) | null; // useEditor.get 返回的 getter
    readonly?: boolean;
}

const MilkdownToolbar: React.FC<MilkdownToolbarProps> = ({ getEditor, readonly }) => {
    const run = (runner: (view: EditorView) => void) => {
        const get = getEditor;
        if (!get) return;
        const editor = get();
        if (!editor) return;
        editor.action((ctx: any) => {
            const view = ctx.get(editorViewCtx) as EditorView;
            if (!view) return;
            runner(view);
            view.focus();
        });
    };

    const toggle = (markName: string) =>
        run(view => {
            const { state, dispatch } = view;
            const mark = state.schema.marks[markName];
            if (mark) toggleMark(mark)(state, dispatch);
        });

    const setHeading = (level: 1 | 2 | 3) =>
        run(view => {
            const { state, dispatch } = view;
            const node = state.schema.nodes.heading;
            if (node) setBlockType(node, { level })(state, dispatch);
        });

    const wrapNode = (nodeName: string) =>
        run(view => {
            const { state, dispatch } = view;
            const node = state.schema.nodes[nodeName];
            if (node) wrapIn(node)(state, dispatch);
        });

    const toggleTaskList = () => wrapNode("task_list");

    const insertTable = () =>
        run(view => {
            const { state, dispatch } = view;
            const table = state.schema.nodes.table;
            const row = state.schema.nodes.table_row;
            const cell = state.schema.nodes.table_cell;
            if (!table || !row || !cell) return;
            const rowNode = row.create(null, [cell.create(), cell.create(), cell.create()]);
            const tableNode = table.create(null, [
                rowNode,
                rowNode.copy(rowNode.content),
                rowNode.copy(rowNode.content),
            ]);
            dispatch(state.tr.replaceSelectionWith(tableNode).scrollIntoView());
        });

    const insertHorizontalRule = () =>
        run(view => {
            const { state, dispatch } = view;
            const hr = state.schema.nodes.horizontal_rule;
            if (hr) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
        });

    const insertLink = () =>
        run(view => {
            const href = window.prompt("输入链接地址:");
            if (!href) return;
            const { state, dispatch } = view;
            const link = state.schema.marks.link;
            if (link) toggleMark(link, { href })(state, dispatch);
        });

    const insertImage = () =>
        run(view => {
            const src = window.prompt("输入图片地址:");
            if (!src) return;
            const { state, dispatch } = view;
            const image = state.schema.nodes.image;
            if (image) dispatch(state.tr.replaceSelectionWith(image.create({ src })).scrollIntoView());
        });

    const handleUndo = () => run(view => undo(view.state, view.dispatch));
    const handleRedo = () => run(view => redo(view.state, view.dispatch));

    return (
        <div className={styles.toolbar} aria-label="Milkdown toolbar">
            <button data-tooltip="撤销 (Ctrl+Z)" onClick={handleUndo} disabled={readonly}>
                <RiArrowGoBackLine />
            </button>
            <button data-tooltip="重做 (Ctrl+Y)" onClick={handleRedo} disabled={readonly}>
                <RiArrowGoForwardLine />
            </button>
            <div className={styles.separator} />

            <button data-tooltip="粗体 (Ctrl+B)" onClick={() => toggle("strong")} disabled={readonly}>
                <RiBold />
            </button>
            <button data-tooltip="斜体 (Ctrl+I)" onClick={() => toggle("em")} disabled={readonly}>
                <RiItalic />
            </button>
            <button data-tooltip="行内代码 (Ctrl+`)" onClick={() => toggle("code")} disabled={readonly}>
                <RiCodeLine />
            </button>
            <div className={styles.separator} />

            <button data-tooltip="标题1 (Ctrl+Alt+1)" onClick={() => setHeading(1)} disabled={readonly}>
                <RiH1 />
            </button>
            <button data-tooltip="标题2 (Ctrl+Alt+2)" onClick={() => setHeading(2)} disabled={readonly}>
                <RiH2 />
            </button>
            <button data-tooltip="标题3 (Ctrl+Alt+3)" onClick={() => setHeading(3)} disabled={readonly}>
                <RiH3 />
            </button>
            <div className={styles.separator} />

            <button data-tooltip="无序列表 (Ctrl+Shift+8)" onClick={() => wrapNode("bullet_list")} disabled={readonly}>
                <RiListUnordered />
            </button>
            <button data-tooltip="有序列表 (Ctrl+Shift+7)" onClick={() => wrapNode("ordered_list")} disabled={readonly}>
                <RiListOrdered />
            </button>
            <button data-tooltip="引用 (Ctrl+Shift+B)" onClick={() => wrapNode("blockquote")} disabled={readonly}>
                <RiDoubleQuotesL />
            </button>
            <button data-tooltip="任务列表" onClick={toggleTaskList} disabled={readonly}>
                <RiCheckboxLine />
            </button>
            <button data-tooltip="插入表格" onClick={insertTable} disabled={readonly}>
                <RiTable2 />
            </button>
            <div className={styles.separator} />

            <button data-tooltip="分隔线 (---)" onClick={insertHorizontalRule} disabled={readonly}>
                <RiSeparator />
            </button>
            <button data-tooltip="插入链接 (Ctrl+K)" onClick={insertLink} disabled={readonly}>
                <RiLinkM />
            </button>
            <button data-tooltip="插入图片" onClick={insertImage} disabled={readonly}>
                <RiImageLine />
            </button>
        </div>
    );
};

export default MilkdownToolbar;
