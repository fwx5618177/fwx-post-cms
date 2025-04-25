import React from "react";
import { Outlet } from "react-router-dom";
import styles from "@styles/pages/user.module.scss";

const User = () => {
    return (
        <div className={styles.userPage}>
            <Outlet />
        </div>
    );
};

export default User;
