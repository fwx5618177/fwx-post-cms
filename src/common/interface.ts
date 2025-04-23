import COS from "cos-js-sdk-v5";
import { LazyExoticComponent } from "react";

/**
 *  页面的配置表
 */
export interface RoutesPageI {
    key?: string;
    label?: string | JSX.Element;
    icon?: string | JSX.Element;
    itemIcon?: string | JSX.Element;
    outlet?: boolean;
    components?: string | LazyExoticComponent<React.FC<{}>> | any;
    path?: string;
    index?: boolean;
    children?: RoutesPageI[];
    theme?: "light" | "dark";
    caseSensitive?: boolean;
    menuShow?: boolean;
    lazy?: boolean;
}

/**
 * 路由表接口
 */
export interface RoutesConfI {
    index?: boolean;
    path: string;
    element: JSX.Element;
    caseSensitive?: boolean;
    children?: RoutesConfI[];
}

/**
 * 路由表结构
 */
export interface RouteTableI {
    title: string;
    key: string;
    icon: React.ReactNode;
    switcherIcon?: React.ReactNode;
    children?: RouteTableI[];
}

/**
 * request所需要的请求接口
 */

export interface IResponseData {
    code: number;
    msg: string;
    result: string[] | any;
    status: number;
    redirect?: string;
}

/**
 * OSS临时签证接口
 */
export interface IOSS {
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

/**
 * OSS验证数据接口
 */
export interface IOSSValidation {
    allowPrefix: string;
    username: string;
    password: string;
}

/**
 * upload return func
 */
export interface IUpload {
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

export interface PostCosConf {
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

export type BeforeUploadValueType = void | boolean | string | Blob | File;

// export type acceptUploadFileType = '*' | 'webp' | 'png'
export type uploadOSSDir = "upload" | "image" | "file" | "video";

export type uploadStyle = "click" | "dragger";
