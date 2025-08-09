/**
 * @deprecated 请使用 @/services/api 中的集中化 API 或 @/utils/oss 中的 ossApi
 * 这个文件保留是为了向后兼容，建议迁移到新的 API 结构
 */
import { ossApi as centralizedOssApi } from "@/services/api";
import { ossApi as utilsOssApi } from "@/utils/oss";
import { request } from "@/request";
import { OSSSignatureRequest, PostCosConf } from "@/request";

/**
 * OSS上传相关API
 */
export const ossApi = {
    /**
     * 获取OSS签名
     * @param params 签名请求参数
     * @returns Promise<PostCosConf> OSS配置信息
     */
    ossSignature: (params: OSSSignatureRequest): Promise<PostCosConf> => {
        return centralizedOssApi.signature(params);
    },

    /**
     * 验证文件是否存在
     * @param url 文件URL
     * @returns Promise<boolean> 文件是否存在
     */
    checkFileExists: (url: string): Promise<boolean> => {
        return request.get<boolean>("/api/oss/check", { params: { url } });
    },

    /**
     * 删除OSS文件
     * @param key 文件key
     * @returns Promise<void>
     */
    deleteFile: (key: string): Promise<void> => {
        return utilsOssApi.deleteOSSFile(key);
    },
};

export default ossApi;
