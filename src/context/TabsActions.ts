import { TabItem, TabsAction } from "../types/TabsState";

export const addTab = (tab: TabItem): TabsAction => ({
    type: "ADD_TAB",
    payload: tab,
});

export const removeTab = (key: string): TabsAction => ({
    type: "REMOVE_TAB",
    payload: { key },
});

export const removeOtherTabs = (key: string): TabsAction => ({
    type: "REMOVE_OTHER_TABS",
    payload: { key },
});

export const removeAllTabs = (): TabsAction => ({
    type: "REMOVE_ALL_TABS",
});

export const setActiveTab = (key: string): TabsAction => ({
    type: "SET_ACTIVE_TAB",
    payload: { key },
});
