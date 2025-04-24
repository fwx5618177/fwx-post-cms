import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { RiMenuFoldLine, RiMenuUnfoldLine, RiLogoutBoxLine, RiPushpinLine, RiPushpin2Line } from "react-icons/ri";
import styles from "@styles/layouts/dashboard.module.scss";
import { getMenuItems } from "@config/menu.conf";
import { routes } from "@config/routes.conf";

/**
 * 仪表盘布局组件
 * @description 提供统一的仪表盘布局，包括侧边栏、顶部栏和内容区域
 */
const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [pinned, setPinned] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 获取菜单项
    const menuItems = React.useMemo(() => {
        return getMenuItems(routes);
    }, []);

    // 处理菜单点击
    const handleMenuClick = React.useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate],
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

    return (
        <div className={styles.dashboardLayout}>
            <aside className={`${styles.sider} ${collapsed ? styles.collapsed : ""} ${pinned ? styles.pinned : ""}`}>
                <div className={styles.logo}>
                    <h1>{collapsed ? "CMS" : "CMS System"}</h1>
                </div>
                <nav className={styles.menu}>
                    {menuItems.map(item => (
                        <div key={item.key} className={styles.menuItem}>
                            <button
                                className={`${styles.menuButton} ${
                                    location.pathname === item.key ? styles.active : ""
                                }`}
                                onClick={() => handleMenuClick(item.key)}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                            {item.children && !collapsed && (
                                <div className={styles.subMenu}>
                                    {item.children.map(child => (
                                        <button
                                            key={child.key}
                                            className={`${styles.subMenuItem} ${
                                                location.pathname === child.key ? styles.active : ""
                                            }`}
                                            onClick={() => handleMenuClick(child.key)}
                                        >
                                            {child.icon}
                                            <span>{child.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
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
