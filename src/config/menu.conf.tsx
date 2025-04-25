import { IRoutePage } from "./IRoute";
import { MenuItem } from "./IMenu";

/**
 * 递归处理路由配置，生成菜单项
 */
const processRouteToMenuItem = (route: IRoutePage, parentPath = ""): MenuItem => {
    // 构建完整路径
    const fullPath = parentPath
        ? route.path.startsWith("/")
            ? route.path
            : `${parentPath}/${route.path}`
        : route.path;

    const menuItem: MenuItem = {
        key: fullPath,
        icon: route.icon ? <route.icon /> : undefined,
        label: route.label,
        path: fullPath,
    };

    if (route.children?.length) {
        const children = route.children
            .filter(child => child.menuShow)
            .map(child => processRouteToMenuItem(child, fullPath));

        if (children.length > 0) {
            menuItem.children = children;
        }
    }

    return menuItem;
};

/**
 * 获取菜单项配置
 * @description 从路由配置中提取菜单项，支持多级菜单
 */
export const getMenuItems = (routes: IRoutePage[]): MenuItem[] => {
    return routes.filter(route => route.menuShow).map(route => processRouteToMenuItem(route));
};
