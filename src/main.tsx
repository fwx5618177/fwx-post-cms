import { extraRoutesHandle, routesConf } from './common/routes.controller'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './index.css'
import SpinLoading from './loading/spin'
import '../i18n/index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <ConfigProvider>
        <HashRouter>
            <Suspense fallback={<SpinLoading />}>
                <Routes>{routesConf(extraRoutesHandle())}</Routes>
            </Suspense>
        </HashRouter>
    </ConfigProvider>,
    // </React.StrictMode>,
)
