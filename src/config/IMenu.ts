import { ReactNode } from "react";

/**
 * 菜单项配置类型
 */
export interface MenuItem {
    key: string;
    icon?: ReactNode;
    label: string;
    path?: string;
    children?: MenuItem[];
}

/**
 * 菜单项配置
 */
export type MenuItems = MenuItem[];
