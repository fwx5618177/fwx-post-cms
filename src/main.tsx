import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Loading from "@components/Loading";
import AppRoutes from "./components/AppRoutes";
import "./styles/global.module.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Suspense fallback={<Loading type="spinner" size="md" />}>
            <AppRoutes />
        </Suspense>
    </BrowserRouter>,
);
