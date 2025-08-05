// 内容项接口定义
export interface ContentItem {
    id: string;
    title: string;
    content: string;
    routekeyname: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    status?: "draft" | "published" | "archived";
}

// 内容详情接口
export interface ContentDetail extends ContentItem {
    views?: number;
    likes?: number;
    tags?: string[];
    category?: string;
    summary?: string;
    coverImage?: string;
}

// 内容列表项接口
export interface ContentListItem {
    id: string;
    title: string;
    routekeyname: string;
    username: string;
    createdAt: string;
    status: "draft" | "published" | "archived";
    views: number;
    summary?: string;
}

// 内容创建请求接口
export interface CreateContentRequest {
    title: string;
    content: string;
    routekeyname: string;
    tags?: string[];
    category?: string;
    summary?: string;
    coverImage?: string;
}

// 内容更新请求接口
export interface UpdateContentRequest {
    title: string;
    content: string;
    tags?: string[];
    category?: string;
    summary?: string;
    coverImage?: string;
    status?: "draft" | "published" | "archived";
}
