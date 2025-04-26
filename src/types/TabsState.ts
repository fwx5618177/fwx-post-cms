import { ReactNode } from "react";

export interface TabItem {
    key: string;
    title: string;
    path: string;
    icon?: ReactNode;
    closable?: boolean;
}

export interface TabsState {
    tabs: TabItem[];
    activeTab: string;
}

export type TabsAction =
    | { type: "ADD_TAB"; payload: TabItem }
    | { type: "REMOVE_TAB"; payload: { key: string } }
    | { type: "REMOVE_OTHER_TABS"; payload: { key: string } }
    | { type: "REMOVE_ALL_TABS" }
    | { type: "SET_ACTIVE_TAB"; payload: { key: string } };
