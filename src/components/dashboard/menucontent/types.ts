// MenuContent 相关类型定义
export interface RouteItem {
    label: string;
    key: string;
    path: string;
}

export interface ContentItem {
    title: string;
    content: string;
    routekeyname: string;
    createdAt: string;
}

export interface FormValues {
    content: string;
    title: string;
    name: string;
}

export interface UpdateFormValues {
    title: string;
    updateContent: string;
}

export interface SelectOption {
    label: string;
    value: string;
}
