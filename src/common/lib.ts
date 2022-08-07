/**
 * 封装的基础库
 */
import { IResponseData } from './interface'
import request from './request'
import crypt from 'crypto-js'

// 查询存在、修改
export const head = (uri: string) => request.head(uri)

export const get = (uri: string) => request.get(uri)

export const post = (uri: string, params: any): Promise<IResponseData> => request.post(uri, params)

// 更改请求
export const put = (uri: string, params: any) => request.put(uri, params)

// 删操作，不一定执行
export const deleteRequest = (uri: string) => request.delete(uri)

/**
 * 前端密码加密库
 */

export const encryptText = (text: string, salt = 'fwx') => {
    return crypt.AES.encrypt(text, salt).toString()
}

/**
 * 获取当前的key-path
 */
export const queryPathKey = (href: string): string => {
    const data = href.split('/')

    const key = data[data.length - 1]

    return key
}
