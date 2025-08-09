import { request } from "@/request";
import { OSSSignatureRequest, PostCosConf } from "@/request";

/**
 * 统一的 API 服务
 * 集中管理所有 API 调用，避免分散的 api.ts 文件
 */

// ================================
// 文章相关 API
// ================================
export const articleApi = {
    // 获取文章详情
    detail: (id: string) => request.get(`/api/content/detail/${id}`),

    // 获取文章列表
    list: () => request.get("/api/content/list"),

    // 创建文章
    create: (params: any) => request.put("/api/content/create", params),

    // 更新文章
    update: (params: any) => request.put(`/api/content/detail/${params?.title}`, params),

    // 删除文章
    delete: (id: string) => request.delete(`/api/article/${id}`),
};

// ================================
// 路由相关 API
// ================================
export const routeApi = {
    // 查询路由列表
    queryList: (params: any) => request.post("/api/route/list", params),
};

// ================================
// OSS 上传相关 API
// ================================
export const ossApi = {
    // OSS 签名
    signature: (params: OSSSignatureRequest) => request.post<PostCosConf>("/api/oss/signature", params),
};

// ================================
// 通用 API
// ================================
export const commonApi = {
    // 通用 POST 请求
    post: (url: string, data?: any) => request.post(url, data),

    // 通用 GET 请求
    get: (url: string, params?: any) => request.get(url, { params }),

    // 通用 PUT 请求
    put: (url: string, data?: any) => request.put(url, data),

    // 通用 DELETE 请求
    delete: (url: string) => request.delete(url),
};

// ================================
// 菜单相关 API
// ================================
export const menuApi = {
    // 查询路由列表
    queryRouteList: (params: any) => request.post("/api/route/list", params),

    // 创建内容
    createContent: (params: any) => request.put("/api/content/create", params),

    // 获取内容列表
    list: () => request.get("/api/content/list"),

    // 获取内容详情
    detail: (params: string) => request.get(`/api/content/detail/${params}`),

    // 更新内容
    updateContent: (params: any) => request.put(`/api/content/detail/${params?.title}`, params),
};

// ================================
// 城市相关 API
// ================================
export const cityApi = {
    // 获取城市列表
    list: () => request.get("/api/city/list"),
};

// ================================
// 源码相关 API
// ================================
export const sourceApi = {
    // 提交源码
    submit: (params: any) => request.post("/api/source/submit", params),
};

// 导出默认 API（向后兼容）
export default {
    detail: articleApi.detail,
    ossSignature: ossApi.signature,
};
