import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from "react";
import { TabsState, TabsAction, TabItem } from "../types/TabsState";
import { useNavigate } from "react-router-dom";

// 定义仪表盘键值
const DASHBOARD_KEY = "dashboard";

// 定义初始状态
const initialState: TabsState = {
    tabs: [
        {
            key: DASHBOARD_KEY,
            title: "仪表盘",
            path: "/dashboard",
            closable: false, // 默认第一个标签不可关闭
            timestamp: Date.now(),
        },
    ],
    activeTab: DASHBOARD_KEY,
    tabHistory: [], // 初始化空的历史栈
    dashboardKey: DASHBOARD_KEY, // 保存仪表盘key
};

// 创建reducer函数
const tabsReducer = (state: TabsState, action: TabsAction): TabsState => {
    switch (action.type) {
        case "ADD_TAB": {
            const { payload } = action;

            // 首先检查是否已存在具有相同路径或相同key的标签
            const existingTabByPath = state.tabs.find(tab => tab.path === payload.path);
            const existingTabByKey = state.tabs.find(tab => tab.key === payload.key);

            // 使用路径找到的标签，如果有的话
            const existingTab = existingTabByPath;

            // 如果找到相同key的标签但不是相同路径的标签，这是一个错误情况
            // 我们应该避免添加相同key的不同标签
            if (existingTabByKey && !existingTabByPath) {
                // 如果是仪表盘，使用现有标签，避免重复
                if (payload.key === "dashboard" || payload.key === "dashboard-content") {
                    return {
                        ...state,
                        activeTab: existingTabByKey.key,
                    };
                }
                // 否则，使用路径生成一个新的唯一key
                payload.key = `${payload.path.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
            }

            // 如果找到相同路径的标签，并且它已经是激活标签，直接返回当前状态
            if (existingTab && state.activeTab === existingTab.key) {
                return state;
            }

            // 历史记录处理：当激活新标签时，将当前激活的标签加入历史
            let newHistory = [...state.tabHistory];
            if (
                state.activeTab &&
                (existingTab ? state.activeTab !== existingTab.key : state.activeTab !== payload.key)
            ) {
                // 确保不添加重复的历史记录
                if (!newHistory.includes(state.activeTab)) {
                    newHistory = [state.activeTab, ...newHistory.slice(0, 9)]; // 限制历史记录长度为10
                }
            }

            // 如果已存在相同路径的标签，激活它而不是添加新标签
            if (existingTab) {
                return {
                    ...state,
                    activeTab: existingTab.key,
                    tabHistory: newHistory,
                };
            }

            // 否则添加新标签并激活
            return {
                ...state,
                tabs: [...state.tabs, payload],
                activeTab: payload.key,
                tabHistory: newHistory,
            };
        }

        case "REMOVE_TAB": {
            const { key } = action.payload;
            const tabToRemove = state.tabs.find(tab => tab.key === key);

            // 如果要删除的标签不存在，返回当前状态
            if (!tabToRemove) {
                return state;
            }

            // 如果标签被标记为不可关闭，则不关闭它
            if (tabToRemove.closable === false) {
                return state;
            }

            // 如果只有一个标签，不允许关闭
            if (state.tabs.length <= 1) {
                return state;
            }

            const newTabs = state.tabs.filter(tab => tab.key !== key);

            // 如果删除后没有标签，自动添加仪表盘标签
            if (newTabs.length === 0) {
                return {
                    ...state,
                    tabs: [
                        {
                            key: state.dashboardKey,
                            title: "仪表盘",
                            path: "/dashboard",
                            closable: false, // 设置为不可关闭，因为这是唯一的标签
                            timestamp: Date.now(),
                        },
                    ],
                    activeTab: state.dashboardKey,
                    tabHistory: [],
                };
            }

            // 如果删除的是当前活动标签，需要确定新的活动标签
            if (state.activeTab === key) {
                // 找到当前标签的索引
                const currentIndex = state.tabs.findIndex(tab => tab.key === key);

                // 选择相邻的标签（先尝试右侧，再尝试左侧）
                let newActiveKey = "";
                let nextTab = null;

                if (currentIndex !== -1) {
                    if (currentIndex < state.tabs.length - 1) {
                        // 有下一个标签，激活它
                        nextTab = state.tabs[currentIndex + 1];
                        newActiveKey = nextTab.key;
                    } else if (currentIndex > 0) {
                        // 没有下一个标签但有上一个标签，激活它
                        nextTab = state.tabs[currentIndex - 1];
                        newActiveKey = nextTab.key;
                    }
                }

                // 如果没找到相邻标签（理论上不会发生），使用第一个标签
                if (!newActiveKey && newTabs.length > 0) {
                    nextTab = newTabs[0];
                    newActiveKey = nextTab.key;
                }

                return {
                    ...state,
                    tabs: newTabs,
                    activeTab: newActiveKey,
                    // 保存要导航到的路径，用于与router同步
                    tabToNavigate: {
                        key: newActiveKey,
                        path: nextTab?.path || "/dashboard",
                    },
                    tabHistory: state.tabHistory.filter(historyKey => historyKey !== key),
                };
            }

            // 如果不是当前活动标签，只需要更新标签列表
            return {
                ...state,
                tabs: newTabs,
                tabHistory: state.tabHistory.filter(historyKey => historyKey !== key),
            };
        }

        case "REMOVE_OTHER_TABS": {
            const { key } = action.payload;
            const tabToKeep = state.tabs.find(tab => tab.key === key);

            // 如果要保留的标签不存在，返回当前状态
            if (!tabToKeep) {
                return state;
            }

            // 保留指定的标签，其他全部删除
            return {
                ...state,
                tabs: [tabToKeep],
                activeTab: key,
                tabHistory: [], // 清空历史记录
            };
        }

        case "REMOVE_ALL_TABS": {
            // 只保留 pinned tab
            const pinnedTabs = state.tabs.filter(tab => tab.pinned);
            // 如果没有 pinned tab，保留仪表盘
            if (pinnedTabs.length === 0) {
                return {
                    ...state,
                    tabs: [
                        {
                            key: state.dashboardKey,
                            title: "仪表盘",
                            path: "/dashboard",
                            closable: false, // 设置为不可关闭，因为这是唯一的标签
                            timestamp: Date.now(),
                        },
                    ],
                    activeTab: state.dashboardKey,
                    tabToNavigate: {
                        key: state.dashboardKey,
                        path: "/dashboard",
                    },
                    tabHistory: [], // 清空历史记录
                };
            }
            // 否则保留所有 pinned tab，激活第一个 pinned tab
            return {
                ...state,
                tabs: pinnedTabs,
                activeTab: pinnedTabs[0].key,
                tabToNavigate: {
                    key: pinnedTabs[0].key,
                    path: pinnedTabs[0].path,
                },
                tabHistory: [],
            };
        }

        case "SET_ACTIVE_TAB": {
            const { key } = action.payload;

            // 如果要设置的活动标签与当前活动标签相同，直接返回当前状态
            if (state.activeTab === key) {
                return state;
            }

            // 检查要激活的标签是否存在
            const tabToActivate = state.tabs.find(tab => tab.key === key);
            if (!tabToActivate) {
                return state;
            }

            // 将当前激活的标签添加到历史记录
            let newHistory = [...state.tabHistory];
            if (state.activeTab) {
                // 确保不添加重复的历史记录
                if (!newHistory.includes(state.activeTab)) {
                    newHistory = [state.activeTab, ...newHistory.slice(0, 9)];
                }
            }

            return {
                ...state,
                activeTab: key,
                tabToNavigate: {
                    key: key,
                    path: tabToActivate.path,
                },
                tabHistory: newHistory,
            };
        }

        case "CLEAR_NAVIGATION": {
            // 清除导航状态
            const { tabToNavigate: _tabToNavigate, ...rest } = state;
            return rest;
        }

        case "PUSH_TO_HISTORY": {
            const { key } = action.payload;

            // 如果历史记录已经包含了这个key，先移除它
            const filteredHistory = state.tabHistory.filter(historyKey => historyKey !== key);

            // 然后将它添加到历史记录的最前面
            return {
                ...state,
                tabHistory: [key, ...filteredHistory.slice(0, 9)],
            };
        }

        case "POP_FROM_HISTORY": {
            // 如果历史记录为空，无法弹出
            if (state.tabHistory.length === 0) {
                return state;
            }

            // 弹出最近的历史记录
            const [latestKey, ...restHistory] = state.tabHistory;

            // 确保这个标签仍然存在
            const tabExists = state.tabs.some(tab => tab.key === latestKey);
            if (!tabExists) {
                // 如果不存在，递归调用继续弹出
                return tabsReducer(state, { type: "POP_FROM_HISTORY" });
            }

            return {
                ...state,
                activeTab: latestKey,
                tabHistory: restHistory,
            };
        }

        case "SET_TAB_CLOSABLE": {
            const { key, closable } = action.payload;

            // 更新指定标签的closable属性
            return {
                ...state,
                tabs: state.tabs.map(tab => (tab.key === key ? { ...tab, closable } : tab)),
            };
        }

        case "PIN_TAB": {
            const { key } = action.payload;
            const tabToPin = state.tabs.find(tab => tab.key === key);
            if (!tabToPin || tabToPin.pinned) return state;
            // 设为 pinned，并移到最前面
            const newTabs = [
                { ...tabToPin, pinned: true, closable: false },
                ...state.tabs.filter(tab => tab.key !== key),
            ];
            return {
                ...state,
                tabs: newTabs,
            };
        }

        case "UNPIN_TAB": {
            const { key } = action.payload;
            const tabToUnpin = state.tabs.find(tab => tab.key === key);
            if (!tabToUnpin || !tabToUnpin.pinned) return state;
            // 设为未 pinned，并移到第一个未 pinned 的tab后面
            const tabsWithout = state.tabs.filter(tab => tab.key !== key);
            const firstUnpinnedIdx = tabsWithout.findIndex(tab => !tab.pinned);
            const insertIdx = firstUnpinnedIdx === -1 ? tabsWithout.length : firstUnpinnedIdx;
            const newTabs = [
                ...tabsWithout.slice(0, insertIdx),
                { ...tabToUnpin, pinned: false, closable: true },
                ...tabsWithout.slice(insertIdx),
            ];
            return {
                ...state,
                tabs: newTabs,
            };
        }

        default:
            return state;
    }
};

// 创建Context
interface TabsContextValue {
    state: TabsState;
    dispatch: React.Dispatch<TabsAction>;
    // 便捷函数
    addTab: (tab: TabItem) => void;
    removeTab: (key: string) => void;
    removeOtherTabs: (key: string) => void;
    removeAllTabs: () => void;
    setActiveTab: (key: string) => void;
    setTabClosable: (key: string, closable: boolean) => void;
    updateTabClosability: () => void; // 新增方法：更新标签关闭状态
    generateTabKey: (path: string, title: string) => string; // 新增：生成唯一Key
    pinTab: (key: string) => void;
    unpinTab: (key: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
    state: initialState,
    dispatch: () => null,
    addTab: () => {},
    removeTab: () => {},
    removeOtherTabs: () => {},
    removeAllTabs: () => {},
    setActiveTab: () => {},
    setTabClosable: () => {},
    updateTabClosability: () => {},
    generateTabKey: () => "",
    pinTab: () => {},
    unpinTab: () => {},
});

// 创建Provider组件
export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tabsReducer, initialState);
    const navigate = useNavigate();

    // 监听tabToNavigate变化，进行路由导航
    useEffect(() => {
        if (state.tabToNavigate) {
            // 导航到指定路径
            navigate(state.tabToNavigate.path);

            // 执行导航后清除导航状态，避免重复导航
            setTimeout(() => {
                dispatch({ type: "CLEAR_NAVIGATION" });
            }, 0);
        }
    }, [state.tabToNavigate, navigate]);

    // 添加标签
    const addTab = useCallback((tab: TabItem) => {
        // 添加时间戳
        const tabWithTimestamp = {
            ...tab,
            timestamp: Date.now(),
        };
        dispatch({ type: "ADD_TAB", payload: tabWithTimestamp });
    }, []);

    // 删除标签
    const removeTab = useCallback((key: string) => {
        dispatch({ type: "REMOVE_TAB", payload: { key } });
    }, []);

    // 删除其他标签
    const removeOtherTabs = useCallback((key: string) => {
        dispatch({ type: "REMOVE_OTHER_TABS", payload: { key } });
    }, []);

    // 删除所有标签
    const removeAllTabs = useCallback(() => {
        dispatch({ type: "REMOVE_ALL_TABS" });
    }, []);

    // 设置活动标签
    const setActiveTab = useCallback((key: string) => {
        dispatch({ type: "SET_ACTIVE_TAB", payload: { key } });
    }, []);

    // 设置标签是否可关闭
    const setTabClosable = useCallback((key: string, closable: boolean) => {
        dispatch({ type: "SET_TAB_CLOSABLE", payload: { key, closable } });
    }, []);

    // 更新标签关闭状态
    const updateTabClosability = useCallback(() => {
        // 如果只有一个标签，设为不可关闭
        if (state.tabs.length <= 1) {
            const onlyTab = state.tabs[0];
            if (onlyTab && onlyTab.closable) {
                dispatch({
                    type: "SET_TAB_CLOSABLE",
                    payload: { key: onlyTab.key, closable: false },
                });
            }
            return;
        }

        // 获取所有tab的路径，并计算每个路径出现的次数
        const _pathCounts = state.tabs.reduce((counts, tab) => {
            if (tab.path) {
                counts[tab.path] = (counts[tab.path] || 0) + 1;
            }
            return counts;
        }, {} as Record<string, number>);

        // 检查并更新每个标签的可关闭状态
        state.tabs.forEach(tab => {
            // 当有多个标签时，都应该是可关闭的
            const shouldBeClosable = true;

            // 只有当需要改变时才派发action
            if (tab.closable !== shouldBeClosable) {
                dispatch({
                    type: "SET_TAB_CLOSABLE",
                    payload: { key: tab.key, closable: shouldBeClosable },
                });
            }
        });
    }, [state.tabs, dispatch]);

    // 初始化时确保仪表盘标签被正确设置为不可关闭（如果是唯一的标签）
    useEffect(() => {
        updateTabClosability();
    }, [updateTabClosability]);

    // 生成唯一的标签Key
    const generateTabKey = useCallback(
        (path: string, _title: string) => {
            // 检查是否已存在该路径的标签
            const existingTab = state.tabs.find(tab => tab.path === path);
            if (existingTab) {
                return existingTab.key; // 如果已存在，返回已有标签的key
            }

            // 否则生成一个唯一key
            // 使用路径作为基础，添加当前时间戳确保唯一性
            return `${path.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
        },
        [state.tabs],
    );

    // 固定标签
    const pinTab = useCallback((key: string) => {
        dispatch({ type: "PIN_TAB", payload: { key } });
    }, []);
    // 取消固定标签
    const unpinTab = useCallback((key: string) => {
        dispatch({ type: "UNPIN_TAB", payload: { key } });
    }, []);

    return (
        <TabsContext.Provider
            value={{
                state,
                dispatch,
                addTab,
                removeTab,
                removeOtherTabs,
                removeAllTabs,
                setActiveTab,
                setTabClosable,
                updateTabClosability,
                generateTabKey,
                pinTab,
                unpinTab,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};

// 自定义Hook用于组件中访问Context
export const useTabsContext = () => useContext(TabsContext);
