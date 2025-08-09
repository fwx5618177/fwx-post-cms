import { instance } from "./interceptors";
import { IRequestConfig, IRequestMethods, RequestData } from "./http-types";

/**
 * 封装的 HTTP 请求方法集合
 * 适用于所有需要与后端 API 交互的场景
 * 支持 GET、POST、PUT、DELETE、PATCH 等常用请求方法
 * 自动处理请求拦截、响应拦截、错误处理等
 */
export const request: IRequestMethods = {
    /**
     * 发送 GET 请求
     * @param url - 请求地址
     * @param config - 请求配置，可选
     * @returns Promise<T> - 返回响应数据
     * @example
     * // 获取用户信息
     * const userInfo = await request.get<UserInfo>('/user/info');
     * // 带查询参数
     * const articles = await request.get<ArticleList>('/articles', { params: { page: 1 } });
     */
    get: <T = unknown>(url: string, config?: IRequestConfig): Promise<T> => instance.get(url, config),

    /**
     * 发送 POST 请求
     * @param url - 请求地址
     * @param data - 请求数据，可选
     * @param config - 请求配置，可选
     * @returns Promise<T> - 返回响应数据
     * @example
     * // 创建文章
     * const article = await request.post<Article>('/articles', { title: '标题', content: '内容' });
     * // 上传文件
     * const formData = new FormData();
     * formData.append('file', file);
     * const result = await request.post<UploadResult>('/upload', formData, {
     *   headers: { 'Content-Type': 'multipart/form-data' }
     * });
     */
    post: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig): Promise<T> =>
        instance.post(url, data, config),

    /**
     * 发送 PUT 请求
     * @param url - 请求地址
     * @param data - 请求数据，可选
     * @param config - 请求配置，可选
     * @returns Promise<T> - 返回响应数据
     * @example
     * // 更新用户信息
     * await request.put<void>('/user', { username: 'new name' });
     * // 更新文章
     * const article = await request.put<Article>('/articles/123', { title: '新标题' });
     */
    put: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig): Promise<T> =>
        instance.put(url, data, config),

    /**
     * 发送 DELETE 请求
     * @param url - 请求地址
     * @param config - 请求配置，可选
     * @returns Promise<T> - 返回响应数据
     * @example
     * // 删除文章
     * await request.delete<void>('/articles/123');
     * // 批量删除
     * await request.delete<void>('/articles/batch', { data: { ids: ['1', '2'] } });
     */
    delete: <T = unknown>(url: string, config?: IRequestConfig): Promise<T> => instance.delete(url, config),

    /**
     * 发送 PATCH 请求
     * @param url - 请求地址
     * @param data - 请求数据，可选
     * @param config - 请求配置，可选
     * @returns Promise<T> - 返回响应数据
     * @example
     * // 部分更新用户信息
     * await request.patch<void>('/user', { avatar: 'new-avatar.jpg' });
     * // 更新文章状态
     * await request.patch<Article>('/articles/123', { status: 'published' });
     */
    patch: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig): Promise<T> =>
        instance.patch(url, data, config),
};
