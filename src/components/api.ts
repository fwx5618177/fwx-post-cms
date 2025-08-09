import { articleApi, ossApi } from "@/services/api";

/**
 * @deprecated 请使用 @/services/api 中的集中化 API
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
export default class api {
    static detail = (params: { id: string }) => articleApi.detail(params.id);

    static ossSignature = (params: { allowPrefix: string; username: string; password: string }) =>
        ossApi.signature(params);
}
