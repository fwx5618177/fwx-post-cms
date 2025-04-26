import { ReactNode } from "react";
import { IMenuBadge, IMenuTag } from "./IRoute";

/**
 * 菜单项配置类型
 */
export interface MenuItem {
    key: string;
    icon?: ReactNode;
    label: string;
    path?: string;
    children?: MenuItem[];
    /** 菜单标记 */
    badge?: IMenuBadge;
    /** 菜单标签 */
    tag?: IMenuTag;
}

/**
 * 菜单项配置
 */
export type MenuItems = MenuItem[];
