import { IRoutePage } from "./IRoute";
import { MenuItem } from "./IMenu";

/**
 * 获取菜单项配置
 * @description 从路由配置中提取菜单项
 */
export const getMenuItems = (routes: IRoutePage[]): MenuItem[] => {
    return routes
        .filter(route => route.menuShow)
        .map(route => {
            const menuItem: MenuItem = {
                key: route.path,
                icon: route.icon ? <route.icon /> : undefined,
                label: route.label,
            };

            // 只处理有子路由且子路由需要显示的情况
            if (route.children?.length) {
                const children = route.children
                    .filter(child => child.menuShow)
                    .map(child => ({
                        key: child.path,
                        label: child.label,
                    }));

                if (children.length > 0) {
                    menuItem.children = children;
                }
            }

            return menuItem;
        });
};
