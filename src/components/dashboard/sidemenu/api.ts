/**
 * API
 */

import { post } from "@/request/lib";

class api {
    static createRoute = params => post("/api/route/createRoute", params);

    static queryRouteList = params => post("/api/route/list", params);

    static parentLists = params => post("/api/route/parentLists", params);
}

export default api;
