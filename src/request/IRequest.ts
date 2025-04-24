import { AxiosRequestConfig } from "axios";

// 响应数据格式
export interface IResponseData<T = any> {
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

// 请求方法
export interface IRequestMethods {
    get: <T = any>(url: string, config?: IRequestConfig) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: IRequestConfig) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: IRequestConfig) => Promise<T>;
    delete: <T = any>(url: string, config?: IRequestConfig) => Promise<T>;
    patch: <T = any>(url: string, data?: any, config?: IRequestConfig) => Promise<T>;
}
