import { forwardRef } from "react";
import { MilkdownProvider } from "@milkdown/react";
import Editor from "./Editor";
import { EditorProps, EditorRefMethods } from "./types";

/**
 * Milkdown编辑器包装组件
 *
 * 提供MilkdownProvider上下文并转发所有属性到Editor组件
 */
const Milkdown = forwardRef<EditorRefMethods, EditorProps>((props, ref) => {
    return (
        <MilkdownProvider>
            <Editor ref={ref} {...props} />
        </MilkdownProvider>
    );
});

// 设置组件显示名称，便于调试
Milkdown.displayName = "Milkdown";

export default Milkdown;
