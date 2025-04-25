import React, { useState } from "react";
import styles from "@styles/pages/security.module.scss";
import { RiLockLine, RiShieldKeyholeLine, RiHistoryLine, RiAlertLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

interface SecuritySetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    icon: React.ReactNode;
}

const Security = () => {
    const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
        {
            id: "2fa",
            title: "双因素认证",
            description: "启用双因素认证以增加账户安全性",
            enabled: false,
            icon: <RiShieldKeyholeLine />,
        },
        {
            id: "login_history",
            title: "登录历史",
            description: "记录并显示最近的登录活动",
            enabled: true,
            icon: <RiHistoryLine />,
        },
        {
            id: "password_policy",
            title: "密码策略",
            description: "强制使用复杂密码并定期更新",
            enabled: true,
            icon: <RiLockLine />,
        },
        {
            id: "login_alert",
            title: "登录提醒",
            description: "检测到异常登录时发送通知",
            enabled: false,
            icon: <RiAlertLine />,
        },
    ]);

    const toggleSetting = (id: string) => {
        setSecuritySettings(prev =>
            prev.map(setting => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
        );
    };

    return (
        <div className={styles.securityPage}>
            <div className={styles.header}>
                <h1>安全设置</h1>
                <p>管理您的账户安全选项，保护您的账户安全</p>
            </div>

            <div className={styles.settingsGrid}>
                {securitySettings.map(setting => (
                    <div key={setting.id} className={styles.settingCard}>
                        <div className={styles.settingIcon}>{setting.icon}</div>
                        <div className={styles.settingInfo}>
                            <h3>{setting.title}</h3>
                            <p>{setting.description}</p>
                        </div>
                        <button
                            className={`${styles.toggleButton} ${setting.enabled ? styles.enabled : ""}`}
                            onClick={() => toggleSetting(setting.id)}
                        >
                            {setting.enabled ? (
                                <>
                                    <RiCheckLine />
                                    <span>已启用</span>
                                </>
                            ) : (
                                <>
                                    <RiCloseLine />
                                    <span>已禁用</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.securityInfo}>
                <h2>安全提示</h2>
                <ul>
                    <li>定期更改您的密码以提高安全性</li>
                    <li>不要与他人分享您的登录凭据</li>
                    <li>使用强密码并启用双因素认证</li>
                    <li>定期检查您的登录历史记录</li>
                </ul>
            </div>
        </div>
    );
};

export default Security;
