/**
 * request, post请求库
 */

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { message } from 'antd'
import { baseAPI } from './baseURL'
import { IResponseData } from './interface'

// post header
const request = axios.create({
    baseURL: baseAPI(),
    timeout: 20000,
    timeoutErrorMessage: 'timeout...',
    withCredentials: true,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    maxRedirects: 5,
})

request.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = (config.headers as AxiosRequestHeaders).Authorization

        console.log('token:', token)

        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// msg code
const msgList: {
    [key: number]: string
} = {
    2888: '成功',
    9999: '错误',
    3333: '重定向',
}

// interceptors
request.interceptors.response.use(
    response => {
        console.log(response, response.request.responseURL, response.data.code)
        const resData: IResponseData = response.data
        const redirect: string = resData?.redirect as string
        if (response.status === 200) {
            if (resData.code === 3333) {
                setTimeout(() => {
                    window.location.href = redirect
                }, 10000)
            }

            return Promise.resolve(resData)
        } else return Promise.reject(response)
    },
    error => {
        // handle error status code
        if (error.response.data.code in msgList) {
            message.warning(error.response.data.msg || msgList[error.response.data.code])
        }

        return Promise.reject(error)
    },
)

export default request
