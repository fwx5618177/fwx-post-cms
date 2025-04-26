import React from "react";
import { Outlet } from "react-router-dom";
import { RiUserLine } from "react-icons/ri";
import styles from "@styles/layouts/user.module.scss";

const UserLayout = () => {
    return (
        <div className={styles.userLayout}>
            <div className={styles.layoutHeader}>
                <div className={styles.headerIcon}>
                    <RiUserLine />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.headerTitle}>用户管理</h2>
                    <p className={styles.headerDescription}>管理系统用户</p>
                </div>
            </div>

            <div className={styles.layoutContent}>
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;
