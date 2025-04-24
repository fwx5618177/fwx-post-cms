/**
 * 菜单项配置类型
 */
export type MenuItem = {
    key: string;
    icon?: React.ReactNode;
    label: string;
    children?: MenuItem[];
};

/**
 * 菜单项配置
 */
export type MenuItems = MenuItem[];
