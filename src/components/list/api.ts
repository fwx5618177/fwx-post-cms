import { deleteRequest, get, post, put } from "src/common/lib";

export default class api {
    static list = () => get("/api/todo/list");
    static queryId = params => get(`/api/todo/list/${params}`);
    static create = params => post(`/api/todo/list/`, params);
    static update = (id, params) => put(`/api/todo/list/${id}`, params);
    static deleteData = id => deleteRequest(`/api/todo/list/${id}`);
}
