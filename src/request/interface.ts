// OSS上传相关接口类型定义
export interface PostCosConf {
    key: string;
    policy: string;
    qSignAlgorithm: string;
    qAk: string;
    qKeyTime: string;
    qSignature: string;
}

// OSS上传配置
export interface OSSSignatureRequest {
    allowPrefix: string;
    username: string;
    password: string;
}

// 上传前验证返回类型
export type BeforeUploadValueType = boolean | File;

// 上传目录类型
export type uploadOSSDir = "upload" | "images" | "documents" | "videos" | "audio" | "temp";

// 上传样式类型
export type uploadStyle = "click" | "dragger";

// 扩展的UploadFile类型，包含dist属性
export interface ExtendedUploadFile {
    uid: string;
    name: string;
    status?: "uploading" | "done" | "error" | "removed";
    url?: string;
    preview?: string;
    originFileObj?: File;
    dist?: string;
}
