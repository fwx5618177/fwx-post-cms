import { post } from "src/common/lib";

class api {
    static createData = params => post("/api/upload/list", params);
}

export default api;
