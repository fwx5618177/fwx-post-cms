import { get } from "@/request/lib";

class api {
    static queryMarioResource = params => get(`/api/model/list/${params}`);
}

export default api;
