import { useTranslation } from 'react-i18next'
import Charts from './components/charts'

const AVA = () => {
    const { t } = useTranslation()

    return (
        <>
            <div
                style={{
                    margin: 12,
                }}
            >
                <h3>{t('ava.header.title')}</h3>
                <Charts />
            </div>
        </>
    )
}

export default AVA
