import { request } from "@request/request";
import { IOssUploadParams, IOssUploadResponse, IOssPolicy } from "./IOss";

// OSS 上传参数
export interface OSSUploadParams {
    file: File;
    dir?: string;
    filename?: string;
}

// OSS 上传响应
export interface OSSUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

// OSS 相关接口
export const ossApi = {
    // 获取 OSS 上传策略
    getOSSPolicy: () => request.get<IOssPolicy>("/oss/policy"),

    // 上传文件到 OSS
    uploadToOSS: (params: IOssUploadParams) => {
        const formData = new FormData();
        formData.append("file", params.file);
        if (params.dir) formData.append("dir", params.dir);
        if (params.filename) formData.append("filename", params.filename);
        return request.post<IOssUploadResponse>("/oss/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    // 删除 OSS 文件
    deleteOSSFile: (filename: string) => request.delete<void>(`/oss/file/${filename}`),
};
