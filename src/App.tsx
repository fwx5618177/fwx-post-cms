import React from "react";
import AppRoutes from "@components/AppRoutes";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = React.memo(() => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
});

export default App;
