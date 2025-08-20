import React from "react";
// 移除 antd 表单/布局，使用原生控件
import { useTranslation } from "react-i18next";
import { FormValues, SelectOption } from "./types";

const { Option } = Select;

interface ContentFormProps {
    routeList: SelectOption[];
    onFinish: (values: FormValues) => Promise<void>;
    onFinishFailed: (errorInfo: {
        values: FormValues;
        errorFields: Array<{ name: string[]; errors: string[] }>;
        outOfDate: boolean;
    }) => void;
    onReset: () => void;
    onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
    routeList,
    onFinish,
    onFinishFailed,
    onReset,
    onContentChange,
}) => {
    const formRef = React.useRef<HTMLFormElement | null>(null);
    const { t } = useTranslation();

    const layout = {};

    return (
        <form
            ref={formRef}
            onSubmit={async e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("name") || "");
                const title = String(fd.get("title") || "");
                const content = String(fd.get("content") || "");
                if (!name || !title || !content) {
                    onFinishFailed({
                        values: { name, title, content },
                        errorFields: [],
                        outOfDate: false,
                    } as any);
                    return;
                }
                await onFinish({ name, title, content });
            }}
        >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                    <label>{t("menucontent.name.form.label")}</label>
                    <select name="name" defaultValue="" style={{ width: "100%" }}>
                        <option value="" disabled>
                            {t("menucontent.name.form.select.text")}
                        </option>
                        {routeList?.map((item, index) => (
                            <option key={index + "_routeList"} value={String(item.value)}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>{t("menucontent.name.form.title")}</label>
                    <input name="title" placeholder={t("menucontent.name.form.title.text") || ""} />
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
                <label>{t("menucontent.name.form.content")}</label>
                <textarea
                    name="content"
                    rows={6}
                    onChange={onContentChange}
                    placeholder={t("menucontent.name.form.content.text") || ""}
                    style={{ width: "100%" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                <button type="submit">{t("button.submit")}</button>
                <button type="button" style={{ marginLeft: 8 }} onClick={onReset}>
                    {t("button.reset")}
                </button>
            </div>
        </form>
    );
};
