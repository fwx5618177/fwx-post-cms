import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isSystemTheme: boolean;
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题变量配置
const THEME_VARIABLES = {
    light: {
        // Dropdown 组件变量
        "--dropdown-bg": "#ffffff",
        "--dropdown-text": "#212529",
        "--dropdown-border": "#dee2e6",
        "--dropdown-hover-bg": "#f8f9fa",
        "--dropdown-hover-text": "#0d6efd",
        "--dropdown-disabled-text": "#6c757d",
        "--dropdown-focus-color": "#0d6efd",

        // 全局变量
        "--bg-primary": "#ffffff",
        "--bg-secondary": "#f8f9fa",
        "--bg-tertiary": "#e9ecef",
        "--text-primary": "#212529",
        "--text-secondary": "#6c757d",
        "--text-muted": "#6c757d",
        "--border-color": "#dee2e6",
        "--shadow-color": "rgba(0, 0, 0, 0.1)",
        "--primary-color": "#0d6efd",
        "--success-color": "#198754",
        "--warning-color": "#ffc107",
        "--danger-color": "#dc3545",
    },
    dark: {
        // Dropdown 组件变量
        "--dropdown-bg": "#2d2d30",
        "--dropdown-text": "#e1e1e1",
        "--dropdown-border": "#404040",
        "--dropdown-hover-bg": "#333333",
        "--dropdown-hover-text": "#4a6bff",
        "--dropdown-disabled-text": "#6c757d",
        "--dropdown-focus-color": "#4a6bff",

        // 全局变量
        "--bg-primary": "#252526",
        "--bg-secondary": "#2d2d30",
        "--bg-tertiary": "#333333",
        "--text-primary": "#e1e1e1",
        "--text-secondary": "#9e9e9e",
        "--text-muted": "#6c757d",
        "--border-color": "#404040",
        "--shadow-color": "rgba(0, 0, 0, 0.5)",
        "--primary-color": "#4a6bff",
        "--success-color": "#28a745",
        "--warning-color": "#ffc107",
        "--danger-color": "#dc3545",
    },
} as const;

// 检测系统主题
const getSystemTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

// 应用主题变量到 DOM
const applyThemeVariables = (theme: Theme) => {
    const root = document.documentElement;
    const variables = THEME_VARIABLES[theme];

    Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });

    // 设置 data-theme 属性供 CSS 选择器使用
    root.setAttribute("data-theme", theme);

    // 设置 body class 用于全局样式
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${theme}`);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = "dark",
    storageKey = "app-theme",
}) => {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [isSystemTheme, setIsSystemTheme] = useState(false);
    const [mounted, setMounted] = useState(false);

    // 初始化主题
    useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme | null;

        if (stored && ["light", "dark"].includes(stored)) {
            setThemeState(stored);
            setIsSystemTheme(false);
        } else {
            const systemTheme = getSystemTheme();
            setThemeState(systemTheme);
            setIsSystemTheme(true);
        }

        setMounted(true);
    }, [storageKey]);

    // 应用主题到 DOM
    useEffect(() => {
        if (mounted) {
            applyThemeVariables(theme);
        }
    }, [theme, mounted]);

    // 监听系统主题变化
    useEffect(() => {
        if (!isSystemTheme) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? "light" : "dark";
            setThemeState(newTheme);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [isSystemTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        setIsSystemTheme(false);
        localStorage.setItem(storageKey, newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const contextValue: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme,
        isSystemTheme,
    };

    // 避免服务端渲染不一致
    if (!mounted) {
        return <>{children}</>;
    }

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

// 主题切换按钮组件
export interface ThemeToggleProps {
    className?: string;
    size?: "small" | "medium" | "large";
    showLabel?: boolean;
    variant?: "button" | "icon";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = "",
    size = "medium",
    showLabel = false,
    variant = "button",
}) => {
    const { theme, toggleTheme, isSystemTheme } = useTheme();

    const sizeStyles = {
        small: "w-8 h-8 text-sm",
        medium: "w-10 h-10 text-base",
        large: "w-12 h-12 text-lg",
    };

    const buttonStyles = `
        ${sizeStyles[size]}
        inline-flex items-center justify-center
        rounded-lg border transition-all duration-200
        border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
    `
        .replace(/\s+/g, " ")
        .trim();

    const iconOnly = variant === "icon";

    return (
        <button
            onClick={toggleTheme}
            className={buttonStyles}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Current: ${theme}${isSystemTheme ? " (system)" : ""} theme. Click to toggle.`}
            type="button"
        >
            <span role="img" aria-hidden="true">
                {theme === "light" ? "🌙" : "☀️"}
            </span>
            {showLabel && !iconOnly && (
                <span className="ml-2 text-sm font-medium">{theme === "light" ? "Dark" : "Light"}</span>
            )}
        </button>
    );
};

// 主题选择器组件
export interface ThemeSelectorProps {
    className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = "" }) => {
    const { theme, setTheme, isSystemTheme } = useTheme();

    const options = [
        { value: "light", label: "Light Theme", icon: "☀️" },
        { value: "dark", label: "Dark Theme", icon: "🌙" },
        { value: "system", label: "System Theme", icon: "💻" },
    ];

    const handleChange = (value: string) => {
        if (value === "system") {
            const systemTheme = getSystemTheme();
            localStorage.removeItem("app-theme");
            setTheme(systemTheme);
        } else {
            setTheme(value as Theme);
        }
    };

    const currentValue = isSystemTheme ? "system" : theme;

    return (
        <div className={`theme-selector ${className}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Preference</label>
            <div className="space-y-2">
                {options.map(option => (
                    <label key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            name="theme"
                            value={option.value}
                            checked={currentValue === option.value}
                            onChange={e => handleChange(e.target.value)}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="mr-2" role="img" aria-hidden="true">
                            {option.icon}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
