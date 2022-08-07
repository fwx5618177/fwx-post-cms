import { get } from 'src/common/lib'

export default class api {
    static detail = params => get(`/api/content/detail/${params}`)
}
