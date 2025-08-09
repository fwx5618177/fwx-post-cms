/**
 * @deprecated 请使用 @/services/api 中的集中化 API
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
import { commonApi } from "@/services/api";

export default class api {
    static list = () => commonApi.get("/api/todo/list");
    static queryId = (params: string) => commonApi.get(`/api/todo/list/${params}`);
    static create = (params: any) => commonApi.post(`/api/todo/list/`, params);
    static update = (id: string, params: any) => commonApi.put(`/api/todo/list/${id}`, params);
    static deleteData = (id: string) => commonApi.delete(`/api/todo/list/${id}`);
}
