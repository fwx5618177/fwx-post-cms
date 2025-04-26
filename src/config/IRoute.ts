import { LazyExoticComponent, ComponentType } from "react";
import { IconType } from "react-icons";

/**
 * 菜单标记类型
 */
export type BadgeType = "primary" | "success" | "warning" | "error" | "info";

/**
 * 菜单标记配置
 */
export interface IMenuBadge {
    /** 标记类型 */
    type: BadgeType;
    /** 标记显示的内容 */
    count?: number;
    /** 是否显示点状标记 */
    dot?: boolean;
}

/**
 * 菜单标签配置
 */
export interface IMenuTag {
    /** 标签类型 */
    type: BadgeType;
    /** 标签显示的文本内容 */
    text: string;
}

/**
 * 路由页面配置
 * @description 用于定义路由的菜单、路径、组件等信息
 */
export interface IRoutePage {
    /** 路由唯一标识 */
    key: string;
    /** 菜单显示名称 */
    label: string;
    /** 菜单图标 */
    icon?: IconType;
    /** 路由路径 */
    path: string;
    /** 路由组件 */
    component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
    /** 子路由 */
    children?: IRoutePage[];
    /** 是否在菜单中显示 */
    menuShow?: boolean;
    /** 是否需要认证 */
    auth?: boolean;
    /** 是否为索引路由 */
    index?: false;
    /** 菜单标记 */
    badge?: IMenuBadge;
    /** 菜单标签 */
    tag?: IMenuTag;
}
