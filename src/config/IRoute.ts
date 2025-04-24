import { LazyExoticComponent, ComponentType } from "react";
import { IconType } from "react-icons";

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
}
