import { RoutesConfI, RoutesPageI } from './interface'
import { lazy } from 'react'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { errorRoutes, menuConf } from './routes.conf'
import { Navigate, Outlet, Route } from 'react-router-dom'

/**
 * @description 字符串转懒加载
 */
const transferLazyLoad = (components: string): React.LazyExoticComponent<() => JSX.Element> => {
    return lazy(() => import(/* @vite-ignore */ components))
}

/**
 * @description 懒加载转组件
 */
const transferComponent = (Com: React.LazyExoticComponent<() => JSX.Element>): JSX.Element => {
    return <Com />
}

/**
 * @description 页面的配置表
 */
export const routesConfiguration = (routes: RoutesPageI[]): RoutesPageI[] => {
    const conf: RoutesPageI[] = routes

    return conf
}

/**
 * @description 错误页面处理
 */
export const errorHanlde = (errorRoutes: RoutesPageI[]): RoutesPageI[] => {
    const conf: RoutesPageI[] = errorRoutes
    return conf
}

/**
 * @description 菜单展示菜单栏
 */
export const queryMenus = (menuConf: RoutesPageI[]): ItemType[] => {
    return routesConfiguration(menuConf)?.map(ci => {
        if (ci?.children && ci?.children.length > 0 && Array.isArray(ci?.children)) {
            return {
                key: ci?.key as string,
                icon: ci?.icon,
                label: ci?.label,
                children: queryMenus(ci?.children),
                theme: ci?.theme,
            }
        } else {
            return {
                key: ci?.key as string,
                icon: ci?.icon,
                label: ci?.label,
                theme: ci?.theme,
            }
        }
    })
}

/**
 * @description 菜单栏展示控制器
 */
export const menusController = () => queryMenus(menuConf)

/**
 * @description 路由表内容
 */
export const queryRoutes = (menuConf: RoutesPageI[], deep = 0): RoutesConfI[] => {
    return menuConf?.map(ci => {
        if (ci?.children && ci?.children.length > 0 && Array.isArray(ci?.children)) {
            // const defaultIndex = ci?.children?.filter(ci => !!ci?.index)
            // if (defaultIndex && Array.isArray(defaultIndex) && defaultIndex.length === 0) {
            //     return {
            //         index: ci?.index ?? false,
            //         path: ci?.path as string,
            //         element: <Navigate to={ci?.children[0]?.key as string} />,
            //         caseSensitive: ci?.caseSensitive ?? false,
            //         children: [],
            //     }
            // }

            const result: RoutesConfI[] = queryRoutes(ci?.children, deep + 1)
            return {
                index: ci?.index ?? false,
                path: ci?.path as string,
                element: ci?.outlet ? <Outlet /> : transferComponent(transferLazyLoad(ci?.components as string)),
                caseSensitive: ci?.caseSensitive ?? false,
                children: result,
            }
        } else {
            return {
                index: ci?.index ?? false,
                path: ci?.path as string,
                element: ci?.outlet ? <Outlet /> : transferComponent(transferLazyLoad(ci?.components as string)),
                caseSensitive: ci?.caseSensitive ?? false,
                children: [],
            }
        }
    }) as unknown as RoutesConfI[]
}

/**
 * @description 路由表加上额外处理
 */
export const extraRoutesHandle = (): RoutesConfI[] => {
    const conf = errorHanlde(errorRoutes)?.map(ci => ({
        index: (ci?.index as boolean) ?? false,
        path: ci?.path as string,
        element: transferComponent(transferLazyLoad(ci?.components as string)),
        caseSensitive: ci?.caseSensitive ?? false,
        children: [],
    }))

    const result = [...queryRoutes(menuConf), ...conf]

    return result
}

/**
 * 渲染路由
 */
export const routesConf = (conf: RoutesConfI[]) => {
    return conf?.map((ci, index) => {
        if (ci?.children && Array.isArray(ci?.children) && ci?.children.length > 0) {
            return (
                <>
                    <Route key={index + '_routes_parent'} caseSensitive={ci?.caseSensitive} path={ci?.path} element={ci?.element}>
                        {routesConf(ci?.children)}
                    </Route>
                </>
            )
        } else {
            return <Route key={index + '_routes_child'} caseSensitive={ci?.caseSensitive} index={ci?.index} path={ci?.index ? '' : ci?.path} element={ci?.element} />
        }
    })
}

export const test = () => {
    console.log(routesConf(extraRoutesHandle()))
}
