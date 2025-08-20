import { forwardRef } from "react";
import { MilkdownProvider } from "@milkdown/react";
import Editor from "./Editor";
import { EditorProps, EditorRefMethods } from "./types";
import Toolbar from "./Toolbar";

/**
 * Milkdown编辑器包装组件
 *
 * 提供MilkdownProvider上下文并转发所有属性到Editor组件
 */
const Milkdown = forwardRef<EditorRefMethods, EditorProps>((props, ref) => {
    return (
        <MilkdownProvider>
            {/* 自定义 Toolbar 替代 Crepe 默认 */}
            <Toolbar getEditor={() => (ref as any)?.current?.getEditor?.()} readonly={props.readonly} />
            <Editor ref={ref} {...props} />
        </MilkdownProvider>
    );
});

// 设置组件显示名称，便于调试
Milkdown.displayName = "Milkdown";

export default Milkdown;
