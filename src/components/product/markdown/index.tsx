import { Card } from "antd";
import { useTranslation } from "react-i18next";
import { queryPathKey } from "@/request/lib";
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

            <Card
                style={{
                    margin: 12,
                }}
            >
                <MarkdonwEditor />
            </Card>
        </>
    );
};

export default MarkdownComponents;
