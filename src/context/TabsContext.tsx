import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { TabsState, TabsAction, TabItem } from "../types/TabsState";

// 定义初始状态
const initialState: TabsState = {
    tabs: [
        {
            key: "dashboard",
            title: "仪表盘",
            path: "/dashboard",
            closable: false,
        },
    ],
    activeTab: "dashboard",
};

// 创建reducer函数
const tabsReducer = (state: TabsState, action: TabsAction): TabsState => {
    switch (action.type) {
        case "ADD_TAB": {
            // 如果标签已存在且已经是当前激活标签，直接返回当前状态（不触发重渲染）
            if (state.tabs.some(tab => tab.key === action.payload.key) && state.activeTab === action.payload.key) {
                return state;
            }

            // 如果标签已存在，只激活它
            if (state.tabs.some(tab => tab.key === action.payload.key)) {
                return {
                    ...state,
                    activeTab: action.payload.key,
                };
            }

            // 否则添加新标签并激活
            return {
                ...state,
                tabs: [...state.tabs, action.payload],
                activeTab: action.payload.key,
            };
        }

        case "REMOVE_TAB": {
            // 检查要删除的标签是否存在
            const tabToRemove = state.tabs.find(tab => tab.key === action.payload.key);
            if (!tabToRemove) {
                return state; // 如果不存在，返回原状态
            }

            // 如果要删除的是当前活动标签
            if (state.activeTab === action.payload.key) {
                // 找到当前标签的索引
                const currentIndex = state.tabs.findIndex(tab => tab.key === action.payload.key);
                // 决定删除后要激活的标签
                let newActiveKey = "";
                if (state.tabs.length > 1) {
                    // 如果有下一个标签则激活它，否则激活上一个标签
                    newActiveKey = state.tabs[currentIndex + 1]?.key || state.tabs[currentIndex - 1].key;
                } else {
                    // 如果只有一个标签，删除后激活"仪表盘"
                    newActiveKey = "dashboard";
                }

                return {
                    activeTab: newActiveKey,
                    tabs: state.tabs.filter(tab => tab.key !== action.payload.key),
                };
            }

            // 如果不是当前活动标签，只删除它
            return {
                ...state,
                tabs: state.tabs.filter(tab => tab.key !== action.payload.key),
            };
        }

        case "REMOVE_OTHER_TABS": {
            // 检查要保留的标签是否存在
            const tabToKeep = state.tabs.find(tab => tab.key === action.payload.key);
            if (!tabToKeep) {
                return state; // 如果不存在，返回原状态
            }

            const newTabs = state.tabs.filter(tab => tab.key === action.payload.key || tab.closable === false);

            // 如果过滤后的标签数组与原数组相同，则直接返回原状态
            if (newTabs.length === state.tabs.length) {
                return state;
            }

            // 保留当前标签和固定标签（不可关闭的标签）
            return {
                ...state,
                tabs: newTabs,
                activeTab: action.payload.key,
            };
        }

        case "REMOVE_ALL_TABS": {
            // 只保留固定标签
            const fixedTabs = state.tabs.filter(tab => tab.closable === false);

            // 如果过滤后的标签数组与原数组相同，则直接返回原状态
            if (fixedTabs.length === state.tabs.length) {
                return state;
            }

            return {
                ...state,
                tabs: fixedTabs,
                // 如果有固定标签，激活第一个；否则设为空
                activeTab: fixedTabs.length > 0 ? fixedTabs[0].key : "",
            };
        }

        case "SET_ACTIVE_TAB": {
            // 如果要设置的活动标签与当前活动标签相同，直接返回当前状态
            if (state.activeTab === action.payload.key) {
                return state;
            }

            // 检查要激活的标签是否存在
            const tabExists = state.tabs.some(tab => tab.key === action.payload.key);
            if (!tabExists) {
                return state; // 如果不存在，返回原状态
            }

            return {
                ...state,
                activeTab: action.payload.key,
            };
        }

        default:
            return state;
    }
};

// 创建Context
const TabsContext = createContext<{
    state: TabsState;
    dispatch: React.Dispatch<TabsAction>;
    // 添加一些便捷函数
    addTab: (tab: TabItem) => void;
    removeTab: (key: string) => void;
    removeOtherTabs: (key: string) => void;
    removeAllTabs: () => void;
    setActiveTab: (key: string) => void;
}>({
    state: initialState,
    dispatch: () => null,
    addTab: () => {},
    removeTab: () => {},
    removeOtherTabs: () => {},
    removeAllTabs: () => {},
    setActiveTab: () => {},
});

// 创建Provider组件
export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tabsReducer, initialState);

    // 便捷函数
    const addTab = (tab: TabItem) => {
        // 检查标签是否已存在，以及active状态是否需要更新
        const existingTab = state.tabs.find(t => t.key === tab.key);

        // 如果标签已存在且已经是激活状态，不执行任何操作
        if (existingTab && state.activeTab === tab.key) {
            return;
        }

        // 如果标签已存在但不是激活状态，只需激活它
        if (existingTab) {
            dispatch({ type: "SET_ACTIVE_TAB", payload: { key: tab.key } });
            return;
        }

        // 否则添加新标签
        dispatch({ type: "ADD_TAB", payload: tab });
    };

    const removeTab = (key: string) => {
        dispatch({ type: "REMOVE_TAB", payload: { key } });
    };

    const removeOtherTabs = (key: string) => {
        dispatch({ type: "REMOVE_OTHER_TABS", payload: { key } });
    };

    const removeAllTabs = () => {
        dispatch({ type: "REMOVE_ALL_TABS" });
    };

    const setActiveTab = (key: string) => {
        dispatch({ type: "SET_ACTIVE_TAB", payload: { key } });
    };

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
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};

// 自定义Hook用于组件中访问Context
export const useTabsContext = () => useContext(TabsContext);
