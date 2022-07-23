import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import App from "./App";
import './index.css'

const App = lazy(() => import('./App'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Suspense fallback={<p>Loading</p>}>
                <Routes>
                    <Route index element={<App />} />
                    <Route path='*' element={'404'} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </React.StrictMode>,
)
