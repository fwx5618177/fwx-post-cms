import React, { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    RiMenuFoldLine,
    RiMenuUnfoldLine,
    RiLogoutBoxLine,
    RiPushpinLine,
    RiPushpin2Line,
    RiArrowDownSLine,
    RiDashboardLine,
} from "react-icons/ri";
import styles from "@styles/layouts/dashboard.module.scss";
import { getMenuItems } from "@config/menu.conf";
import { routes } from "@config/routes.conf";
import { MenuItem } from "@config/IMenu";
import { IMenuBadge, IMenuTag } from "@config/IRoute";
import { TabsProvider, useTabsContext } from "../context/TabsContext";
import TabsBar from "../components/TabsBar";

interface FlatMenuItem extends MenuItem {
    level: number;
    parentKey: string;
    path: string;
}

/**
 * 徽章组件
 */
const MenuBadge: React.FC<{ badge: IMenuBadge }> = ({ badge }) => {
    const badgeClass = `${styles.badge} ${styles[`badge${badge.type.charAt(0).toUpperCase() + badge.type.slice(1)}`]}`;

    if (badge.dot) {
        return <span className={`${badgeClass} ${styles.badgeDot}`} />;
    }

    return <span className={badgeClass}>{badge.count}</span>;
};

/**
 * 标签组件
 */
const MenuTag: React.FC<{ tag: IMenuTag }> = ({ tag }) => {
    const tagClass = `${styles.tag} ${styles[`tag${tag.type.charAt(0).toUpperCase() + tag.type.slice(1)}`]}`;

    return <span className={tagClass}>{tag.text}</span>;
};

/**
 * 内部仪表盘布局组件
 */
const DashboardLayoutInner: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const { addTab } = useTabsContext();

    // 获取扁平化的菜单项
    const flatMenuItems = React.useMemo(() => {
        const flatten = (items: MenuItem[], level = 0, parentKey = ""): FlatMenuItem[] => {
            return items.reduce((acc: FlatMenuItem[], item) => {
                if (item.path) {
                    // 只处理有path的菜单项
                    const flatItem: FlatMenuItem = {
                        ...item,
                        level,
                        parentKey,
                        path: item.path, // 确保path字段存在
                    };
                    acc.push(flatItem);
                    if (item.children?.length) {
                        acc.push(...flatten(item.children, level + 1, item.key));
                    }
                }
                return acc;
            }, []);
        };
        return flatten(getMenuItems(routes));
    }, []);

    // 当访问根路径时，重定向到仪表盘页面
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dashboard");
        }
    }, [location.pathname, navigate]);

    // 分拆useEffect：处理URL变化时的菜单项匹配
    useEffect(() => {
        // 找到与当前路径匹配的菜单项
        const matchingItem = flatMenuItems.find(item => item.path === location.pathname);
        if (!matchingItem) return;

        // 更新选中的菜单项
        if (selectedKey !== matchingItem.key) {
            setSelectedKey(matchingItem.key);
        }
    }, [location.pathname, flatMenuItems, selectedKey]);

    // 分拆useEffect：处理URL变化时的标签添加
    useEffect(() => {
        // 找到与当前路径匹配的菜单项
        const matchingItem = flatMenuItems.find(item => item.path === location.pathname);
        if (!matchingItem) return;

        // 处理仪表盘路径的特殊情况，避免重复添加
        if (matchingItem.key === "dashboard-content" && location.pathname === "/dashboard") {
            // 使用全局定义的dashboard key而不是dashboard-content
            addTab({
                key: "dashboard", // 与初始状态一致的key
                title: matchingItem.label,
                path: matchingItem.path,
                icon: matchingItem.icon,
                closable: false,
            });
        } else {
            // 添加标签页
            addTab({
                key: matchingItem.key,
                title: matchingItem.label,
                path: matchingItem.path,
                icon: matchingItem.icon,
                closable: matchingItem.key !== "dashboard-content", // 仪表盘不可关闭
            });
        }
    }, [location.pathname, flatMenuItems, addTab]);

    // 分拆useEffect：处理URL变化时的父级菜单展开
    useEffect(() => {
        // 找到与当前路径匹配的菜单项
        const matchingItem = flatMenuItems.find(item => item.path === location.pathname);
        if (!matchingItem) return;

        // 展开所有父级菜单，使用函数式更新避免依赖循环
        let currentItem = matchingItem;
        const parentKeys: string[] = [];

        while (currentItem.parentKey) {
            parentKeys.push(currentItem.parentKey);
            const parent = flatMenuItems.find(item => item.key === currentItem.parentKey);
            if (!parent) break;
            currentItem = parent as FlatMenuItem;
        }

        // 只在有新的父级菜单需要展开时更新
        if (parentKeys.length > 0) {
            setOpenKeys(prev => {
                // 将新的父级菜单与当前展开的菜单合并，去重
                const newKeys = [...new Set([...prev, ...parentKeys])];

                // 如果没有变化，返回原数组避免重渲染
                if (newKeys.length === prev.length && newKeys.every(key => prev.includes(key))) {
                    return prev;
                }

                return newKeys;
            });
        }
    }, [location.pathname, flatMenuItems]);

    // 处理菜单点击
    const handleMenuClick = useCallback(
        (item: FlatMenuItem) => {
            if (item.children?.length) {
                setOpenKeys(prev => {
                    const isOpen = prev.includes(item.key);
                    if (isOpen) {
                        // 关闭当前菜单及其所有子菜单
                        return prev.filter(key => !key.startsWith(item.key));
                    } else {
                        // 如果是顶级菜单，关闭其他顶级菜单
                        if (item.level === 0) {
                            const otherTopLevelKeys = flatMenuItems
                                .filter(i => i.level === 0 && i.key !== item.key)
                                .map(i => i.key);
                            const newKeys = prev.filter(
                                key => !otherTopLevelKeys.some(topKey => key === topKey || key.startsWith(topKey)),
                            );
                            return [...newKeys, item.key];
                        }
                        return [...prev, item.key];
                    }
                });
            } else if (item.path) {
                setSelectedKey(item.key);

                // 添加标签页 - 仪表盘路径特殊处理
                if (item.key === "dashboard-content" && item.path === "/dashboard") {
                    // 使用全局定义的dashboard key
                    addTab({
                        key: "dashboard", // 与初始状态一致的key
                        title: item.label,
                        path: item.path,
                        icon: item.icon,
                        closable: false,
                    });
                } else {
                    addTab({
                        key: item.key,
                        title: item.label,
                        path: item.path,
                        icon: item.icon,
                        closable: item.key !== "dashboard-content", // 仪表盘不可关闭
                    });
                }

                navigate(item.path);
            }
        },
        [navigate, flatMenuItems, addTab],
    );

    // 处理折叠按钮点击
    const handleCollapse = () => {
        setCollapsed(!collapsed);
        setPinned(false);
    };

    // 处理图钉按钮点击
    const handlePin = () => {
        setPinned(!pinned);
        if (!pinned) {
            setCollapsed(true);
        }
    };

    // 渲染菜单项
    const renderMenuItem = (item: FlatMenuItem) => {
        const isOpen = openKeys.includes(item.key);
        const isActive = selectedKey === item.key;
        const hasChildren = item.children && item.children.length > 0;

        // 在这里不再阻止渲染子菜单，只是在展示时使用CSS隐藏
        const isVisible = item.level === 0 || item.parentKey === "" || openKeys.includes(item.parentKey);
        if (!isVisible) return null;

        const showText = !collapsed || (collapsed && item.level === 0);

        return (
            <div key={item.key} className={`${styles.menuItem} ${styles[`level${item.level}`]}`}>
                <button
                    className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
                    onClick={() => handleMenuClick(item)}
                >
                    <span className={styles.icon}>{item.icon}</span>

                    {/* 使用css控制内容显示而非条件渲染 */}
                    <div className={styles.menuContent}>
                        <span>{item.label}</span>
                        <div className={styles.menuExtra}>
                            {item.badge && <MenuBadge badge={item.badge} />}
                            {showText && item.tag && <MenuTag tag={item.tag} />}
                            {hasChildren && showText && (
                                <RiArrowDownSLine className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`} />
                            )}
                        </div>
                    </div>
                </button>
            </div>
        );
    };

    return (
        <div
            className={`${styles.dashboardLayout} ${collapsed ? styles.collapsed : ""} ${pinned ? styles.pinned : ""}`}
        >
            <aside className={`${styles.sider} ${collapsed ? styles.collapsed : ""} ${pinned ? styles.pinned : ""}`}>
                <div className={styles.logo}>
                    <RiDashboardLine className={styles.logoIcon} />
                    <h1>CMS System</h1>
                </div>
                <nav className={styles.menu}>{flatMenuItems.map(item => renderMenuItem(item))}</nav>
                <div className={styles.menuControls}>
                    <button className={styles.controlButton} onClick={handleCollapse}>
                        {collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
                    </button>
                    <button className={`${styles.controlButton} ${pinned ? styles.active : ""}`} onClick={handlePin}>
                        {pinned ? <RiPushpin2Line /> : <RiPushpinLine />}
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.trigger} onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
                    </button>
                    <div className={styles.headerRight}>
                        <button className={styles.logoutButton} onClick={() => navigate("/login")}>
                            <RiLogoutBoxLine />
                            <span>退出登录</span>
                        </button>
                    </div>
                </header>

                <TabsBar />

                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

/**
 * 仪表盘布局组件
 * @description 提供统一的仪表盘布局，包括侧边栏、顶部栏和内容区域
 */
const DashboardLayout = () => {
    return (
        <TabsProvider>
            <DashboardLayoutInner />
        </TabsProvider>
    );
};

export default DashboardLayout;
