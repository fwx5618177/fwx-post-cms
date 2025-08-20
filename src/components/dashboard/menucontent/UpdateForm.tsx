import React from "react";
// 移除 antd 表单/布局
import { useTranslation } from "react-i18next";
import moment from "moment";
import { UpdateFormValues, SelectOption, ContentItem } from "./types";

// const { Option } = Select; // Unused import

interface UpdateFormProps {
    versions: SelectOption[];
    detailInfo: ContentItem | null;
    onUpdate: (values: UpdateFormValues) => Promise<void>;
    onVersionSelect: (title: string) => Promise<void>;
    onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onReset: () => void;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({
    versions,
    detailInfo,
    onUpdate,
    onVersionSelect,
    onContentChange,
    onReset,
}) => {
    const formRef = React.useRef<HTMLFormElement | null>(null);
    const { t } = useTranslation();

    return (
        <form
            ref={formRef}
            onSubmit={async e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const title = String(fd.get("title") || "");
                const updateContent = String(fd.get("updateContent") || "");
                await onUpdate({ title, updateContent });
            }}
        >
            <div style={{ marginBottom: 12 }}>
                <label>Title</label>
                <select
                    name="title"
                    defaultValue=""
                    onChange={e => onVersionSelect(e.target.value)}
                    style={{ width: 300, display: "block" }}
                >
                    <option value="" disabled>
                        {t("menucontent.header.title.switch.text.load.select")}
                    </option>
                    {versions?.map((item, index) => (
                        <option key={index + "_versions"} value={String(item.value)}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Text</label>
                <textarea
                    name="updateContent"
                    rows={6}
                    onChange={onContentChange}
                    placeholder={t("menucontent.name.form.content.text") || ""}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <button type="submit">{t("button.submit")}</button>
                <button type="button" style={{ marginLeft: 8 }} onClick={onReset}>
                    {t("button.reset")}
                </button>
            </div>

            {detailInfo && (
                <div style={{ background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Versions</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                        <div>
                            <div style={{ color: "#9aa0a6" }}>title</div>
                            <div>{detailInfo.title}</div>
                        </div>
                        <div>
                            <div style={{ color: "#9aa0a6" }}>time</div>
                            <div>{moment(detailInfo.createdAt).format("YYYY-MM-DD hh:mm:ss")}</div>
                        </div>
                        <div>
                            <div style={{ color: "#9aa0a6" }}>routekeyname</div>
                            <div>{detailInfo.routekeyname}</div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};
