/**
 * API
 */

import { get, post, put } from "@/request/lib";

class api {
    static queryRouteList = params => post("/api/route/list", params);

    static createContent = params => put("/api/content/create", params);

    static list = () => get("/api/content/list");

    static detail = params => get(`/api/content/detail/${params}`);

    static updateContent = params => put(`/api/content/detail/${params?.title}`, params);
}

export default api;
