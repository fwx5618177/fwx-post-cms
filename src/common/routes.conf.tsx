import { HomeOutlined, CarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { RoutesPageI } from "./interface";
import {
    WindowStack,
    Images,
    MenuButtonFill,
    Puzzle,
    Journal,
    CardChecklist,
    FileEarmarkCheck,
    FileRichtext,
    EggFill,
    Box2,
    Robot,
} from "react-bootstrap-icons";

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
        key: "layout",
        icon: <Images />,
        label: <Link to={"/"}>layoutBg</Link>,
        components: import("../components/Layout"),
        path: "/",
        menuShow: false,
        children: [
            {
                key: "/",
                icon: <HomeOutlined />,
                label: <Link to={"/"}>defaultMain</Link>,
                components: import("../components/main/index"),
                path: "/",
                index: true,
                children: [],
            },
            {
                key: "dashboard",
                icon: <WindowStack />,
                label: "defaultOps",
                outlet: true,
                path: "dashboard",
                children: [
                    {
                        key: "sidemenu",
                        icon: <MenuButtonFill />,
                        label: <Link to={"/dashboard/sidemenu"}>sidemenu</Link>,
                        components: import("../components/dashboard/sidemenu/index"),
                        // index: true,
                        path: "sidemenu",
                        children: [],
                    },
                    {
                        key: "menucontent",
                        icon: <Journal />,
                        label: <Link to={"/dashboard/menucontent"}>menucontent</Link>,
                        components: import("../components/dashboard/menucontent/index"),
                        // index: true,
                        path: "menucontent",
                        children: [],
                    },
                    {
                        key: "ossupload",
                        icon: <Journal />,
                        label: <Link to={"/dashboard/ossupload"}>ossupload</Link>,
                        components: import("../components/dashboard/ossupload/index"),
                        path: "ossupload",
                        children: [],
                    },
                ],
            },
            {
                key: "product",
                icon: <Puzzle />,
                label: "product",
                outlet: true,
                path: "product",
                children: [
                    {
                        key: "richeditor",
                        icon: <FileRichtext />,
                        label: <Link to={"/product/richeditor"}>richeditor</Link>,
                        components: import("../components/product/richeditor/index"),
                        path: "richeditor",
                        children: [],
                    },
                    {
                        key: "markdown",
                        icon: <FileRichtext />,
                        label: <Link to={"/product/markdown"}>markdown</Link>,
                        components: import("../components/product/markdown/index"),
                        path: "markdown",
                        children: [],
                    },
                ],
            },
            {
                key: "model",
                icon: <EggFill />,
                label: "Model",
                outlet: true,
                path: "model",
                children: [
                    {
                        key: "city",
                        icon: <Box2 />,
                        label: <Link to={"/model/city"}>model.city</Link>,
                        components: import("../components/model/city/index"),
                        path: "city",
                        children: [],
                    },
                    {
                        key: "robotcircle",
                        icon: <Robot />,
                        label: <Link to={"/model/robotcircle"}>model.robot</Link>,
                        components: import("../components/model/robot/index"),
                        path: "robotcircle",
                        children: [],
                    },
                    {
                        key: "island",
                        icon: <CarOutlined />,
                        label: <Link to={"/model/island"}>model.island</Link>,
                        components: import("../components/model/island/index"),
                        path: "island",
                        children: [],
                    },
                ],
            },

            {
                key: "todoist",
                icon: <CardChecklist />,
                label: "todoist",
                outlet: true,
                path: "todoist",
                children: [
                    {
                        key: "list",
                        icon: <FileEarmarkCheck />,
                        label: <Link to={"/todoist/list"}>todoist.list</Link>,
                        components: import("../components/list/index"),
                        path: "list",
                        children: [],
                    },
                ],
            },

            {
                key: "sourcelook",
                icon: <CardChecklist />,
                label: "sourcelook",
                outlet: true,
                path: "sourcelook",
                children: [
                    {
                        key: "richtext",
                        icon: <FileEarmarkCheck />,
                        label: <Link to={"/sourcelook/richtext"}>sourcelook.richtext</Link>,
                        components: import("../components/sourcelook/richtext/index"),
                        path: "richtext",
                        children: [],
                    },
                    {
                        key: "sourcecode",
                        icon: <FileEarmarkCheck />,
                        label: <Link to={"/sourcelook/sourcecode"}>sourcelook.sourcecode</Link>,
                        components: import("../components/sourcelook/sourcecode/index"),
                        path: "sourcecode",
                        children: [],
                    },
                ],
            },
        ],
    },
];

/**
 * 路由的错误配置
 */
export const errorRoutes: RoutesPageI[] = [
    {
        key: "404",
        icon: "",
        path: "*",
        label: "404",
        components: import("../pages/404"),
    },
];
