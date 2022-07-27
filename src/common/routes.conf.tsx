import { DashboardOutlined, HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { RoutesPageI } from './interface'
import { WindowStack } from 'react-bootstrap-icons'

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
        key: 'layout',
        icon: <DashboardOutlined />,
        label: <Link to={'/'}>背景</Link>,
        components: '../pages/Layout.tsx',
        path: '/',
        menuShow: false,
        children: [
            {
                key: '/',
                icon: <HomeOutlined />,
                label: <Link to={'/'}>defaultMain</Link>,
                components: '../pages/main/index.tsx',
                path: '/',
                index: true,
                children: [],
            },
            {
                key: 'dashboard',
                icon: <WindowStack />,
                label: 'defaultOps',
                outlet: true,
                path: 'dashboard',
                children: [
                    {
                        key: 'sidemenu',
                        icon: <DashboardOutlined />,
                        label: <Link to={'/dashboard/sidemenu'}>sidemenu</Link>,
                        components: '../pages/dashboard/sidemenu/index',
                        // index: true,
                        path: 'sidemenu',
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
        key: '404',
        icon: '',
        path: '*',
        label: '404',
        components: '../error/404',
    },
]
