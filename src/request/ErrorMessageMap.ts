import { IErrorMessageMap } from "./IRequest";

// 错误信息映射
export const ErrorMessageMap: IErrorMessageMap = {
    200: "服务器成功返回请求数据",
    201: "新建或修改数据成功",
    202: "一个请求已经进入后台排队",
    204: "删除数据成功",
    400: "请求错误",
    401: "用户没有权限（令牌、用户名、密码错误）",
    403: "用户得到授权，但是访问是被禁止的",
    404: "请求的资源不存在",
    406: "请求的格式不可得",
    410: "请求的资源被永久删除",
    422: "验证错误",
    500: "服务器发生错误",
    502: "网关错误",
    503: "服务不可用",
    504: "网关超时",
};
