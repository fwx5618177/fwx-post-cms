import { extraRoutesHandle, routesConf, test } from './common/routes.controller'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ConfigProvider>
            <BrowserRouter>
                <Suspense fallback={<p>Loading</p>}>
                    <Routes>{routesConf(extraRoutesHandle())}</Routes>
                </Suspense>
            </BrowserRouter>
        </ConfigProvider>
    </React.StrictMode>,
)
