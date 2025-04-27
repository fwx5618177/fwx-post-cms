import React, { useCallback, useState, useRef, useEffect } from "react";
import { useTabsContext } from "../context/TabsContext";
import { TabItem } from "../types/TabsState";
import {
    RiCloseLine,
    RiCloseCircleLine,
    RiMoreFill,
    RiPushpinFill,
    RiFullscreenLine,
    RiCloseFill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styles from "@styles/components/tabs-bar.module.scss";

const TabsBar: React.FC = () => {
    const { state, removeTab, removeOtherTabs, removeAllTabs, setActiveTab, updateTabClosability } = useTabsContext();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

    // 判断当前激活的标签是否可关闭
    const isActiveTabClosable = useCallback(() => {
        if (state.tabs.length <= 1) return false;
        if (!state.activeTab) return false;

        const activeTab = state.tabs.find(tab => tab.key === state.activeTab);
        return activeTab?.closable !== false;
    }, [state.tabs, state.activeTab]);

    // 当标签列表或活动标签变化时，更新标签的可关闭状态
    useEffect(() => {
        updateTabClosability();
    }, [state.tabs.length, state.activeTab, updateTabClosability]);

    const handleTabClick = useCallback(
        (tab: TabItem) => {
            if (state.activeTab !== tab.key) {
                setActiveTab(tab.key);
                navigate(tab.path);
            }
        },
        [setActiveTab, navigate, state.activeTab],
    );

    const handleRemoveTab = useCallback(
        (e: React.MouseEvent, key: string) => {
            e.stopPropagation(); // 阻止冒泡，避免触发tabClick

            // 查找要关闭的标签
            const tab = state.tabs.find(t => t.key === key);

            // 如果标签不存在或者明确标记为不可关闭，不进行关闭操作
            if (!tab || tab.closable === false) {
                return;
            }

            removeTab(key);
        },
        [removeTab, state.tabs],
    );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent, tab: TabItem) => {
            e.preventDefault(); // 阻止默认的右键菜单
            // 这里可以实现自定义右键菜单，但简化起见，我们只做一个简单的弹窗
            if (window.confirm("是否关闭其他标签页？")) {
                removeOtherTabs(tab.key);
            }
        },
        [removeOtherTabs],
    );

    const handleCloseAllTabs = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // 阻止冒泡
            if (state.tabs.length > 0 && window.confirm("确定要关闭所有标签页吗？")) {
                removeAllTabs();
            }
            setShowDropdown(false);
        },
        [removeAllTabs, state.tabs.length],
    );

    const handleToggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`无法进入全屏模式: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    const toggleDropdown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止冒泡
        setShowDropdown(prev => !prev);
    }, []);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showDropdown && // 只在下拉菜单打开时检查
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                moreButtonRef.current &&
                !moreButtonRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        // 添加点击事件监听
        document.addEventListener("mousedown", handleClickOutside);

        // 添加滚动事件监听，滚动时关闭下拉菜单
        const handleScroll = () => {
            if (showDropdown) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [showDropdown]); // 添加依赖项

    const handlePinCurrentTab = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // 阻止冒泡
            // 实现固定当前标签页的逻辑 - 通过将closable设置为false来实现
            if (state.activeTab) {
                // 查找当前标签
                const currentTab = state.tabs.find(tab => tab.key === state.activeTab);
                if (currentTab) {
                    // 切换固定状态
                    updateTabClosability();
                }
            }
            setShowDropdown(false);
        },
        [state.activeTab, state.tabs, updateTabClosability],
    );

    const handleCloseOtherTabs = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // 阻止冒泡
            if (state.activeTab) {
                removeOtherTabs(state.activeTab);
            }
            setShowDropdown(false);
        },
        [removeOtherTabs, state.activeTab],
    );

    const handleCloseCurrentTab = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // 阻止冒泡
            if (state.activeTab) {
                const currentTab = state.tabs.find(tab => tab.key === state.activeTab);
                if (currentTab && currentTab.closable !== false) {
                    removeTab(state.activeTab);
                }
            }
            setShowDropdown(false);
        },
        [removeTab, state.activeTab, state.tabs],
    );

    // 如果没有标签，不渲染组件（理论上这种情况不会发生，因为我们总是保持至少一个标签）
    if (!state.tabs.length) return null;

    return (
        <div className={styles.tabsBar}>
            <div className={styles.tabsList}>
                {state.tabs.map(tab => (
                    <div
                        key={tab.key}
                        className={`${styles.tabItem} ${state.activeTab === tab.key ? styles.active : ""}`}
                        onClick={() => handleTabClick(tab)}
                        onContextMenu={e => handleContextMenu(e, tab)}
                        title={tab.title}
                    >
                        {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
                        <span className={styles.tabTitle}>{tab.title}</span>

                        {/* 仅当有多个标签或者标签被标记为可关闭时显示关闭按钮 */}
                        {state.tabs.length > 1 && tab.closable !== false && (
                            <span
                                className={styles.tabClose}
                                onClick={e => handleRemoveTab(e, tab.key)}
                                title="关闭标签"
                            >
                                <RiCloseLine />
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.tabsActions}>
                <div className={styles.dropdownContainer}>
                    <button
                        ref={moreButtonRef}
                        className={styles.tabAction}
                        onClick={toggleDropdown}
                        type="button"
                        title="菜单"
                    >
                        <RiMoreFill />
                    </button>
                    {showDropdown && (
                        <div ref={dropdownRef} className={styles.dropdown}>
                            <button className={styles.dropdownItem} onClick={handlePinCurrentTab} type="button">
                                <RiPushpinFill />
                                <span>固定当前标签</span>
                            </button>
                            <button
                                className={`${styles.dropdownItem} ${!isActiveTabClosable() ? styles.disabled : ""}`}
                                onClick={isActiveTabClosable() ? handleCloseCurrentTab : undefined}
                                type="button"
                                disabled={!isActiveTabClosable()}
                            >
                                <RiCloseLine />
                                <span>关闭当前标签</span>
                            </button>
                            <button className={styles.dropdownItem} onClick={handleCloseOtherTabs} type="button">
                                <RiCloseFill />
                                <span>关闭其他标签</span>
                            </button>
                            <button
                                className={`${styles.dropdownItem} ${state.tabs.length <= 1 ? styles.disabled : ""}`}
                                onClick={state.tabs.length > 1 ? handleCloseAllTabs : undefined}
                                type="button"
                                disabled={state.tabs.length <= 1}
                            >
                                <RiCloseCircleLine />
                                <span>关闭所有标签</span>
                            </button>
                        </div>
                    )}
                </div>
                <button className={styles.tabAction} onClick={handleToggleFullscreen} type="button" title="全屏">
                    <RiFullscreenLine />
                </button>
            </div>
        </div>
    );
};

export default React.memo(TabsBar);
