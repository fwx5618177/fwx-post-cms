import { post } from "@/request/lib";

class api {
    static createData = params => post("/api/upload/list", params);
}

export default api;
