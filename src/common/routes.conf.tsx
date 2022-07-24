import { DashboardOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { RoutesPageI } from './interface'

/**
 * @description 路由-菜单的配置列表
 * @description {key, icon, label} 菜单栏
 * @description {components, path, index, caseSensitive, children} 路由菜单
 * @description {index, path} - index为false时,path生效 - TODO:增加排序
 * @description {outlet, components} - outlet 为true时, components不生效
 * @description {menuShow} - 主体背景设置。设置为false时,菜单展示中不显示
 */
export const menuConf: RoutesPageI[] = [
    {
        key: 'de',
        icon: <DashboardOutlined />,
        label: <Link to={'/'}>默认主页</Link>,
        components: '../pages/Layout.tsx',
        path: '/',
        menuShow: false,
        children: [
            {
                key: '/',
                icon: <DashboardOutlined />,
                label: <Link to={'/'}>默认主页</Link>,
                components: '../pages/main/index.tsx',
                path: '/',
                index: true,
                children: [],
            },
            {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: '默认操作台',
                outlet: true,
                path: 'dashboard',
                children: [
                    {
                        key: 'default',
                        icon: <DashboardOutlined />,
                        label: <Link to={'/dashboard/default'}>菜单</Link>,
                        components: '../pages/dashboard/default/index',
                        // index: true,
                        path: 'default',
                        children: [],
                    },
                ],
            },
        ],
    },
]

/**
 * 路由的错误配置
 */
export const errorRoutes: RoutesPageI[] = [
    {
        path: '*',
        components: '../error/404',
    },
]
