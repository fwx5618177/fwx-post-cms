// HTTP 请求方法导出
export { request } from "./request";

// 为了向后兼容，导出单独的方法
import { request } from "./request";

export const get = request.get;
export const post = request.post;
export const put = request.put;
export const deleteRequest = request.delete;
export const patch = request.patch;

// 文件工具函数导出
export * from "./file-utils";

// 路由工具函数导出
export * from "./route-utils";

// 类型定义导出
export * from "./http-types";
export * from "./upload-types";

// 错误信息导出
export { ErrorMessageMap } from "./error-messages";
