import React from "react";
import { ArrowUpOutlined, LikeOutlined } from "@ant-design/icons";
import { Card, Col, Row, Avatar, Statistic } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import styles from "@/styles/pages/main.module.scss";

const { Meta } = Card;

const MainPage: React.FC = () => {
    const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

    return (
        <div className={styles.container}>
            <section>
                <h3>数据统计</h3>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card style={{ marginTop: 16 }}>
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card style={{ marginTop: 16 }}>
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card style={{ marginTop: 16 }}>
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </Card>
                    </Col>
                </Row>
            </section>

            <section
                style={{
                    marginTop: 8,
                }}
            >
                <h3>服务</h3>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card
                            bordered={false}
                            bodyStyle={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignContent: "space-around",
                            }}
                        >
                            <Statistic
                                title="Active"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: "#3f8600" }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"
                            />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card bordered={false}>
                            <Countdown title="Million Seconds" value={deadline} format="HH:mm:ss:SSS" />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card bordered={false}>
                            <Countdown title="Day Level" value={deadline} format="D 天 H 时 m 分 s 秒" />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
                        </Card>
                    </Col>
                </Row>
            </section>
        </div>
    );
};

export default MainPage;
