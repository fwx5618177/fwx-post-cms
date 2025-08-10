/**
 * @deprecated 请使用 @/services/api 中的集中化 API
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
import { cityApi } from "@/services/api";

class api {
    static queryMarioResource = (_params: string) => cityApi.list();
}

export default api;
