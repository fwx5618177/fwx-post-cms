import { ReactNode } from "react";

export interface TabItem {
    key: string;
    title: string;
    path: string;
    icon?: ReactNode;
    closable?: boolean;
    timestamp?: number;
    pinned?: boolean;
}

// 导航信息接口
export interface TabNavigationInfo {
    key: string;
    path: string;
}

export interface TabsState {
    tabs: TabItem[];
    activeTab: string;
    tabHistory: string[];
    dashboardKey: string;
    tabToNavigate?: TabNavigationInfo; // 可选属性，用于记录需要导航的tab信息
}

export type TabsAction =
    | { type: "ADD_TAB"; payload: TabItem }
    | { type: "REMOVE_TAB"; payload: { key: string } }
    | { type: "REMOVE_OTHER_TABS"; payload: { key: string } }
    | { type: "REMOVE_ALL_TABS" }
    | { type: "SET_ACTIVE_TAB"; payload: { key: string } }
    | { type: "PUSH_TO_HISTORY"; payload: { key: string } }
    | { type: "POP_FROM_HISTORY" }
    | { type: "SET_TAB_CLOSABLE"; payload: { key: string; closable: boolean } }
    | { type: "CLEAR_NAVIGATION" }
    | { type: "PIN_TAB"; payload: { key: string } }
    | { type: "UNPIN_TAB"; payload: { key: string } };
