/**
 * @deprecated 请使用 @/services/api 中的集中化 API
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
import { menuApi } from "@/services/api";

class api {
    static queryRouteList = (params: any) => menuApi.queryRouteList(params);

    static createContent = (params: any) => menuApi.createContent(params);

    static list = () => menuApi.list();

    static detail = (params: string) => menuApi.detail(params);

    static updateContent = (params: any) => menuApi.updateContent(params);
}

export default api;
