import { request } from "@/request";
import { OSSUploadParams, OSSUploadResponse, OSSPolicy } from "@/request";

// OSS 相关接口
export const ossApi = {
    // 获取 OSS 上传策略
    getOSSPolicy: () => request.get<OSSPolicy>("/oss/policy"),

    // 上传文件到 OSS
    uploadToOSS: (params: OSSUploadParams) => {
        const formData = new FormData();
        formData.append("file", params.file);
        if (params.dir) formData.append("dir", params.dir);
        if (params.filename) formData.append("filename", params.filename);
        return request.post<OSSUploadResponse>("/oss/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    // 删除 OSS 文件
    deleteOSSFile: (filename: string) => request.delete<void>(`/oss/file/${filename}`),
};
