/**
 * API
 */

import { post } from 'src/common/lib'

class api {
    static queryRouteList = params => post('/api/route/list', params)
}

export default api
