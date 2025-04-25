import React, { useState, useCallback } from "react";
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

interface FlatMenuItem extends MenuItem {
    level: number;
    parentKey: string;
}

/**
 * 仪表盘布局组件
 * @description 提供统一的仪表盘布局，包括侧边栏、顶部栏和内容区域
 */
const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    // 获取扁平化的菜单项
    const flatMenuItems = React.useMemo(() => {
        const flatten = (items: MenuItem[], level = 0, parentKey = ""): FlatMenuItem[] => {
            return items.reduce((acc: FlatMenuItem[], item) => {
                const flatItem: FlatMenuItem = {
                    ...item,
                    level,
                    parentKey,
                };
                acc.push(flatItem);
                if (item.children?.length) {
                    acc.push(...flatten(item.children, level + 1, item.key));
                }
                return acc;
            }, []);
        };
        return flatten(getMenuItems(routes));
    }, []);

    // 初始化选中状态
    React.useEffect(() => {
        const matchingItem = flatMenuItems.find(item => item.path === location.pathname);
        if (matchingItem) {
            setSelectedKey(matchingItem.key);
            // 展开所有父级菜单
            let currentItem = matchingItem;
            const parentKeys: string[] = [];
            while (currentItem.parentKey) {
                parentKeys.push(currentItem.parentKey);
                currentItem = flatMenuItems.find(item => item.key === currentItem.parentKey) as FlatMenuItem;
            }
            setOpenKeys(prev => [...new Set([...prev, ...parentKeys])]);
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
                navigate(item.path);
            }
        },
        [navigate, flatMenuItems],
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
        const shouldShow = !collapsed || item.level === 0;

        if (!shouldShow) return null;

        const isVisible = item.level === 0 || item.parentKey === "" || openKeys.includes(item.parentKey);
        if (!isVisible) return null;

        return (
            <div key={item.key} className={`${styles.menuItem} ${styles[`level${item.level}`]}`}>
                <button
                    className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
                    onClick={() => handleMenuClick(item)}
                >
                    <span className={styles.icon}>{item.icon}</span>
                    <div className={styles.menuContent}>
                        <span>{item.label}</span>
                        {hasChildren && (
                            <RiArrowDownSLine className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`} />
                        )}
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
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
