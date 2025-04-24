import { extraRoutesHandle, routesConf } from "./common/routes.controller";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";
import SpinLoading from "./components/loading/spin";
import "../i18n/index";
import "@/styles/base/global.module.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ConfigProvider>
        <BrowserRouter>
            <Suspense fallback={<SpinLoading />}>
                <Routes>{routesConf(extraRoutesHandle())}</Routes>
            </Suspense>
        </BrowserRouter>
    </ConfigProvider>,
);
