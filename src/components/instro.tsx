// 移除 antd 依赖，使用轻量结构
import { useEffect, useRef, useState, useCallback } from "react";
import { Parser } from "marked";
import moment from "moment";
import { ContentDetail } from "@/types/content";
import api from "./api";

const Instro: React.FC<{ routeKey: string }> = ({ routeKey }) => {
    const showRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<ContentDetail | null>(null);

    const queryContent = useCallback(async () => {
        const result = await api.detail(routeKey);

        if (result && Array.isArray(result) && result.length > 0) {
            const data = result[0];

            if (showRef.current) {
                showRef.current.innerHTML = Parser.parse(data?.content);
            }

            setContent(data);
        } else {
            setContent(null);
        }
    }, [routeKey]);

    useEffect(() => {
        queryContent();
    }, [queryContent]);

    return (
        <div style={{ margin: 12, background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}>
            {content && (
                <header
                    style={{
                        margin: 6,
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Infos</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                        <div style={{ background: "#1c1d20", padding: 8, borderRadius: 4 }}>
                            <div style={{ color: "#9aa0a6" }}>Publish time</div>
                            <div>{moment(content?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
                        </div>
                        <div style={{ background: "#1c1d20", padding: 8, borderRadius: 4 }}>
                            <div style={{ color: "#9aa0a6" }}>Route key sname</div>
                            <div>{content?.routekeyname}</div>
                        </div>
                        <div style={{ background: "#1c1d20", padding: 8, borderRadius: 4 }}>
                            <div style={{ color: "#9aa0a6" }}>Title</div>
                            <div>{content?.title}</div>
                        </div>
                        <div style={{ background: "#1c1d20", padding: 8, borderRadius: 4 }}>
                            <div style={{ color: "#9aa0a6" }}>User name</div>
                            <div>{content?.username}</div>
                        </div>
                    </div>
                </header>
            )}
            <div ref={showRef}></div>
        </div>
    );
};

export default Instro;
