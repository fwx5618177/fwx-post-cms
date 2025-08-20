import { RiArrowRightLine } from "react-icons/ri";
// 移除 antd：保留类型与逻辑结构，简化为原生元素
import React from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import api from "./api";
import styles from "@/styles/pages/todoist.module.scss";

interface Performance {
    title: string;
    time: string;
    id: number;
}

const ListCard = () => {
    const [form] = ((): any => ({
        setFieldsValue: (_: any) => undefined,
    }))();
    const [todoLists, setTodoLists] = useState<Performance[]>([]);

    interface TodoFormValues {
        briefTitle: string;
        detailInfos: string;
    }

    const onFinish = async (value: TodoFormValues) => {
        const { briefTitle, detailInfos } = value;

        const result = await api.create({
            brief: briefTitle,
            detail: detailInfos,
        });

        if (result && Array.isArray(result) && result.length > 0) {
            // eslint-disable-next-line no-console
            console.info("新增成功");
            queryList();
        }
    };

    const queryList = async () => {
        const result = await api.list();

        if (result && Array.isArray(result) && result.length > 0) {
            const data: Performance[] = result?.map(ci => ({ title: ci?.brief, time: ci?.createdAt, id: ci?.id }));
            setTodoLists(data);
        } else {
            setTodoLists([]);
        }
    };

    const handleDetail = async (e: { target: { value: string } }) => {
        const brief = e?.target?.value;

        const result = await api.queryId(brief);

        if (result && Array.isArray(result) && result.length > 0) {
            const data = result[0];
            const { brief: briefTitle, detail: detailInfos } = data;
            form.setFieldsValue({
                briefTitle,
                detailInfos,
            });
        }
    };

    useEffect(() => {
        queryList();
    }, []);

    return (
        <div className={styles.container}>
            <h3
                style={{
                    margin: 12,
                }}
            >
                Todoist
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: 12 }}>
                <div className={styles.card}>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            const fd = new FormData(e.currentTarget);
                            onFinish({
                                briefTitle: String(fd.get("briefTitle") || ""),
                                detailInfos: String(fd.get("detailInfos") || ""),
                            });
                        }}
                    >
                        <div className={styles.formItem}>
                            <label>title</label>
                            <div className={styles.inputWrap}>
                                <input name="briefTitle" placeholder="Input todoist" />
                                <RiArrowRightLine />
                            </div>
                        </div>
                        <div className={styles.formItem}>
                            <label>detail</label>
                            <textarea name="detailInfos" rows={10} placeholder="Input detail information" />
                        </div>
                        <div>
                            <button type="submit" className={styles.primaryBtn}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                <div className={styles.card} style={{ height: 400, overflowY: "auto" }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Todo Lists</div>
                    <div>
                        {todoLists.map(item => (
                            <label key={item.id} style={{ display: "block", padding: "6px 0" }}>
                                <input type="radio" name="todoSelect" value={item.title} onChange={handleDetail} />
                                <span style={{ marginLeft: 8 }}>
                                    {moment(item?.time).format("YYYY-MM-DD HH:mm:ss")}: {item?.title}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
