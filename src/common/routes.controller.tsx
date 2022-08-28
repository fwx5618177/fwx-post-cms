import { RoutesConfI, RoutesPageI, RouteTableI } from '../common/interface'
import { lazy } from 'react'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { errorRoutes, menuConf } from './routes.conf'
import { Outlet, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { Sunrise } from 'react-bootstrap-icons'

/**
 * @description 字符串转懒加载
 */
const transferLazyLoad = (components: string): React.LazyExoticComponent<() => JSX.Element> => {
    return lazy(
        () =>
            import(/* @vite-ignore */ components).then(m => ({
                default: m.ProjectDocumentsScreen,
            })),
        // import.meta.globEager(/* @vite-ignore */ components),
    )
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
    return routes?.map(ci => {
        if (ci && Array.isArray(ci) && ci.length > 0) {
            return {
                ...ci,
                children: routesConfiguration(ci?.children as RoutesPageI[]),
                menuShow: ci?.menuShow === false ? ci?.menuShow : true,
            }
        } else {
            return {
                ...ci,
                menuShow: ci?.menuShow === false ? ci?.menuShow : true,
            }
        }
    })
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
export const queryMenus = (menuConf: RoutesPageI[], t): ItemType[] => {
    return routesConfiguration(menuConf)
        ?.map(ci => {
            // 替换文本
            let label
            // console.log(typeof ci?.label)

            if (typeof ci?.label === 'string') {
                label = t(ci?.label)
            } else {
                // console.log('ci?.label:', ci?.label?.props)

                label = {
                    ...ci?.label,
                    props: {
                        ...ci?.label?.props,
                        children: t(ci?.label?.props?.children),
                    },
                }
            }

            if (ci?.children && ci?.children.length > 0 && Array.isArray(ci?.children)) {
                if (!!ci?.menuShow) {
                    return {
                        key: ci?.key as string,
                        icon: ci?.icon,
                        label: label,
                        children: queryMenus(ci?.children, t),
                        theme: ci?.theme,
                    }
                } else {
                    return queryMenus(ci?.children, t) as any
                }
            } else {
                return {
                    key: ci?.key as string,
                    icon: ci?.icon,
                    label: label,
                    theme: ci?.theme,
                }
            }
        })
        ?.flat()
}

/**
 * @description 菜单栏展示控制器
 */
export const menusController = () => {
    const { t } = useTranslation()
    const conf = queryMenus(menuConf, t)

    // console.log(conf)

    return conf
}

/**
 * @description 路由表内容
 */
export const queryRoutes = (menuConf: RoutesPageI[], deep = 0): RoutesConfI[] => {
    return menuConf?.map(ci => {
        if (ci?.children && ci?.children.length > 0 && Array.isArray(ci?.children)) {
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
export const routesConf = (conf: RoutesConfI[], deep = 0) => {
    return conf?.map((ci, index) => {
        if (ci?.children && Array.isArray(ci?.children) && ci?.children.length > 0) {
            return (
                <Route
                    key={index + '_routes_parent' + deep}
                    caseSensitive={ci?.caseSensitive}
                    path={ci?.path}
                    element={ci?.element}
                >
                    {routesConf(ci?.children, deep + 1)}
                </Route>
            )
        } else {
            return (
                <Route
                    key={index + '_routes_child_' + deep}
                    caseSensitive={ci?.caseSensitive}
                    index={ci?.index}
                    path={ci?.index ? '' : ci?.path}
                    element={ci?.element}
                />
            )
        }
    })
}

/**
 * 路由表生成
 */
export const routeTable = (): RouteTableI[] => {
    const queryRoutes = (menuConf: RoutesPageI[], deep = 0): RouteTableI[] => {
        return menuConf?.map(ci => {
            if (ci?.children && ci?.children.length > 0 && Array.isArray(ci?.children)) {
                return {
                    title:
                        typeof ci?.label === 'string' ? t(ci?.label) : t((ci?.label as JSX.Element)?.props?.children),
                    key: ci?.key as string,
                    icon: ci?.icon,
                    children: queryRoutes(ci?.children, deep + 1),
                }
            } else {
                return {
                    title:
                        typeof ci?.label === 'string' ? t(ci?.label) : t((ci?.label as JSX.Element)?.props?.children),
                    key: ci?.key as string,
                    icon: ci?.icon,
                    switcherIcon: <Sunrise />,
                    children: [],
                }
            }
        })
    }

    const data = queryRoutes([...menuConf, ...errorRoutes])

    return data
}

/**
 * 获取背景设置的函数
 */
export const bgLayoutSet = (): {
    label: string
    value: string | number
}[] => {
    return menuConf?.map(ci => ({
        label: t((ci?.label as JSX.Element)?.props?.children),
        value: ci?.key as string,
    }))
}

/**
 * 获取树的交集
 */
export const queryInterSection = () => {
    // const interSection = () => {}
}
