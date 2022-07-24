import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, FontColorsOutlined } from '@ant-design/icons'
import { Github } from 'react-bootstrap-icons'
import { Breadcrumb, Dropdown, Layout, Menu } from 'antd'
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { menusController } from '../common/routes.controller'
import './layout.css'
import i18n, { multipleLanguages } from '../../i18n/index'

const { Header, Sider, Content, Footer } = Layout

const LayoutEle = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [linksName, setLinksName] = useState<string[]>(window.location.pathname.split('/').filter(ci => !!ci) as string[])

    const i18nMenus = (
        <Menu
            onClick={event => {
                i18n.changeLanguage(event?.key)
            }}
            items={multipleLanguages?.map(ci => ({
                label: ci?.label,
                key: ci?.value,
            }))}
        />
    )

    return (
        <Layout
            style={{
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className='logo'>
                    <h3
                        style={{
                            marginTop: 3,
                            color: '#fff566',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Moxi
                    </h3>
                </div>

                <Menu
                    theme='dark'
                    mode='inline'
                    selectedKeys={linksName.length > 1 ? [linksName[1]] : ['/']}
                    items={menusController()}
                    onClick={() => {
                        const re = window.location.pathname.split('/').filter(ci => !!ci)

                        setLinksName(re)
                    }}
                    defaultOpenKeys={linksName.length > 1 ? [linksName[0]] : ['']}
                />
            </Sider>
            <Layout className='site-layout'>
                <Header
                    className='site-layout-background'
                    style={{
                        margin: 2,
                        padding: 0,
                        background: 'transparent',
                        border: '2px solid rgba(154,150,150, 0.9)',
                        boxShadow: '7px 4px 12px 2px rgba(154,150,150, 0.9)',
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}

                    <div className='layout_multiple_languages'>
                        <Dropdown overlay={i18nMenus}>
                            <FontColorsOutlined />
                        </Dropdown>
                    </div>
                </Header>
                <Breadcrumb style={{ margin: 0, marginLeft: 8, marginTop: 8 }}>
                    <Breadcrumb.Item>
                        <HomeOutlined />
                        <Link to={'/'}>
                            <span
                                onClick={() => {
                                    setLinksName(['/'])
                                }}
                            >
                                Home
                            </span>
                        </Link>
                    </Breadcrumb.Item>
                    {linksName.length > 1
                        ? linksName?.map((ci, index) => {
                              return <Breadcrumb.Item key={index + '_menu'}>{ci}</Breadcrumb.Item>
                          })
                        : null}
                </Breadcrumb>
                <Content
                    className='site-layout-background'
                    style={{
                        margin: '5px 8px 6px 8px',
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        // margin: '24px 16px',
                        // padding: 24,
                        // minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <a className='githubLink' href='https://github.com/fwx5618177'>
                        <Github />
                        Moxi
                    </a>
                    ©2022 Created by Moxi
                </Footer>
            </Layout>
        </Layout>
    )
}

export default LayoutEle
