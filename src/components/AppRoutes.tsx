import React, { Suspense, ComponentType, useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "@config/routes.conf";
import { IRoutePage } from "@config/IRoute";
import { RouteObject } from "react-router-dom";
import Loading from "./Loading";
import { Pages } from "@config/pageLazyLoad";

const { ErrorBoundary } = Pages;

/**
 * 懒加载组件包装器
 */
const LazyWrapper: React.FC<{ component: ComponentType | React.LazyExoticComponent<any> }> = ({
    component: Component,
}) => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<Loading type="spinner" size="md" />}>
                <Component />
            </Suspense>
        </ErrorBoundary>
    );
};

/**
 * 转换路由配置为 useRoutes 可用的格式
 * @description 移除菜单相关属性，保留路由必要属性，并添加错误处理
 */
const transformRoutes = (routes: IRoutePage[]): RouteObject[] => {
    return routes.map(route => {
        const { component: Component, path } = route;

        // 构建路由对象，只保留必要的属性
        const transformedRoute: RouteObject = {
            path,
            element: Component ? <LazyWrapper component={Component} /> : undefined,
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
 * @description 使用 useRoutes 处理路由渲染，包含错误处理和加载状态
 */
const AppRoutes = () => {
    // 使用 useMemo 缓存转换后的路由配置
    const transformedRoutes = useMemo(() => transformRoutes(routes), []);
    const element = useRoutes(transformedRoutes);

    return <ErrorBoundary>{element}</ErrorBoundary>;
};

export default React.memo(AppRoutes);
