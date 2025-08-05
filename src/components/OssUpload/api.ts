import { request } from "@/request/request";
import { OSSSignatureRequest, PostCosConf } from "@/request/interface";

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
        return request.post<PostCosConf>("/api/oss/signature", params);
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
        return request.delete<void>("/api/oss/delete", { params: { key } });
    },
};

export default ossApi;
