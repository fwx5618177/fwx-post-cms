import { mockArticles } from "@settings/article-list/mock";
import { Article } from "../types/IArticleList";
import { request } from "@/request";

// 查询参数类型
export type FetchParams = {
    page: number;
    pageSize: number;
    searchTerm: string;
    category: string;
    status: string;
};

// 获取文章列表
export async function fetchArticlesService(params: FetchParams): Promise<{ data: Article[]; total: number }> {
    try {
        return await request.get<{ data: Article[]; total: number }>("/api/article/list", {
            params: {
                page: params.page,
                pageSize: params.pageSize,
                search: params.searchTerm,
                category: params.category === "all" ? undefined : params.category,
                status: params.status === "all" ? undefined : params.status,
            },
        });
    } catch (error) {
        console.error("获取文章列表失败", error);
        return { data: mockArticles, total: 123 };
    }
}

export async function deleteArticleService(id: number): Promise<void> {
    await request.delete(`/api/article/${id}`);
}

// 路由跳转（需在组件内用 useNavigate，或用 window.location 兼容）
export function navigateToEdit(id: number) {
    window.location.href = `/content/article/edit/${id}?mode=edit`;
}
export function navigateToView(id: number) {
    window.location.href = `/content/article/edit/${id}?mode=view`;
}
export function navigateToCreate() {
    window.location.href = "/content/article/edit";
}
