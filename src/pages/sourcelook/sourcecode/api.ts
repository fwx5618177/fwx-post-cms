import { post } from 'src/common/lib'

export default class api {
    static look = params => post('/api/sourcelook/sourcecode', params)
}
