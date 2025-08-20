import { RiCheckboxCircleLine, RiEditBoxLine } from "react-icons/ri";
import React from "react";

/**
 * 数据
 */
export interface SimpleNode {
    title: React.ReactNode;
    key: string;
    icon?: React.ReactNode;
    switcherIcon?: React.ReactNode;
    children?: SimpleNode[];
}

export const treeData: SimpleNode[] = [
    {
        title: "parent 1",
        key: "0-0",
        icon: <RiCheckboxCircleLine />,
        children: [
            {
                title: "parent 1-0",
                key: "0-0-0",
                icon: <RiCheckboxCircleLine />,
                children: [
                    { title: "leaf", key: "0-0-0-0", icon: <RiCheckboxCircleLine /> },
                    {
                        title: (
                            <>
                                <div>multiple line title</div>
                                <div>multiple line title</div>
                            </>
                        ),
                        key: "0-0-0-1",
                        icon: <RiCheckboxCircleLine />,
                    },
                    { title: "leaf", key: "0-0-0-2", icon: <RiCheckboxCircleLine /> },
                ],
            },
            {
                title: "parent 1-1",
                key: "0-0-1",
                icon: <RiCheckboxCircleLine />,
                children: [{ title: "leaf", key: "0-0-1-0", icon: <CarryOutOutlined /> }],
            },
            {
                title: "parent 1-2",
                key: "0-0-2",
                icon: <CarryOutOutlined />,
                children: [
                    { title: "leaf", key: "0-0-2-0", icon: <CarryOutOutlined /> },
                    {
                        title: "leaf",
                        key: "0-0-2-1",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },
                    {
                        title: "leaf",
                        key: "0-0-2-2",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },
                    {
                        title: "leaf",
                        key: "0-0-2-3",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },
                    {
                        title: "leaf",
                        key: "0-0-2-4",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },
                    {
                        title: "leaf",
                        key: "0-0-2-5",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },

                    {
                        title: "leaf",
                        key: "0-0-2-6",
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                    },
                ],
            },
        ],
    },
    {
        title: "parent 2",
        key: "0-1",
        icon: <CarryOutOutlined />,
        children: [
            {
                title: "parent 2-0",
                key: "0-1-0",
                icon: <RiCheckboxCircleLine />,
                children: [
                    { title: "leaf", key: "0-1-0-0", icon: <RiCheckboxCircleLine /> },
                    { title: "leaf", key: "0-1-0-1", icon: <RiCheckboxCircleLine /> },
                ],
            },
        ],
    },
];
