import { HomeOutlined, PieChartOutlined, TableOutlined, CarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { RoutesPageI } from './interface'
import {
    WindowStack,
    Images,
    MenuButtonFill,
    BoxArrowDownRight,
    Puzzle,
    Journal,
    Tornado,
    CardChecklist,
    FileEarmarkCheck,
    FileRichtext,
    EggFill,
    Box2,
    Robot,
} from 'react-bootstrap-icons'

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
        icon: <Images />,
        label: <Link to={'/'}>layoutBg</Link>,
        components: import('../pages/Layout'),
        path: '/',
        menuShow: false,
        children: [
            {
                key: '/',
                icon: <HomeOutlined />,
                label: <Link to={'/'}>defaultMain</Link>,
                components: import('../pages/main/index'),
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
                        icon: <MenuButtonFill />,
                        label: <Link to={'/dashboard/sidemenu'}>sidemenu</Link>,
                        components: import('../pages/dashboard/sidemenu/index'),
                        // index: true,
                        path: 'sidemenu',
                        children: [],
                    },
                    {
                        key: 'menucontent',
                        icon: <Journal />,
                        label: <Link to={'/dashboard/menucontent'}>menucontent</Link>,
                        components: import('../pages/dashboard/menucontent/index'),
                        // index: true,
                        path: 'menucontent',
                        children: [],
                    },
                    {
                        key: 'ossupload',
                        icon: <Journal />,
                        label: <Link to={'/dashboard/ossupload'}>ossupload</Link>,
                        components: import('../pages/dashboard/ossupload/index'),
                        path: 'ossupload',
                        children: [],
                    },
                ],
            },
            {
                key: 'charts',
                icon: <PieChartOutlined />,
                label: 'charts',
                outlet: true,
                path: 'charts',
                children: [
                    {
                        key: 's2table',
                        icon: <TableOutlined />,
                        label: <Link to={'/charts/s2table'}>charts.s2</Link>,
                        components: import('../pages/charts/s2table/index'),
                        path: 's2table',
                        children: [],
                    },
                    {
                        key: 'x6flow',
                        icon: <BoxArrowDownRight />,
                        label: <Link to={'/charts/x6flow'}>charts.x6</Link>,
                        components: import('../pages/charts/x6flow/index'),
                        path: 'x6flow',
                        children: [],
                    },
                    // {
                    //     key: 'l7',
                    //     icon: <Badge3d />,
                    //     label: <Link to={'/charts/l7'}>charts.l7</Link>,
                    //     components: '../pages/charts/l7/index',
                    //     path: 'l7',
                    //     children: [],
                    // },
                    // {
                    //     key: 'ava',
                    //     icon: <Box />,
                    //     label: <Link to={'/charts/ava'}>charts.ava</Link>,
                    //     components: '../pages/charts/ava/index',
                    //     path: 'ava',
                    //     children: [],
                    // },
                ],
            },

            {
                key: 'product',
                icon: <Puzzle />,
                label: 'product',
                outlet: true,
                path: 'product',
                children: [
                    {
                        key: 'kaboom',
                        icon: <Tornado />,
                        label: <Link to={'/product/kaboom'}>kaboom</Link>,
                        components: import('../pages/product/kaboom/index'),
                        path: 'kaboom',
                        children: [],
                    },
                    {
                        key: 'richeditor',
                        icon: <FileRichtext />,
                        label: <Link to={'/product/richeditor'}>richeditor</Link>,
                        components: import('../pages/product/richeditor/index'),
                        path: 'richeditor',
                        children: [],
                    },
                    {
                        key: 'markdown',
                        icon: <FileRichtext />,
                        label: <Link to={'/product/markdown'}>markdown</Link>,
                        components: import('../pages/product/markdown/index'),
                        path: 'markdown',
                        children: [],
                    },
                ],
            },
            {
                key: 'model',
                icon: <EggFill />,
                label: 'Model',
                outlet: true,
                path: 'model',
                children: [
                    {
                        key: 'city',
                        icon: <Box2 />,
                        label: <Link to={'/model/city'}>model.city</Link>,
                        components: import('../pages/model/city/index'),
                        path: 'city',
                        children: [],
                    },
                    {
                        key: 'robotcircle',
                        icon: <Robot />,
                        label: <Link to={'/model/robotcircle'}>model.robot</Link>,
                        components: import('../pages/model/robot/index'),
                        path: 'robotcircle',
                        children: [],
                    },
                    {
                        key: 'carcolor',
                        icon: <CarOutlined />,
                        label: <Link to={'/model/carcolor'}>model.carcolor</Link>,
                        components: import('../pages/model/carcolor/index'),
                        path: 'carcolor',
                        children: [],
                    },
                    {
                        key: 'island',
                        icon: <CarOutlined />,
                        label: <Link to={'/model/island'}>model.island</Link>,
                        components: import('../pages/model/island/index'),
                        path: 'island',
                        children: [],
                    },
                ],
            },

            {
                key: 'todoist',
                icon: <CardChecklist />,
                label: 'todoist',
                outlet: true,
                path: 'todoist',
                children: [
                    {
                        key: 'list',
                        icon: <FileEarmarkCheck />,
                        label: <Link to={'/todoist/list'}>todoist.list</Link>,
                        components: import('../pages/todoist/list/index'),
                        path: 'list',
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
        components: import('../error/404'),
    },
]
