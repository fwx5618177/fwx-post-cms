import { get, post } from "@/request/lib";

export default class api {
    static detail = params => get(`/api/content/detail/${params}`);

    static ossSignature = (params: { allowPrefix: string; username: string; password: string }) =>
        post("/api/sts/signature", params);
}
