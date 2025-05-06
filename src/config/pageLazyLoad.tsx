import { lazy } from "react";

/**
 * 页面懒加载组件映射
 * @description 统一管理所有页面的懒加载组件，并添加错误边界处理
 */

export const Pages = {
    // 布局组件
    DashboardLayout: lazy(() => import("../layout/DashboardLayout")),
    ArticleLayout: lazy(() => import("../layout/ArticleLayout")),
    UserLayout: lazy(() => import("../layout/UserLayout")),

    // 错误页面
    NotFound: lazy(() => import("../pages/404")),
    ServerError: lazy(() => import("../pages/500")),
    ServiceUnavailable: lazy(() => import("../pages/503")),
    MovedPermanently: lazy(() => import("../pages/301")),
    Error: lazy(() => import("../pages/error")),
    ErrorBoundary: lazy(() => import("../pages/error-boundary")),

    // 仪表盘
    Dashboard: lazy(() => import("../pages/dashboard")),

    // 文章相关
    ArticleList: lazy(() => import("../pages/article-list")),
    ArticleEdit: lazy(() => import("../pages/article-edit")),

    // 用户相关
    UserList: lazy(() => import("../pages/user-list")),
    UserProfile: lazy(() => import("../pages/user-profile")),

    // 功能模块
    Todo: lazy(() => import("../pages/todo")),
    Calendar: lazy(() => import("../pages/calendar")),
    Notification: lazy(() => import("../pages/notification")),
    Message: lazy(() => import("../pages/message")),
    Mail: lazy(() => import("../pages/mail")),
    Settings: lazy(() => import("../pages/settings")),
    Security: lazy(() => import("../pages/security")),

    // 认证相关
    Login: lazy(() => import("../pages/login")),
    Register: lazy(() => import("../pages/register")),
    ForgotPassword: lazy(() => import("../pages/forgot-password")),

    // 组件演示
    DropdownDemo: lazy(() => import("../pages/dropdown-demo")),

    // 新增：邮件模板编辑
    MailTemplateEdit: lazy(() => import("../pages/mail-template-edit")),
};
