import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RiSettings3Line } from "react-icons/ri";
import styles from "@/styles/pages/sidemenu.module.scss";
import "./style.css";
import { confRouteLevel } from "./conf";
import api from "./api";

// 占位：无 antd 环境下的本地数据
const bgLayoutSet = () => [{ label: "默认", value: "default" }];
const routeTable = () => [] as Array<{ key: string; title: string; children?: any[] }>;

interface OptionItem {
    label: string;
    value: string | number;
}

const SideMenu: React.FC = () => {
    const { t } = useTranslation();
    const [bgSortsStatus, setBgSortsStatus] = useState(true);
    const [outletSet, _setOutletSet] = useState(true);
    const [routeLevel, setRouteLevel] = useState(0);
    const [parentRouteList, setParentRouteList] = useState<OptionItem[]>([]);

    const [menushow, setMenushow] = useState("");
    const [parentVal, setParentVal] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [labelInput, setLabelInput] = useState("");
    const [pathInput, setPathInput] = useState("");
    const [outletVal, setOutletVal] = useState(true);
    const [casesensitiveVal, setCasesensitiveVal] = useState(false);

    const onFinish = async (values: {
        menushow: string;
        pageLevel: number;
        key: string;
        label: string;
        path: string;
        outlet: boolean;
        casesensitive: boolean;
        parent?: string | number;
    }) => {
        const result = await api.createRoute(values as any);
        if (result && Array.isArray(result) && result.length > 0) {
            // eslint-disable-next-line no-console
            console.info("添加成功!");
        }
    };

    const queryParentRoutes = useCallback(async () => {
        const result = await api.parentLists({ parent: routeLevel - 1 });
        if (result && Array.isArray(result) && result.length > 0) {
            const data: OptionItem[] = result.map((ci: any) => ({ label: ci?.name, value: ci?.key }));
            setParentRouteList(data);
        } else {
            setParentRouteList([]);
        }
    }, [routeLevel]);

    useEffect(() => {
        queryParentRoutes();
    }, [queryParentRoutes]);

    return (
        <div className={styles.container}>
            <header className="SideMenu_header">
                <span></span>
                <h3>{t("sidemenu")}</h3>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div
                    style={{
                        margin: 12,
                        background: "#232428",
                        border: "1px solid #36373a",
                        borderRadius: 6,
                        padding: 12,
                        height: 600,
                        overflowY: "auto",
                    }}
                >
                    <div className="route_conf_card_title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <RiSettings3Line />
                        <h3 style={{ textAlign: "center" }}>{t("routecard.text")}</h3>
                    </div>
                    <form
                        onSubmit={async e => {
                            e.preventDefault();
                            await onFinish({
                                menushow,
                                pageLevel: routeLevel,
                                key: keyInput,
                                label: labelInput,
                                path: pathInput,
                                outlet: outletVal,
                                casesensitive: casesensitiveVal,
                                parent: parentVal || undefined,
                            });
                        }}
                    >
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routebgshowstatus")}</label>
                            <input
                                type="checkbox"
                                checked={bgSortsStatus}
                                onChange={e => setBgSortsStatus(e.target.checked)}
                            />
                        </div>
                        {bgSortsStatus && (
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ marginRight: 8 }}>{t("routemenushow")}</label>
                                <select value={menushow} onChange={e => setMenushow(e.target.value)}>
                                    <option value="" disabled>
                                        Select
                                    </option>
                                    {bgLayoutSet().map((ci: OptionItem, index: number) => (
                                        <option key={index + "_bglayout"} value={String(ci.value)}>
                                            {ci.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routepagelevel")}</label>
                            <select value={routeLevel} onChange={e => setRouteLevel(Number(e.target.value))}>
                                <option value={0}>Select</option>
                                {confRouteLevel.map((ci: any, index: number) => (
                                    <option key={index + "_confRoute"} value={ci.value}>
                                        {ci.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {routeLevel !== 0 && (
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ marginRight: 8 }}>{t("routepageParent")}</label>
                                <select value={parentVal} onChange={e => setParentVal(e.target.value)}>
                                    <option value="" disabled>
                                        Select
                                    </option>
                                    {parentRouteList.map((ci: OptionItem, index: number) => (
                                        <option key={index + "_confRoute"} value={String(ci.value)}>
                                            {ci.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routekey")}</label>
                            <input value={keyInput} onChange={e => setKeyInput(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routelabel")}</label>
                            <input value={labelInput} onChange={e => setLabelInput(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routepath")}</label>
                            <input value={pathInput} onChange={e => setPathInput(e.target.value)} />
                        </div>
                        {outletSet && (
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ marginRight: 8 }}>{t("routeoutlet")}</label>
                                <label style={{ marginRight: 8 }}>
                                    <input
                                        type="radio"
                                        name="outlet"
                                        checked={outletVal}
                                        onChange={() => setOutletVal(true)}
                                    />
                                    {t("routeoutlet.text.radio.status.start")}
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="outlet"
                                        checked={!outletVal}
                                        onChange={() => setOutletVal(false)}
                                    />
                                    {t("routeoutlet.text.radio.status.close")}
                                </label>
                            </div>
                        )}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ marginRight: 8 }}>{t("routecasesensitive")}</label>
                            <label style={{ marginRight: 8 }}>
                                <input
                                    type="radio"
                                    name="casesensitive"
                                    checked={casesensitiveVal}
                                    onChange={() => setCasesensitiveVal(true)}
                                />
                                {t("routecasesensitive.radio.status.start")}
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="casesensitive"
                                    checked={!casesensitiveVal}
                                    onChange={() => setCasesensitiveVal(false)}
                                />
                                {t("routecasesensitive.radio.status.close")}
                            </label>
                        </div>
                        <div>
                            <button type="submit">{t("button.submit")}</button>
                            <button
                                type="button"
                                style={{ marginLeft: 8 }}
                                onClick={() => {
                                    setMenushow("");
                                    setParentVal("");
                                    setKeyInput("");
                                    setLabelInput("");
                                    setPathInput("");
                                    setOutletVal(true);
                                    setCasesensitiveVal(false);
                                }}
                            >
                                {t("button.reset")}
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    style={{
                        margin: 12,
                        background: "#232428",
                        border: "1px solid #36373a",
                        borderRadius: 6,
                        padding: 12,
                        minHeight: 600,
                    }}
                >
                    <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 8 }}>
                        {t("routetable.treedata")}
                    </div>
                    <div style={{ maxHeight: 500, overflow: "auto" }}>
                        {(() => {
                            const data = routeTable();
                            const renderNode = (node: any) => (
                                <li key={node.key} style={{ padding: "4px 0" }}>
                                    <span>{typeof node.title === "string" ? node.title : node.key}</span>
                                    {Array.isArray(node.children) && node.children.length > 0 && (
                                        <ul style={{ paddingLeft: 16, listStyle: "circle" }}>
                                            {node.children.map((child: any) => renderNode(child))}
                                        </ul>
                                    )}
                                </li>
                            );
                            return <ul style={{ listStyle: "disc", paddingLeft: 16 }}>{data.map(renderNode)}</ul>;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
