/**
 * 封装的基础库
 */
import request from "./request";
import crypt from "crypto-js";
import { RcFile } from "antd/lib/upload";

// 查询存在、修改
export const head = (uri: string) => request.head(uri);

export const get = (uri: string): any => request.get(uri);

export const post = (uri: string, params: any) => request.post(uri, params);

// 更改请求
export const put = (uri: string, params: any) => request.put(uri, params);

// 删操作，不一定执行
export const deleteRequest = (uri: string) => request.delete(uri);

/**
 * 前端密码加密库
 */

export const encryptText = (text: string, salt = "fwx") => {
    return crypt.AES.encrypt(text, salt).toString();
};

/**
 * 获取当前的key-path
 */
export const queryPathKey = (href: string): string => {
    const data = href.split("/");

    const key = data[data.length - 1];

    return key;
};

/**
 * 校验时间
 */
export const detectExpired = (startTime: number, endTime: number): boolean => {
    const now = +new Date();
    const distance = (endTime - startTime) / 2;

    if (now >= endTime * 1000) {
        return false;
    }

    if (now > distance * 1000) {
        return false;
    }

    return true;
};

/**
 * 获取文件的base64
 * @param file 上传回调的文件
 * @returns {Promise<string>} 回调的结果
 */
export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
