import { TabItem, TabsAction } from "../types/TabsState";

export const addTab = (tab: TabItem): TabsAction => ({
    type: "ADD_TAB",
    payload: {
        ...tab,
        timestamp: Date.now(),
    },
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

export const pushToHistory = (key: string): TabsAction => ({
    type: "PUSH_TO_HISTORY",
    payload: { key },
});

export const popFromHistory = (): TabsAction => ({
    type: "POP_FROM_HISTORY",
});

export const setTabClosable = (key: string, closable: boolean): TabsAction => ({
    type: "SET_TAB_CLOSABLE",
    payload: { key, closable },
});
