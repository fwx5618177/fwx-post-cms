import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { queryPathKey } from 'src/common/lib'
import Instro from 'src/pages/components/instro'

const Kaboom = () => {
    const { t } = useTranslation()

    return (
        <>
            <h3
                style={{
                    margin: 0,
                    textAlign: 'center',
                }}
            >
                Kaboom
            </h3>

            <Instro routeKey={queryPathKey(window.location.pathname)} />

            <h3
                style={{
                    margin: 12,
                }}
            >
                {t('kaboom.title.text.01')}
            </h3>
            <Card
                style={{
                    margin: 12,
                }}
            ></Card>
        </>
    )
}

export default Kaboom
