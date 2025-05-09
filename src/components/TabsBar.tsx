import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { useTabsContext } from "../context/TabsContext";
import { TabItem } from "../types/TabsState";
import {
    RiCloseLine,
    RiCloseCircleLine,
    RiMoreFill,
    RiPushpinFill,
    RiFullscreenLine,
    RiCloseFill,
    RiPushpin2Fill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styles from "@styles/components/tabs-bar.module.scss";
import { Dropdown } from "./Dropdown";
import type { DropdownItem } from "./Dropdown/types";

const TabsBar: React.FC = () => {
    const { state, removeTab, removeOtherTabs, removeAllTabs, setActiveTab, updateTabClosability, pinTab, unpinTab } =
        useTabsContext();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; tab: TabItem | null }>({
        visible: false,
        x: 0,
        y: 0,
        tab: null,
    });

    // 判断当前激活的标签是否可关闭
    const isActiveTabClosable = useCallback(() => {
        if (state.tabs.length <= 1) return false;
        if (!state.activeTab) return false;
        const activeTab = state.tabs.find(tab => tab.key === state.activeTab);
        return activeTab?.closable !== false;
    }, [state.tabs, state.activeTab]);

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
            e.stopPropagation();
            const tab = state.tabs.find(t => t.key === key);
            if (!tab || tab.closable === false) return;
            removeTab(key);
        },
        [removeTab, state.tabs],
    );

    // 关闭当前/其他/所有tab
    const handleCloseCurrentTab = useCallback(() => {
        if (state.activeTab) {
            const currentTab = state.tabs.find(tab => tab.key === state.activeTab);
            if (currentTab && currentTab.closable !== false) {
                removeTab(state.activeTab);
            }
        }
    }, [removeTab, state.activeTab, state.tabs]);

    const handleCloseOtherTabs = useCallback(() => {
        if (state.activeTab) {
            removeOtherTabs(state.activeTab);
        }
    }, [removeOtherTabs, state.activeTab]);

    const handleCloseAllTabs = useCallback(() => {
        if (state.tabs.length > 0 && window.confirm("确定要关闭所有标签页吗？")) {
            removeAllTabs();
        }
    }, [removeAllTabs, state.tabs.length]);

    // 全屏切换
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

    // 右键菜单
    const handleContextMenu = useCallback((e: React.MouseEvent, tab: TabItem) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, tab });
    }, []);

    const handleContextMenuClose = useCallback(() => setContextMenu(v => ({ ...v, visible: false })), []);
    const handleDropdownClose = useCallback(() => setShowDropdown(false), []);

    // 统一管理所有操作的集中Map
    const actionMap = useMemo(() => {
        // 定义统一的操作对象
        return {
            // 右键菜单和标签上下文相关操作
            pin: (tabKey?: string) => tabKey && pinTab(tabKey),
            unpin: (tabKey?: string) => tabKey && unpinTab(tabKey),
            close: (tabKey?: string) => tabKey && removeTab(tabKey),

            // 全局操作
            pinActive: () => state.activeTab && pinTab(state.activeTab),
            unpinActive: () => state.activeTab && unpinTab(state.activeTab),
            closeCurrent: handleCloseCurrentTab,
            closeOthers: handleCloseOtherTabs,
            closeAll: handleCloseAllTabs,
            toggleFullscreen: handleToggleFullscreen,
        };
    }, [
        pinTab,
        unpinTab,
        removeTab,
        state.activeTab,
        handleCloseCurrentTab,
        handleCloseOtherTabs,
        handleCloseAllTabs,
        handleToggleFullscreen,
    ]);

    // 处理右键菜单选择
    const handleContextMenuSelect = useCallback(
        (item: DropdownItem) => {
            if (!contextMenu.tab) return;

            const actionKey = item.key as keyof typeof actionMap;
            const action = actionMap[actionKey];
            if (action) {
                action(contextMenu.tab.key);
            }

            setContextMenu(v => ({ ...v, visible: false }));
        },
        [contextMenu.tab, actionMap],
    );

    // 处理下拉菜单选择
    const handleDropdownSelect = useCallback(
        (item: DropdownItem) => {
            const actionKey = item.key as keyof typeof actionMap;
            const action = actionMap[actionKey];
            if (action) {
                action();
            }
            setShowDropdown(false);
        },
        [actionMap],
    );

    // 右键菜单项
    const contextMenuItems: DropdownItem[] = contextMenu.tab
        ? [
              contextMenu.tab.pinned
                  ? {
                        key: "unpin",
                        label: (
                            <>
                                <RiPushpin2Fill style={{ marginRight: 8 }} />
                                取消固定
                            </>
                        ),
                    }
                  : {
                        key: "pin",
                        label: (
                            <>
                                <RiPushpinFill style={{ marginRight: 8 }} />
                                固定标签
                            </>
                        ),
                    },
          ]
        : [];

    // 更多菜单
    const dropdownItems: DropdownItem[] = [
        state.activeTab && state.tabs.find(tab => tab.key === state.activeTab)?.pinned
            ? {
                  key: "unpinActive",
                  label: (
                      <>
                          <RiPushpin2Fill style={{ marginRight: 8 }} />
                          取消固定
                      </>
                  ),
              }
            : {
                  key: "pinActive",
                  label: (
                      <>
                          <RiPushpinFill style={{ marginRight: 8 }} />
                          固定当前标签
                      </>
                  ),
              },
        {
            key: "closeCurrent",
            label: (
                <>
                    <RiCloseLine style={{ marginRight: 8 }} />
                    关闭当前标签
                </>
            ),
            disabled: !isActiveTabClosable(),
        },
        {
            key: "closeOthers",
            label: (
                <>
                    <RiCloseFill style={{ marginRight: 8 }} />
                    关闭其他标签
                </>
            ),
        },
        {
            key: "closeAll",
            label: (
                <>
                    <RiCloseCircleLine style={{ marginRight: 8 }} />
                    关闭所有标签
                </>
            ),
            disabled: state.tabs.length <= 1,
        },
    ];

    const sortedTabs = [...state.tabs.filter(tab => tab.pinned), ...state.tabs.filter(tab => !tab.pinned)];

    if (!state.tabs.length) return null;

    return (
        <div className={styles.tabsBar}>
            <div className={styles.tabsList}>
                {sortedTabs.map(tab => (
                    <div
                        key={tab.key}
                        className={`${styles.tabItem} ${tab.pinned ? styles.pinned : ""} ${
                            state.activeTab === tab.key ? styles.active : ""
                        }`}
                        onClick={() => handleTabClick(tab)}
                        onContextMenu={e => handleContextMenu(e, tab)}
                        title={tab.title}
                    >
                        {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
                        <span className={styles.tabTitle}>{tab.title}</span>
                        {tab.pinned ? (
                            <span
                                className={styles.tabPin}
                                onClick={e => {
                                    e.stopPropagation();
                                    unpinTab(tab.key);
                                }}
                                title="取消固定"
                            >
                                <RiPushpin2Fill />
                            </span>
                        ) : (
                            state.tabs.length > 1 &&
                            tab.closable !== false && (
                                <span
                                    className={styles.tabClose}
                                    onClick={e => handleRemoveTab(e, tab.key)}
                                    title="关闭标签"
                                >
                                    <RiCloseLine />
                                </span>
                            )
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.tabsActions}>
                <div className={styles.dropdownContainer}>
                    <button
                        ref={moreButtonRef}
                        className={styles.tabAction}
                        onClick={() => setShowDropdown(v => !v)}
                        type="button"
                        title="菜单"
                    >
                        <RiMoreFill />
                    </button>
                    <Dropdown
                        open={showDropdown}
                        anchorEl={moreButtonRef.current}
                        items={dropdownItems}
                        onSelect={handleDropdownSelect}
                        onClose={handleDropdownClose}
                        size="small"
                        maxHeight={240}
                        placement="bottomLeft"
                    />
                </div>
                <button className={styles.tabAction} onClick={handleToggleFullscreen} type="button" title="全屏">
                    <RiFullscreenLine />
                </button>
            </div>
            <Dropdown
                open={contextMenu.visible && !!contextMenu.tab}
                position={{ x: contextMenu.x, y: contextMenu.y }}
                items={contextMenuItems}
                onSelect={handleContextMenuSelect}
                onClose={handleContextMenuClose}
                size="small"
                maxHeight={120}
            />
        </div>
    );
};

export default React.memo(TabsBar);
