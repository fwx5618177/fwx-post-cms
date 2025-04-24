import { useRoutes } from "react-router-dom";
import { routes } from "@config/routes.conf";
import { IRoutePage } from "@config/IRoute";
import { RouteObject } from "react-router-dom";
import { Suspense, useMemo } from "react";
import Loading from "./Loading";

/**
 * 转换路由配置为 useRoutes 可用的格式
 * @description 移除菜单相关属性，保留路由必要属性
 */
const transformRoutes = (routes: IRoutePage[]): RouteObject[] => {
    return routes.map(route => {
        const Component = route.component;
        // 构建路由对象，只保留必要的属性
        const transformedRoute: RouteObject = {
            path: route.path,
            element: (
                <Suspense fallback={<Loading type="spinner" size="md" />}>
                    <Component />
                </Suspense>
            ),
        };

        // 处理子路由
        if (route.children?.length) {
            transformedRoute.children = transformRoutes(route.children);
        }

        return transformedRoute;
    });
};

/**
 * 应用路由组件
 * @description 使用 useRoutes 处理路由渲染
 */
const AppRoutes = () => {
    const transformedRoutes = useMemo(() => transformRoutes(routes), []);
    const element = useRoutes(transformedRoutes);
    return element;
};

export default AppRoutes;
