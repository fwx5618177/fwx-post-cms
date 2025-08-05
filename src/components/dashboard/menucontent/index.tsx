import React from "react";
import { Card, Col, Row, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
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
            <Card bordered={false} hoverable style={{ margin: 12 }}>
                <Row gutter={24} style={{ margin: 6 }}>
                    <Col span={12}>
                        <Switch
                            checkedChildren={
                                <>
                                    {t("menucontent.header.title.switch.text.add")}
                                    <CheckOutlined />
                                </>
                            }
                            unCheckedChildren={
                                <>
                                    {t("menucontent.header.title.switch.text.load")}
                                    <CheckOutlined />
                                </>
                            }
                            onChange={setLoadStatus}
                        />
                    </Col>
                </Row>

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
            </Card>

            <MarkdownPreview ref={showRef} />
        </>
    );
};

export default MenuContent;
