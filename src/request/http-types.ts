import { AxiosRequestConfig } from "axios";

// 响应数据格式
export interface IResponseData<T = unknown> {
    code: number;
    data: T;
    message: string;
    success: boolean;
}

// 请求配置
export interface IRequestConfig extends AxiosRequestConfig {
    skipErrorHandler?: boolean; // 是否跳过错误处理
    skipAuth?: boolean; // 是否跳过认证
    showError?: boolean; // 是否显示错误信息
}

// 错误信息映射
export interface IErrorMessageMap {
    [key: number]: string;
}

// 请求数据类型
export type RequestData = Record<string, unknown> | FormData | string | null;

// 请求方法
export interface IRequestMethods {
    get: <T = unknown>(url: string, config?: IRequestConfig) => Promise<T>;
    post: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig) => Promise<T>;
    put: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig) => Promise<T>;
    delete: <T = unknown>(url: string, config?: IRequestConfig) => Promise<T>;
    patch: <T = unknown>(url: string, data?: RequestData, config?: IRequestConfig) => Promise<T>;
}
