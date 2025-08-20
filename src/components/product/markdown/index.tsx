import { useTranslation } from "react-i18next";
import { queryPathKey } from "@/request";
import Instro from "@/components/instro";
import MarkdonwEditor from "./reactMarkdownEditorLite";

const MarkdownComponents = () => {
    const { t } = useTranslation();

    return (
        <>
            <h3
                style={{
                    margin: 0,
                    textAlign: "center",
                }}
            >
                Rich Text
            </h3>

            <Instro routeKey={queryPathKey(window.location.pathname)} />

            <h3
                style={{
                    margin: 12,
                }}
            >
                {t("markdown.title.react-markdown-editor-lite")}
            </h3>

            <div
                style={{ margin: 12, background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}
            >
                <MarkdonwEditor />
            </div>
        </>
    );
};

export default MarkdownComponents;
