import { useTranslation } from 'react-i18next'
import DotComponents from './components/DotComponents'

const L7Modal = () => {
    const { t } = useTranslation()

    return (
        <>
            <div
                style={{
                    margin: 12,
                }}
            >
                <h3>{t('charts.header.title')}</h3>
                <DotComponents />
            </div>
        </>
    )
}

export default L7Modal
