import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import './style.css'

const SideMenu = () => {
    const { t } = useTranslation()

    return (
        <>
            <header className='SideMenu_header'>
                <span></span>
                <h3>{t('sidemenu')}</h3>
            </header>

            <Card
                style={{
                    margin: 12,
                }}
            ></Card>
        </>
    )
}

export default SideMenu
