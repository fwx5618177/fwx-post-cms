import React, { useRef, useState } from "react";
import { Dropdown } from "../components/Dropdown";
import type { DropdownGroup, DropdownMenuItem, DropdownSize, DropdownPlacement } from "../components/Dropdown/types";
import styles from "../styles/dropdown-demo.module.scss";

const placements: DropdownPlacement[] = ["bottomLeft", "bottomRight", "topLeft", "topRight", "left", "right"];
const sizes: DropdownSize[] = ["small", "medium", "large"];

const demoItems: DropdownMenuItem[] = [
    { key: "item1", label: "普通项" },
    { key: "item2", label: "禁用项", disabled: true },
    {
        key: "item3",
        label: "带图标",
        icon: (
            <span role="img" aria-label="star">
                ⭐
            </span>
        ),
    },
    { key: "item4", label: "快捷键", shortcut: "⌘S" },
    {
        key: "item5",
        label: "多级菜单",
        children: [
            { key: "sub1", label: "子项1" },
            { key: "sub2", label: "子项2" },
        ],
    },
    { type: "divider" },
    {
        label: "分组示例",
        items: [
            { key: "g1", label: "分组项1" },
            { key: "g2", label: "分组项2" },
        ],
    } as DropdownGroup,
];

const propList = [
    ["open", "是否可见"],
    [
        "anchorEl",
        "依附的锚点元素（优先级高于 position）。若 anchorEl 存在，则 placement 决定弹出方向，Dropdown 会自动根据 anchorEl+placement 计算位置。若同时传入 position，则 position 生效，anchorEl/placement 被覆盖（即 position 优先级最高）。典型用法：按钮、输入框等元素的下拉菜单。",
    ],
    [
        "position",
        "绝对定位坐标（如 contextMenu）。若传入 position，则 anchorEl/placement 均不生效，直接用 position 定位。典型用法：右键菜单、全局弹出。",
    ],
    ["items", "菜单项/分组/分割线/多级菜单，支持 DropdownItem、DropdownGroup、DropdownDivider。"],
    ["onSelect", "选中回调，仅对 DropdownItem 有效。"],
    ["onClose", "关闭回调，Dropdown 关闭时触发。"],
    ["size", "尺寸 small/medium/large。"],
    ["maxHeight", "最大高度。"],
    ["className", "自定义 className。"],
    ["style", "自定义 style。"],
    ["dropdownRef", "ref 透传，可获取 Dropdown DOM。"],
    [
        "placement",
        "弹出方向，仅在 anchorEl 存在时生效，决定下拉菜单相对 anchorEl 的方向。若传入 position，则 placement 不生效。",
    ],
    ["autoFocus", "是否自动聚焦，弹出后自动 focus 到下拉框。"],
    ["showArrow", "是否显示箭头。"],
    [
        "destroyPopupOnHide",
        "隐藏时是否销毁内容。true 时关闭后 DOM 彻底移除，false 时仅隐藏。destroyPopupOnHide=true 时，关闭动画结束后销毁内容。",
    ],
    ["animation", "自定义动画 className。若传入 animation，则覆盖默认的 fadeIn/fadeOut 动画。"],
    ["menuType", "菜单类型（普通下拉/右键菜单）。contextMenu 时样式更紧凑、圆角更小、阴影更深。"],
    ["children", "子节点（已废弃/不推荐）。"],
];

export default function DropdownDemo() {
    // open 状态分别管理，保证每个属性都能独立演示
    // 为每个section的Dropdown分别管理placement/size/maxHeight等状态，防止复用
    const [openPlacement, setOpenPlacement] = useState(false);
    const [placementPlacement, setPlacementPlacement] = useState<DropdownPlacement>("bottomLeft");
    const btnRefPlacement = useRef<HTMLButtonElement>(null);

    const [openSize, setOpenSize] = useState(false);
    const [sizeSize, setSizeSize] = useState<DropdownSize>("medium");
    const btnRefSize = useRef<HTMLButtonElement>(null);

    const [openMaxHeight, setOpenMaxHeight] = useState(false);
    const [maxHeightMaxHeight, setMaxHeightMaxHeight] = useState<number>(180);
    const btnRefMaxHeight = useRef<HTMLButtonElement>(null);

    const [openGroup, setOpenGroup] = useState(false);
    const btnRefGroup = useRef<HTMLButtonElement>(null);

    const [openAll, setOpenAll] = useState(false);
    const btnRefAll = useRef<HTMLButtonElement>(null);
    const [selected, setSelected] = useState<string>("");

    // 右键菜单/绝对定位
    const [posDropdown, setPosDropdown] = useState<{ open: boolean; x: number; y: number }>({
        open: false,
        x: 0,
        y: 0,
    });
    const [openMenuType, setOpenMenuType] = useState(false);

    // className/style
    const [openClass, setOpenClass] = useState(false);
    const btnRefClass = useRef<HTMLButtonElement>(null);

    // autoFocus
    const [openAutoFocus, setOpenAutoFocus] = useState(false);
    const btnRefAutoFocus = useRef<HTMLButtonElement>(null);

    // showArrow
    const [openArrow, setOpenArrow] = useState(false);
    const btnRefArrow = useRef<HTMLButtonElement>(null);

    // destroyPopupOnHide
    const [openDestroy, setOpenDestroy] = useState(false);
    const btnRefDestroy = useRef<HTMLButtonElement>(null);

    // animation
    const [openAnim, setOpenAnim] = useState(false);
    const btnRefAnim = useRef<HTMLButtonElement>(null);

    // dropdownRef
    const [openRef, setOpenRef] = useState(false);
    const btnRefDropdown = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownRect, setDropdownRect] = useState<{ width: number; height: number } | null>(null);

    return (
        <div className={styles.dropdownDemo}>
            <h2 className={styles["dropdownDemo-title"]}>Dropdown 组件属性演示</h2>
            <table className={styles["dropdownDemo-table"]}>
                <thead>
                    <tr>
                        <th>属性</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
                    {propList.map(([name, desc]) => (
                        <tr key={name}>
                            <td>
                                <span className={styles["dropdownDemo-value"]}>{name}</span>
                            </td>
                            <td>{desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* open/placement */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>open/placement</h3>
                <div className={styles["dropdownDemo-row"]}>
                    {placements.map(p => (
                        <button
                            key={p}
                            className={placementPlacement === p ? styles["dropdownDemo-active"] : ""}
                            onClick={() => setPlacementPlacement(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button
                    ref={btnRefPlacement}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenPlacement(v => !v)}
                >
                    打开 Dropdown
                </button>
                <Dropdown
                    open={openPlacement}
                    anchorEl={btnRefPlacement.current}
                    items={demoItems}
                    onSelect={() => setOpenPlacement(false)}
                    onClose={() => setOpenPlacement(false)}
                    placement={placementPlacement}
                    size={"medium"}
                    maxHeight={200}
                />
            </section>
            {/* position 绝对定位/右键菜单 */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>position（右键菜单/绝对定位）</h3>
                <div style={{ color: "#adb5bd", marginBottom: 8 }}>在下方区域右键弹出菜单</div>
                <div
                    style={{
                        height: 80,
                        background: "#232428",
                        border: "1px dashed #444",
                        borderRadius: 6,
                        cursor: "context-menu",
                    }}
                    onContextMenu={e => {
                        e.preventDefault();
                        setPosDropdown({ open: true, x: e.clientX, y: e.clientY });
                    }}
                >
                    <span style={{ color: "#ffd666", lineHeight: "80px", paddingLeft: 16 }}>右键这里</span>
                </div>
                <Dropdown
                    open={posDropdown.open}
                    position={{ x: posDropdown.x, y: posDropdown.y }}
                    items={demoItems}
                    onSelect={() => setPosDropdown(v => ({ ...v, open: false }))}
                    onClose={() => setPosDropdown(v => ({ ...v, open: false }))}
                    menuType="contextMenu"
                />
            </section>
            {/* size */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>size</h3>
                <div className={styles["dropdownDemo-row"]}>
                    {sizes.map(s => (
                        <button
                            key={s}
                            className={sizeSize === s ? styles["dropdownDemo-active"] : ""}
                            onClick={() => setSizeSize(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <button
                    ref={btnRefSize}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenSize(v => !v)}
                >
                    打开 Dropdown
                </button>
                <Dropdown
                    open={openSize}
                    anchorEl={btnRefSize.current}
                    items={demoItems}
                    onSelect={() => setOpenSize(false)}
                    onClose={() => setOpenSize(false)}
                    placement={"bottomLeft"}
                    size={sizeSize}
                    maxHeight={180}
                />
            </section>
            {/* maxHeight */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>maxHeight</h3>
                <div className={styles["dropdownDemo-row"]}>
                    <input
                        type="range"
                        min={100}
                        max={400}
                        value={maxHeightMaxHeight}
                        onChange={e => setMaxHeightMaxHeight(Number(e.target.value))}
                        style={{ width: 120 }}
                    />
                    <span style={{ color: "#ffd666", marginLeft: 8 }}>{maxHeightMaxHeight}px</span>
                </div>
                <button
                    ref={btnRefMaxHeight}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenMaxHeight(v => !v)}
                >
                    打开 Dropdown
                </button>
                <Dropdown
                    open={openMaxHeight}
                    anchorEl={btnRefMaxHeight.current}
                    items={demoItems}
                    onSelect={() => setOpenMaxHeight(false)}
                    onClose={() => setOpenMaxHeight(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={maxHeightMaxHeight}
                />
            </section>
            {/* items（分组/分割线/多级菜单） */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>items（分组/分割线/多级菜单）</h3>
                <button
                    ref={btnRefGroup}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenGroup(v => !v)}
                >
                    打开 Dropdown
                </button>
                <Dropdown
                    open={openGroup}
                    anchorEl={btnRefGroup.current}
                    items={demoItems}
                    onSelect={() => setOpenGroup(false)}
                    onClose={() => setOpenGroup(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                />
            </section>
            {/* className/style */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>className/style</h3>
                <button
                    ref={btnRefClass}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenClass(v => !v)}
                >
                    打开自定义样式 Dropdown
                </button>
                <Dropdown
                    open={openClass}
                    anchorEl={btnRefClass.current}
                    items={demoItems}
                    onSelect={() => setOpenClass(false)}
                    onClose={() => setOpenClass(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    className={styles["dropdownDemo-custom"]}
                    style={{ border: "2px solid #ffd666", boxShadow: "0 0 16px #ffd66655" }}
                />
                <div style={{ color: "#adb5bd", marginTop: 8 }}>自定义 className/style：金色描边+阴影</div>
            </section>
            {/* autoFocus */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>autoFocus</h3>
                <button
                    ref={btnRefAutoFocus}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenAutoFocus(v => !v)}
                >
                    打开自动聚焦 Dropdown
                </button>
                <Dropdown
                    open={openAutoFocus}
                    anchorEl={btnRefAutoFocus.current}
                    items={demoItems}
                    onSelect={() => setOpenAutoFocus(false)}
                    onClose={() => setOpenAutoFocus(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    autoFocus
                />
                <div style={{ color: "#adb5bd", marginTop: 8 }}>弹出后自动聚焦，可直接键盘上下选择</div>
            </section>
            {/* showArrow */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>showArrow</h3>
                <button
                    ref={btnRefArrow}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenArrow(v => !v)}
                >
                    打开带箭头 Dropdown
                </button>
                <Dropdown
                    open={openArrow}
                    anchorEl={btnRefArrow.current}
                    items={demoItems}
                    onSelect={() => setOpenArrow(false)}
                    onClose={() => setOpenArrow(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    showArrow
                />
            </section>
            {/* destroyPopupOnHide */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>destroyPopupOnHide</h3>
                <button
                    ref={btnRefDestroy}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenDestroy(v => !v)}
                >
                    打开 Dropdown（关闭后销毁）
                </button>
                <Dropdown
                    open={openDestroy}
                    anchorEl={btnRefDestroy.current}
                    items={demoItems}
                    onSelect={() => setOpenDestroy(false)}
                    onClose={() => setOpenDestroy(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    destroyPopupOnHide
                />
                <div style={{ color: "#adb5bd", marginTop: 8 }}>关闭后 DOM 会被销毁</div>
            </section>
            {/* animation */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>animation</h3>
                <button
                    ref={btnRefAnim}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenAnim(v => !v)}
                >
                    打开自定义动画 Dropdown
                </button>
                <Dropdown
                    open={openAnim}
                    anchorEl={btnRefAnim.current}
                    items={demoItems}
                    onSelect={() => setOpenAnim(false)}
                    onClose={() => setOpenAnim(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    animation={styles["dropdownDemo-fadeIn"]}
                />
                <style>{`
                .${styles["dropdownDemo-fadeIn"]} {
                    animation: dropdownDemoFadeIn 0.5s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes dropdownDemoFadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}</style>
                <div style={{ color: "#adb5bd", marginTop: 8 }}>自定义动画：放大淡入</div>
            </section>
            {/* menuType contextMenu */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>menuType（contextMenu）</h3>
                <div style={{ color: "#adb5bd", marginBottom: 8 }}>右键下方区域弹出 contextMenu 风格</div>
                <div
                    style={{
                        height: 80,
                        background: "#232428",
                        border: "1px dashed #444",
                        borderRadius: 6,
                        cursor: "context-menu",
                    }}
                    onContextMenu={e => {
                        e.preventDefault();
                        setOpenMenuType(true);
                        setPosDropdown({ open: false, x: 0, y: 0 });
                        setTimeout(() => setPosDropdown({ open: true, x: e.clientX, y: e.clientY }), 10);
                    }}
                >
                    <span style={{ color: "#ffd666", lineHeight: "80px", paddingLeft: 16 }}>右键这里</span>
                </div>
                <Dropdown
                    open={posDropdown.open && openMenuType}
                    position={{ x: posDropdown.x, y: posDropdown.y }}
                    items={demoItems}
                    onSelect={() => setOpenMenuType(false)}
                    onClose={() => setOpenMenuType(false)}
                    menuType="contextMenu"
                />
                <div style={{ color: "#adb5bd", marginTop: 8 }}>contextMenu 风格更紧凑、圆角更小、阴影更深</div>
            </section>
            {/* dropdownRef */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>dropdownRef</h3>
                <button
                    ref={btnRefDropdown}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenRef(v => !v)}
                >
                    打开 Dropdown（ref 获取 DOM）
                </button>
                <Dropdown
                    open={openRef}
                    anchorEl={btnRefDropdown.current}
                    items={demoItems}
                    onSelect={() => setOpenRef(false)}
                    onClose={() => setOpenRef(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                    dropdownRef={dropdownRef}
                />
                <button
                    style={{
                        marginTop: 8,
                        background: "#35363c",
                        color: "#ffd666",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        if (dropdownRef.current) {
                            setDropdownRect(dropdownRef.current.getBoundingClientRect());
                        }
                    }}
                >
                    获取 Dropdown DOM 尺寸
                </button>
                {dropdownRect && (
                    <div style={{ color: "#adb5bd", marginTop: 8 }}>
                        宽度：{Math.round(dropdownRect.width)}px，高度：{Math.round(dropdownRect.height)}px
                    </div>
                )}
            </section>
            {/* children 说明 */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>children（已废弃/不推荐）</h3>
                <div style={{ color: "#adb5bd" }}>
                    Dropdown 组件不推荐使用 children 传递内容，建议统一用 items 配置菜单项。
                </div>
            </section>
            {/* 全部属性综合 */}
            <section className={styles["dropdownDemo-section"]}>
                <h3>全部属性综合</h3>
                <button
                    ref={btnRefAll}
                    className={styles["dropdownDemo-dropdownBtn"]}
                    onClick={() => setOpenAll(v => !v)}
                >
                    打开 Dropdown
                </button>
                <Dropdown
                    open={openAll}
                    anchorEl={btnRefAll.current}
                    items={demoItems}
                    onSelect={item => {
                        setSelected(item.label as string);
                        setOpenAll(false);
                    }}
                    onClose={() => setOpenAll(false)}
                    placement={"bottomLeft"}
                    size={"medium"}
                    maxHeight={180}
                />
                <div style={{ color: "#adb5bd", marginTop: 8 }}>
                    选中项：<span style={{ color: "#ffd666" }}>{selected}</span>
                </div>
            </section>
        </div>
    );
}
