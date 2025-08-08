import { request } from "@request/request";

const { get, post } = request;

export default class api {
    static detail = (params: { id: string }) => get(`/api/content/detail/${params.id}`);

    static ossSignature = (params: { allowPrefix: string; username: string; password: string }) =>
        post("/api/sts/signature", params);
}
