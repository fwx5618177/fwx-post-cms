import { Ref } from "react";

/**
 * Dropdown 组件尺寸类型
 * - small: 小尺寸
 * - medium: 中等尺寸
 * - large: 大尺寸
 */
export type DropdownSize = "small" | "medium" | "large";

/**
 * Dropdown 弹出方向类型
 * 支持 8 个方向
 */
export type DropdownPlacement =
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "right";

// Dropdown 菜单项类型
export interface DropdownItem {
    /** 唯一值 */
    key: string | number;
    /** 显示内容 */
    label: React.ReactNode;
    /** 是否禁用 */
    disabled?: boolean;
    /** 左侧图标 */
    icon?: React.ReactNode;
    /** 右侧快捷键提示 */
    shortcut?: React.ReactNode;
    /** 子菜单 */
    children?: DropdownItem[];
}

// Dropdown 分组类型
export interface DropdownGroup {
    /** 分组标题 */
    label: React.ReactNode;
    /** 分组下的菜单项 */
    items: DropdownItem[];
}

// Dropdown 分割线类型
export interface DropdownDivider {
    /** 固定为 divider */
    type: "divider";
    /** 可选唯一 key */
    key?: string | number;
}

// Dropdown 支持的菜单结构
export type DropdownMenuItem = DropdownItem | DropdownGroup | DropdownDivider;

/**
 * Dropdown 组件 props 类型
 * 支持弹出位置、尺寸、分组、分割线、多级菜单、快捷键、动态加载、动画、右键菜单等
 */
export interface DropdownProps {
    /**
     * 是否可见
     */
    open: boolean;
    /**
     * 依附的锚点元素（优先级高于 position）。
     * 若 anchorEl 存在，则 placement 决定弹出方向，Dropdown 会自动根据 anchorEl+placement 计算位置。
     * 若同时传入 position，则 position 生效，anchorEl/placement 被覆盖（即 position 优先级最高）。
     * 典型用法：按钮、输入框等元素的下拉菜单。
     */
    anchorEl?: HTMLElement | null;
    /**
     * 绝对定位坐标（如 contextMenu）。
     * 若传入 position，则 anchorEl/placement 均不生效，直接用 position 定位。
     * 典型用法：右键菜单、全局弹出。
     */
    position?: { x: number; y: number };
    /**
     * 菜单项/分组/分割线列表。
     * 支持 DropdownListItem、DropdownGroup、DropdownDivider、嵌套多级菜单。
     */
    items: DropdownMenuItem[];
    /**
     * 选中回调。
     * 仅对 DropdownListItem 有效。
     */
    onSelect?: (item: DropdownItem) => void;
    /**
     * 关闭回调。
     * Dropdown 关闭时触发。
     */
    onClose?: () => void;
    /**
     * 尺寸。
     * small/medium/large。
     */
    size?: DropdownSize;
    /**
     * 最大高度。
     */
    maxHeight?: number | string;
    /**
     * 自定义 className。
     */
    className?: string;
    /**
     * 自定义 style。
     */
    style?: React.CSSProperties;
    /**
     * ref 透传。
     */
    dropdownRef?: Ref<HTMLDivElement>;
    /**
     * 弹出方向。
     * 仅在 anchorEl 存在时生效，决定下拉菜单相对 anchorEl 的方向。
     * 若传入 position，则 placement 不生效。
     */
    placement?: DropdownPlacement;
    /**
     * 是否自动聚焦。
     * 弹出后自动 focus 到下拉框。
     */
    autoFocus?: boolean;
    /**
     * 是否显示箭头。
     */
    showArrow?: boolean;
    /**
     * 隐藏时是否销毁内容。
     * true 时关闭后 DOM 彻底移除，false 时仅隐藏。
     * destroyPopupOnHide=true 时，关闭动画结束后销毁内容。
     */
    destroyPopupOnHide?: boolean;
    /**
     * 自定义动画 className。
     * 若传入 animation，则覆盖默认的 fadeIn/fadeOut 动画。
     */
    animation?: string;
    /**
     * 菜单类型（普通下拉/右键菜单）。
     * contextMenu 时样式更紧凑、圆角更小、阴影更深。
     */
    menuType?: "dropdown" | "contextMenu";
}
