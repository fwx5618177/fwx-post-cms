import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./dropdown.module.scss";
import type { DropdownProps, DropdownItem, DropdownGroup, DropdownDivider, DropdownMenuItem } from "./types";

// 智能边界检测和反向弹出
function getSmartPlacement(
    anchorEl: HTMLElement,
    menuRect: { width: number; height: number },
    placement: DropdownProps["placement"],
): DropdownProps["placement"] {
    const rect = anchorEl.getBoundingClientRect();
    const padding = 8;
    // 上方空间
    const spaceTop = rect.top - padding;
    // 下方空间
    const spaceBottom = window.innerHeight - rect.bottom - padding;

    // 只对上下方向做智能反向
    if (["top", "topLeft", "topRight"].includes(placement!)) {
        if (spaceTop < menuRect.height && spaceBottom > spaceTop) {
            // 上方不够，下方更大，切换到底部
            if (placement === "top") return "bottom";
            if (placement === "topLeft") return "bottomLeft";
            if (placement === "topRight") return "bottomRight";
        }
    }
    if (["bottom", "bottomLeft", "bottomRight"].includes(placement!)) {
        if (spaceBottom < menuRect.height && spaceTop > spaceBottom) {
            // 下方不够，上方更大，切换到顶部
            if (placement === "bottom") return "top";
            if (placement === "bottomLeft") return "topLeft";
            if (placement === "bottomRight") return "topRight";
        }
    }
    // 可扩展左右方向
    return placement!;
}

function getAnchorPosition(
    anchorEl: HTMLElement,
    menuRect: { width: number; height: number },
    placement: DropdownProps["placement"] = "bottomLeft",
) {
    // 智能反向
    const smartPlacement = getSmartPlacement(anchorEl, menuRect, placement);
    const rect = anchorEl.getBoundingClientRect();
    let left = 0,
        top = 0;
    switch (smartPlacement) {
        case "top":
            left = rect.left + rect.width / 2 - menuRect.width / 2;
            top = rect.top - menuRect.height;
            break;
        case "topLeft":
            left = rect.left;
            top = rect.top - menuRect.height;
            break;
        case "topRight":
            left = rect.right - menuRect.width;
            top = rect.top - menuRect.height;
            break;
        case "bottom":
            left = rect.left + rect.width / 2 - menuRect.width / 2;
            top = rect.bottom;
            break;
        case "bottomLeft":
            left = rect.left;
            top = rect.bottom;
            break;
        case "bottomRight":
            left = rect.right - menuRect.width;
            top = rect.bottom;
            break;
        case "left":
            left = rect.left - menuRect.width;
            top = rect.top + rect.height / 2 - menuRect.height / 2;
            break;
        case "right":
            left = rect.right;
            top = rect.top + rect.height / 2 - menuRect.height / 2;
            break;
        default:
            left = rect.left;
            top = rect.bottom;
    }
    // 边界检测
    const padding = 8;
    if (left + menuRect.width > window.innerWidth - padding) {
        left = window.innerWidth - menuRect.width - padding;
    }
    if (left < padding) {
        left = padding;
    }
    if (top + menuRect.height > window.innerHeight - padding) {
        top = window.innerHeight - menuRect.height - padding;
    }
    if (top < padding) {
        top = padding;
    }
    return { left, top };
}

// Dropdown 组件
// 只负责弹层和菜单渲染，不负责触发按钮
// 高内聚低耦合，详细注释
const Dropdown: React.FC<DropdownProps> = ({
    open,
    anchorEl,
    position,
    items,
    onSelect,
    onClose,
    size = "medium",
    maxHeight,
    className,
    style,
    placement = "bottomLeft",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = React.useState<{ left: number; top: number } | null>(null);

    // 监听点击外部关闭
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) {
                onClose?.();
            }
        };
        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    // 计算定位，支持边界检测和智能反向
    useEffect(() => {
        if (!open) return;
        if (anchorEl && ref.current) {
            ref.current.style.visibility = "hidden";
            ref.current.style.display = "block";
            const menuRect = ref.current.getBoundingClientRect();
            const coords = getAnchorPosition(anchorEl, { width: menuRect.width, height: menuRect.height }, placement);
            setCoords(coords);
            ref.current.style.visibility = "";
            ref.current.style.display = "";
        } else if (position) {
            setCoords({ left: position.x, top: position.y });
        }
    }, [open, anchorEl, position, placement]);

    if (!open) return null;

    // 渲染菜单项/分组/分割线
    const renderMenu = (menu: DropdownMenuItem[], depth = 0, parentKey = "") => (
        <ul className={styles.dropdownList} style={depth > 0 ? { minWidth: 140 } : undefined}>
            {menu.map((item, idx) => {
                if ((item as DropdownDivider).type === "divider") {
                    return (
                        <li
                            className={styles.dropdownDivider}
                            key={(item as DropdownDivider).key ?? `divider-${parentKey}-${idx}`}
                        />
                    );
                }
                if ((item as DropdownGroup).items) {
                    const group = item as DropdownGroup;
                    const groupKey = `group-${parentKey}-${idx}`;
                    return (
                        <React.Fragment key={groupKey}>
                            <div className={styles.dropdownGroupLabel}>{group.label}</div>
                            {renderMenu(group.items, depth, groupKey)}
                        </React.Fragment>
                    );
                }
                const menuItem = item as DropdownItem;
                const hasChildren = !!menuItem.children && menuItem.children.length > 0;
                return (
                    <li
                        key={menuItem.key}
                        className={classNames(styles.dropdownItem, {
                            [styles.dropdownItemWithChildren]: hasChildren,
                            disabled: menuItem.disabled,
                        })}
                        tabIndex={menuItem.disabled ? -1 : 0}
                        onClick={
                            menuItem.disabled
                                ? undefined
                                : e => {
                                      e.stopPropagation();
                                      if (hasChildren) return;
                                      onSelect?.(menuItem);
                                      onClose?.();
                                  }
                        }
                    >
                        {menuItem.icon && <span className={styles.dropdownItemIcon}>{menuItem.icon}</span>}
                        <span>{menuItem.label}</span>
                        {menuItem.shortcut && <span className={styles.dropdownShortcut}>{menuItem.shortcut}</span>}
                        {hasChildren && <span className={styles.dropdownItemSubArrow}>▶</span>}
                        {hasChildren && (
                            <div className={styles.dropdownSubmenu}>
                                {renderMenu(menuItem.children!, depth + 1, `${parentKey}-${menuItem.key}`)}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div
            ref={ref}
            className={classNames(styles.dropdown, styles[size], className)}
            style={{
                ...style,
                maxHeight,
                left: coords?.left,
                top: coords?.top,
                position: "fixed",
            }}
            tabIndex={-1}
        >
            {renderMenu(items)}
        </div>
    );
};

export default Dropdown;
