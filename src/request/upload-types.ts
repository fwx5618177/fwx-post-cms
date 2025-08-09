// OSS 上传相关接口类型定义
export interface PostCosConf {
    key: string;
    policy: string;
    qSignAlgorithm: string;
    qAk: string;
    qKeyTime: string;
    qSignature: string;
}

// OSS 上传配置请求
export interface OSSSignatureRequest {
    allowPrefix: string;
    username: string;
    password: string;
}

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

// OSS 策略响应
export interface OSSPolicy {
    accessId: string;
    policy: string;
    signature: string;
    dir: string;
    host: string;
    expire: number;
}

// OSS 临时签证
export interface OSSTmpSecret {
    tmpSecretId: string;
    tmpSecretKey: string;
    securityToken: string;
    expiredTime: number;
    scopeLimit: boolean;
    startTime: number;
    bucketName: string;
    region: string;
    serverName: string;
    uploadPath: string;
    signAuth: string;
}

// OSS 验证数据
export interface OSSValidation {
    allowPrefix: string;
    username: string;
    password: string;
}

// OSS 上传实例
export interface OSSUpload {
    instance: any; // COS 实例
    config: {
        TmpSecretId: string;
        TmpSecretKey: string;
        XCosSecurityToken: string;
        scopeLimit: boolean;
        StartTime: number;
        ExpiredTime: number;
        Bucket: string;
        Region: string;
        Path: string;
        ServerName: string;
        signAuth: string;
    };
}

// OSS 上传配置
export interface OSSCosConf {
    key: string;
    policy: string;
    "q-ak": string;
    "q-header-list": string;
    "q-key-time": string;
    "q-sign-algorithm": string;
    "q-sign-time": string;
    "q-signature": string;
    "q-url-param-list": string;
}

// 上传前验证返回类型
export type BeforeUploadValueType = void | boolean | string | Blob | File;

// 上传目录类型 - 统一化
export type uploadOSSDir = "upload" | "images" | "documents" | "videos" | "audio" | "temp" | "image" | "file" | "video";

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
