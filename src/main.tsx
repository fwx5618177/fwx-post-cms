import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@styles/global.module.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
