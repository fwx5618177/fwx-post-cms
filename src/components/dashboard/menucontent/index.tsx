import React from "react";
import { useTranslation } from "react-i18next";
import { useMenuContent } from "./useMenuContent";
import { ContentForm } from "./ContentForm";
import { UpdateForm } from "./UpdateForm";
import { MarkdownPreview } from "./MarkdownPreview";

const MenuContent: React.FC = () => {
    const { t } = useTranslation();
    const {
        showRef,
        routeList,
        versions,
        loadStatus,
        detailInfos,
        setLoadStatus,
        handleMarkdownChange,
        handleFormSubmit,
        handleFormSubmitFailed,
        handleDetailInfo,
        handleUpdate,
        handleReset,
    } = useMenuContent();

    return (
        <>
            <h3 style={{ margin: 12 }}>{t("menucontent.header.title.add")}</h3>
            <div
                style={{ margin: 12, background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}
            >
                <div style={{ margin: 6 }}>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" onChange={e => setLoadStatus(e.target.checked)} />
                        <span>
                            {t("menucontent.header.title.switch.text.add")} /{" "}
                            {t("menucontent.header.title.switch.text.load")}
                        </span>
                    </label>
                </div>

                {loadStatus ? (
                    <ContentForm
                        routeList={routeList}
                        onFinish={handleFormSubmit}
                        onFinishFailed={handleFormSubmitFailed}
                        onReset={handleReset}
                        onContentChange={handleMarkdownChange}
                    />
                ) : (
                    <UpdateForm
                        versions={versions}
                        detailInfo={detailInfos}
                        onUpdate={handleUpdate}
                        onVersionSelect={handleDetailInfo}
                        onContentChange={handleMarkdownChange}
                        onReset={handleReset}
                    />
                )}
            </div>

            <MarkdownPreview ref={showRef} />
        </>
    );
};

export default MenuContent;
