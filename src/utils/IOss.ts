import COS from "cos-js-sdk-v5";

// OSS 上传参数
export interface IOssUploadParams {
    file: File;
    dir?: string;
    filename?: string;
}

// OSS 上传响应
export interface IOssUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

// OSS 策略响应
export interface IOssPolicy {
    accessId: string;
    policy: string;
    signature: string;
    dir: string;
    host: string;
    expire: number;
}

// OSS 临时签证
export interface IOssTmpSecret {
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
export interface IOssValidation {
    allowPrefix: string;
    username: string;
    password: string;
}

// OSS 上传实例
export interface IOssUpload {
    instance: COS;
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
export interface IOssCosConf {
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

// 上传前值类型
export type IBeforeUploadValueType = void | boolean | string | Blob | File;

// 上传目录类型
export type IOssUploadDir = "upload" | "image" | "file" | "video";

// 上传样式类型
export type IOssUploadStyle = "click" | "dragger";
