import { LazyExoticComponent } from 'react'

/**
 *  页面的配置表
 */
export interface RoutesPageI {
    key?: string
    label?: string | JSX.Element
    icon?: string | JSX.Element
    itemIcon?: string | JSX.Element
    outlet?: boolean
    components?: string | LazyExoticComponent<React.FC<{}>>
    path?: string
    index?: boolean
    children?: RoutesPageI[]
    theme?: 'light' | 'dark'
    caseSensitive?: boolean
    menuShow?: boolean
    lazy?: boolean
}

/**
 * 路由表接口
 */
export interface RoutesConfI {
    index?: boolean
    path: string
    element: JSX.Element
    caseSensitive?: boolean
    children?: RoutesConfI[]
}

/**
 * 路由表结构
 */
export interface RouteTableI {
    title: string
    key: string
    icon: React.ReactNode
    switcherIcon?: React.ReactNode
    children?: RouteTableI[]
}
