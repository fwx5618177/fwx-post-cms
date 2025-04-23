import { Card, Descriptions } from "antd";
import { useEffect, useRef, useState, useCallback } from "react";
import { Parser } from "marked";
import moment from "moment";
import api from "./api";

const Instro: React.FC<{ routeKey: string }> = ({ routeKey }) => {
    const showRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<any>(null);

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
        <Card
            style={{
                margin: 12,
            }}
        >
            {content && (
                <header
                    style={{
                        margin: 6,
                    }}
                >
                    <Descriptions title="Infos" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                        <Descriptions.Item label="Publish time">
                            {moment(content?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Route key sname">{content?.routekeyname}</Descriptions.Item>
                        <Descriptions.Item label="Title">{content?.title}</Descriptions.Item>
                        <Descriptions.Item label="User name">{content?.username}</Descriptions.Item>
                    </Descriptions>
                </header>
            )}
            <div ref={showRef}></div>
        </Card>
    );
};

export default Instro;
