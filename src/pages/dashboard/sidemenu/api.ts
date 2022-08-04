/**
 * API
 */

import { post } from 'src/common/lib'

class api {
    static createRoute = params => post('/api/route/createRoute', params)
}

export default api
