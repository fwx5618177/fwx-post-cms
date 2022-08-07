/**
 * API
 */

import { post } from 'src/common/lib'

class api {
    static createRoute = params => post('/api/route/createRoute', params)

    static queryRouteList = params => post('/api/route/list', params)

    static parentLists = params => post('/api/route/parentLists', params)
}

export default api
