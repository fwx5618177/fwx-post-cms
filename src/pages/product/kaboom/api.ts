import { get } from 'src/common/lib'

class api {
    static queryMarioResource = params => get(`/api/kaboom/list/${params}`)
}

export default api
