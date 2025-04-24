import { post } from "@/request/lib";

export default class api {
    static look = params => post("/api/sourcelook/sourcecode", params);
}
