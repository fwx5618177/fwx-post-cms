/**
 * @deprecated 请使用 @/services/api 中的集中化 API
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
import { commonApi, routeApi } from "@/services/api";

class api {
    static createRoute = (params: any) => commonApi.post("/api/route/createRoute", params);

    static queryRouteList = (params: any) => routeApi.queryList(params);

    static parentLists = (params: any) => commonApi.post("/api/route/parentLists", params);
}

export default api;
