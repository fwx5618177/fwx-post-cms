import { useTranslation } from 'react-i18next'
import BasicFlow from './components/basic'
import UML from './components/uml'

const FlowCharts = () => {
    const { t } = useTranslation()

    return (
        <>
            <div
                style={{
                    margin: 12,
                }}
            >
                <h3>{t('x6flow.header.title')}</h3>
                <BasicFlow />

                <h3>{t('x6flow.header.title')}</h3>
                <UML />
            </div>
        </>
    )
}

export default FlowCharts
