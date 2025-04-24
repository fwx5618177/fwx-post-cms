import { get } from "src/common/lib";

class api {
    static queryMarioResource = params => get(`/api/model/list/${params}`);
}

export default api;
