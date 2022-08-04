/**
 * baseUrl的设置
 */

enum TYPE_ENUM {
    TEST = 'test',
    UAT = 'uat',
    PROD = 'prod',
}

const localUrl = 'http://localhost:3001'
const uatUrl = ''
const prodUrl = ''

const baseurl_env = 'test'

export const baseAPI = (type = baseurl_env) => {
    switch (type.toLowerCase()) {
        case TYPE_ENUM.TEST:
            return localUrl
        case TYPE_ENUM.UAT:
            return uatUrl
        case TYPE_ENUM.PROD:
            return prodUrl
        default:
            return localUrl
    }
}
