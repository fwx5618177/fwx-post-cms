import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import styles from "./dropdown.module.scss";
import type { DropdownProps, DropdownItem, DropdownGroup, DropdownDivider, DropdownMenuItem } from "./types";

// --- TYPE GUARDS ---
const isDivider = (item: DropdownMenuItem): item is DropdownDivider => "type" in item && item.type === "divider";
const isGroup = (item: DropdownMenuItem): item is DropdownGroup => "items" in item;
const isItem = (item: DropdownMenuItem): item is DropdownItem => "key" in item && !isGroup(item) && !isDivider(item);
const hasChildren = (item: DropdownItem): boolean => !!item.children && item.children.length > 0;

// --- CONTEXT ---
interface DropdownContextType {
    activePath: (string | number)[];
    setActivePath: (path: (string | number)[]) => void;
    focusedKey: string | number | null;
    setFocusedKey: (key: string | number | null) => void;
    onSelect?: (item: DropdownItem) => void;
    onClose?: () => void;
}
const DropdownContext = createContext<DropdownContextType | null>(null);
const useDropdownContext = () => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("useDropdownContext must be used within a Dropdown");
    return context;
};

// --- HOOKS ---
export const useDropdown = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleOpen = useCallback((element: HTMLElement) => {
        setAnchorEl(element);
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
        setAnchorEl(null);
    }, []);
    const handleToggle = useCallback((element: HTMLElement) => {
        setOpen(prev => !prev);
        setAnchorEl(element);
    }, []);
    return { open, anchorEl, handleOpen, handleClose, handleToggle };
};

// --- COMPONENTS ---

const MenuItem: React.FC<{ item: DropdownItem; path: (string | number)[] }> = ({ item, path }) => {
    const { activePath, setActivePath, focusedKey, setFocusedKey, onSelect } = useDropdownContext();
    const isFocused = focusedKey === item.key;
    const itemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (isFocused) {
            itemRef.current?.focus();
        }
    }, [isFocused]);

    if (hasChildren(item)) {
        const isSubMenuOpen = activePath[path.length - 1] === item.key;
        return (
            <li
                ref={itemRef}
                className={classNames(styles.dropdownItem, styles.dropdownItemWithChildren, {
                    [styles.dropdownItemFocused]: isFocused,
                    disabled: item.disabled,
                })}
                role="menuitem"
                tabIndex={-1}
                aria-haspopup="true"
                aria-expanded={isSubMenuOpen}
                onMouseEnter={() => {
                    if (item.disabled) return;
                    // Open submenu on hover
                    setActivePath(path);
                    setFocusedKey(item.key);
                }}
                onClick={e => {
                    if (item.disabled) return;
                    e.preventDefault();
                    e.stopPropagation();
                    // Toggle submenu on click
                    if (isSubMenuOpen) {
                        setActivePath(path.slice(0, -1));
                    } else {
                        setActivePath(path);
                        setFocusedKey(item.key);
                    }
                }}
            >
                <div className={styles.dropdownItemContent}>
                    {item.icon && <span className={styles.dropdownItemIcon}>{item.icon}</span>}
                    <span>{item.label}</span>
                    {item.shortcut && <span className={styles.dropdownShortcut}>{item.shortcut}</span>}
                    <span className={styles.dropdownItemSubArrow}>▶</span>
                </div>
                {isSubMenuOpen && <SubMenu items={item.children!} parentRef={itemRef} path={path} />}
            </li>
        );
    }

    return (
        <li
            ref={itemRef}
            className={classNames(styles.dropdownItem, {
                [styles.dropdownItemFocused]: isFocused,
                disabled: item.disabled,
            })}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={item.disabled}
            onMouseEnter={() => !item.disabled && setFocusedKey(item.key)}
            onClick={() => !item.disabled && onSelect?.(item)}
        >
            <div className={styles.dropdownItemContent}>
                {item.icon && <span className={styles.dropdownItemIcon}>{item.icon}</span>}
                <span>{item.label}</span>
                {item.shortcut && <span className={styles.dropdownShortcut}>{item.shortcut}</span>}
            </div>
        </li>
    );
};

const Menu: React.FC<{ items: DropdownMenuItem[]; path?: (string | number)[] }> = ({ items, path = [] }) => {
    return (
        <ul className={styles.dropdownList} role="menu">
            {items.map((item, index) => {
                if (isDivider(item)) {
                    return (
                        <li key={item.key || `divider-${index}`} className={styles.dropdownDivider} role="separator" />
                    );
                }
                if (isGroup(item)) {
                    return (
                        <li key={item.label?.toString() || index} role="presentation">
                            <div className={styles.dropdownGroupLabel}>{item.label}</div>
                            <ul className={styles.dropdownList} role="menu">
                                {item.items.map((groupItem, subIndex) => {
                                    if (isDivider(groupItem)) {
                                        return (
                                            <li
                                                key={`group-divider-${subIndex}`}
                                                className={styles.dropdownDivider}
                                                role="separator"
                                            />
                                        );
                                    }
                                    if (isGroup(groupItem)) {
                                        // Nested group
                                        return (
                                            <li key={`nested-group-${subIndex}`} role="presentation">
                                                <div className={styles.dropdownGroupLabel}>{groupItem.label}</div>
                                                <Menu items={groupItem.items} path={path} />
                                            </li>
                                        );
                                    }
                                    // Regular item
                                    return (
                                        <MenuItem
                                            key={groupItem.key}
                                            item={groupItem}
                                            path={[...path, groupItem.key]}
                                        />
                                    );
                                })}
                            </ul>
                        </li>
                    );
                }
                return <MenuItem key={item.key} item={item} path={[...path, item.key]} />;
            })}
        </ul>
    );
};

const SubMenu: React.FC<{
    items: DropdownMenuItem[];
    parentRef: React.RefObject<HTMLElement>;
    path: (string | number)[];
}> = ({ items, parentRef, path }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top?: number; left?: number }>({});
    const [submenuMaxHeight, setSubmenuMaxHeight] = useState<number | undefined>(undefined);
    const { setActivePath } = useDropdownContext();

    useEffect(() => {
        if (parentRef.current && ref.current) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const menuRect = ref.current.getBoundingClientRect();
            const { innerWidth, innerHeight } = window;
            const PADDING = 8;

            let top = parentRect.top;
            let left = parentRect.right;

            if (left + menuRect.width > innerWidth - PADDING) {
                left = parentRect.left - menuRect.width;
            }
            if (top + menuRect.height > innerHeight - PADDING) {
                top = Math.max(PADDING, innerHeight - menuRect.height - PADDING);
            }
            if (top < PADDING) {
                top = PADDING;
            }

            setCoords({ top, left });
            const availableHeight = Math.max(PADDING, innerHeight - top - PADDING);
            setSubmenuMaxHeight(availableHeight);
        }
    }, [parentRef]);

    return createPortal(
        <div
            ref={ref}
            className={classNames(styles.dropdown, styles.dropdownSubmenu)}
            style={coords}
            onMouseEnter={() => setActivePath(path)}
            onMouseLeave={() => setActivePath(path.slice(0, -1))}
        >
            <div className={styles.dropdownScroll} style={{ maxHeight: submenuMaxHeight }}>
                <Menu items={items} path={path} />
            </div>
        </div>,
        document.body,
    );
};

const Dropdown: React.FC<DropdownProps> = props => {
    const {
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
        autoFocus,
        destroyPopupOnHide = false,
    } = props;
    const ref = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
    const [activePath, setActivePath] = useState<(string | number)[]>([]);
    const [focusedKey, setFocusedKey] = useState<string | number | null>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    // --- POSITIONING ---
    useEffect(() => {
        if (open && ref.current) {
            if (anchorEl) {
                const anchorRect = anchorEl.getBoundingClientRect();
                const menuRect = ref.current.getBoundingClientRect();
                let left = anchorRect.left;
                let top = anchorRect.bottom;
                if (placement.includes("top")) top = anchorRect.top - menuRect.height;
                if (placement.includes("Right")) left = anchorRect.right - menuRect.width;
                if (placement === "left") {
                    left = anchorRect.left - menuRect.width;
                    top = anchorRect.top;
                }
                if (placement === "right") {
                    left = anchorRect.right;
                    top = anchorRect.top;
                }
                setCoords({ top, left });
            } else if (position) {
                setCoords({ left: position.x, top: position.y });
            }
        }
    }, [open, anchorEl, position, placement]);

    // --- OUTSIDE CLICK ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const insideAnyDropdown = target.closest('[data-dropdown-container="true"]');
            const insideAnchor = anchorEl && anchorEl.contains(target);
            if (!insideAnyDropdown && !insideAnchor) onClose?.();
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose, anchorEl]);

    // --- SCROLLBAR STABILITY ---
    useEffect(() => {
        if (!open) return;
        const el = scrollRef.current;
        if (!el) return;
        const update = () => {
            setIsScrollable(el.scrollHeight > el.clientHeight);
        };
        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(el);
        window.addEventListener("resize", update);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [open, items, maxHeight]);

    // --- KEYBOARD NAVIGATION ---
    const getItemsFromPath = useCallback(
        (path: (string | number)[]): DropdownMenuItem[] => {
            if (path.length === 0) return items;
            let current: DropdownMenuItem[] | undefined = items;
            for (const key of path) {
                const parent = current?.find(i => isItem(i) && i.key === key) as DropdownItem;
                current = parent?.children;
                if (!current) return [];
            }
            return current;
        },
        [items],
    );

    const getFlatItems = useCallback((menuItems: DropdownMenuItem[]): DropdownItem[] => {
        const flatten = (arr: DropdownMenuItem[]): DropdownItem[] => {
            return arr.reduce<DropdownItem[]>((acc, item) => {
                if (isGroup(item)) acc.push(...flatten(item.items));
                else if (isItem(item)) acc.push(item);
                return acc;
            }, []);
        };
        return flatten(menuItems);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const currentItems = getItemsFromPath(activePath);
            const flatItems = getFlatItems(currentItems).filter(i => !i.disabled);
            if (flatItems.length === 0) return;

            const currentIndex = flatItems.findIndex(i => i.key === focusedKey);
            const currentItem = flatItems[currentIndex];

            switch (e.key) {
                case "ArrowDown": {
                    e.preventDefault();
                    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % flatItems.length;
                    setFocusedKey(flatItems[nextIndex].key);
                    break;
                }
                case "ArrowUp": {
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? flatItems.length - 1 : currentIndex - 1;
                    setFocusedKey(flatItems[prevIndex].key);
                    break;
                }
                case "ArrowRight":
                    if (currentItem && hasChildren(currentItem)) {
                        e.preventDefault();
                        setActivePath([...activePath, currentItem.key]);
                        const subItems = getFlatItems(currentItem.children!).filter(i => !i.disabled);
                        if (subItems.length > 0) setFocusedKey(subItems[0].key);
                    }
                    break;
                case "ArrowLeft":
                    if (activePath.length > 0) {
                        e.preventDefault();
                        const parentPath = activePath.slice(0, -1);
                        const parentKey = activePath[activePath.length - 1];
                        setActivePath(parentPath);
                        setFocusedKey(parentKey);
                    }
                    break;
                case "Enter":
                case " ":
                    if (currentItem) {
                        e.preventDefault();
                        if (hasChildren(currentItem)) {
                            setActivePath([...activePath, currentItem.key]);
                            const subItems = getFlatItems(currentItem.children!).filter(i => !i.disabled);
                            if (subItems.length > 0) setFocusedKey(subItems[0].key);
                        } else {
                            onSelect?.(currentItem);
                        }
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    if (activePath.length > 0) {
                        const parentPath = activePath.slice(0, -1);
                        const parentKey = activePath[activePath.length - 1];
                        setActivePath(parentPath);
                        setFocusedKey(parentKey);
                    } else {
                        onClose?.();
                    }
                    break;
                case "Tab":
                    e.preventDefault();
                    onClose?.();
                    break;
            }
        },
        [activePath, focusedKey, onSelect, onClose, getFlatItems, getItemsFromPath],
    );

    // --- FOCUS MANAGEMENT ---
    useEffect(() => {
        if (open && autoFocus && ref.current) {
            ref.current.focus();
        }
        if (!open) {
            setActivePath([]);
            setFocusedKey(null);
        }
    }, [open, autoFocus]);

    if (!open && destroyPopupOnHide) return null;

    const contextValue = { activePath, setActivePath, focusedKey, setFocusedKey, onSelect, onClose };

    return (
        <div
            ref={ref}
            className={classNames(styles.dropdown, styles[size], className, { [styles.hidden]: !open })}
            style={{ ...style, left: coords?.left, top: coords?.top }}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            data-dropdown-container="true"
        >
            <DropdownContext.Provider value={contextValue}>
                <div
                    ref={scrollRef}
                    className={classNames(styles.dropdownScroll, { [styles.scrollable]: isScrollable })}
                    style={{ maxHeight }}
                >
                    <Menu items={items} />
                </div>
            </DropdownContext.Provider>
        </div>
    );
};

export default Dropdown;
