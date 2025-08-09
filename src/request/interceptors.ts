import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
// import { message } from "antd";
import { IResponseData } from "./http-types";
import { ErrorMessageMap } from "./error-messages";

/**
 * 创建 axios 实例
 * 配置基础请求参数，如 baseURL、超时时间、请求头等
 */
export const instance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * 请求拦截器
 * 在请求发送前统一处理，如添加 token、处理请求参数等
 */
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 获取 token
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 处理请求参数
        if (config.method === "get" && config.params) {
            // 过滤掉 undefined 和 null 的参数
            config.params = Object.fromEntries(Object.entries(config.params).filter(([_, value]) => value != null));
        }

        // 处理 POST 请求的数据
        if (config.method === "post" && config.data) {
            // 如果是 FormData，不处理
            if (!(config.data instanceof FormData)) {
                // 过滤掉 undefined 和 null 的数据
                config.data = Object.fromEntries(Object.entries(config.data).filter(([_, value]) => value != null));
            }
        }

        return config;
    },
    error => {
        // 请求错误处理
        // message.error("请求发送失败，请检查网络连接");
        return Promise.reject(error);
    },
);

/**
 * 响应拦截器
 * 在响应返回后统一处理，如处理业务状态码、错误信息等
 */
instance.interceptors.response.use(
    (response: AxiosResponse<IResponseData>): any => {
        const { data, status } = response;

        // 处理 HTTP 状态码
        if (status in ErrorMessageMap) {
            // 如果是成功状态码，直接返回数据
            if (status >= 200 && status < 300) {
                return data.data;
            }
            // 如果是错误状态码，显示对应错误信息
            // message.error(ErrorMessageMap[status]);
            return Promise.reject(new Error(ErrorMessageMap[status]));
        }

        // 处理业务状态码
        if (data.code === 200) {
            return data.data;
        }

        // 处理特殊状态码
        if (data.code === 401) {
            // 未登录或 token 过期
            // message.error(ErrorMessageMap[401]);
            // 清除本地 token
            localStorage.removeItem("token");
            // 跳转到登录页
            window.location.href = "/login";
            return Promise.reject(new Error(ErrorMessageMap[401]));
        }

        // 处理其他业务错误
        if (data.code in ErrorMessageMap) {
            // message.error(ErrorMessageMap[data.code]);
            return Promise.reject(new Error(ErrorMessageMap[data.code]));
        }

        // 其他错误
        // message.error(data.message || "请求失败");
        return Promise.reject(new Error(data.message || "请求失败"));
    },
    error => {
        // 处理 HTTP 错误
        const { response } = error;
        if (response) {
            const { status } = response;
            // 使用 ErrorMessageMap 获取错误信息
            const _errorMessage = ErrorMessageMap[status] || "请求失败";
            // message.error(_errorMessage);

            // 处理特定状态码
            if (status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } else {
            // 处理网络错误
            if (error.message.includes("timeout")) {
                // message.error("请求超时，请重试");
            } else {
                // message.error("网络错误，请检查网络连接");
            }
        }
        return Promise.reject(error);
    },
);
