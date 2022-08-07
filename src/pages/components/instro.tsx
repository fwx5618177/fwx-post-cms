import { Card, Descriptions } from 'antd'
import { useEffect, useRef, useState } from 'react'
import * as marked from 'marked'
import moment from 'moment'
import api from './api'

const Instro = ({ routeKey }) => {
    const showRef = useRef<HTMLDivElement>(null)
    const [content, setContent] = useState<any>(null)

    const queryContent = async () => {
        const result = await api.detail(routeKey)

        if (result && Array.isArray(result) && result.length > 0) {
            const data = result[0]

            ;(showRef.current as HTMLDivElement).innerHTML = marked.parse(data?.content)

            setContent(data)
        } else {
            setContent(null)
        }
    }

    useEffect(() => {
        queryContent()
    }, [])
    return (
        <Card
            style={{
                margin: 12,
            }}
        >
            {content && (
                <header
                    style={{
                        margin: 6,
                    }}
                >
                    <Descriptions title='Infos' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                        <Descriptions.Item label='Publish time'>
                            {moment(content?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label='Route key sname'>{content?.routekeyname}</Descriptions.Item>
                        <Descriptions.Item label='Title'>{content?.title}</Descriptions.Item>
                        <Descriptions.Item label='User name'>{content?.username}</Descriptions.Item>
                    </Descriptions>
                </header>
            )}
            <div ref={showRef}></div>
        </Card>
    )
}

export default Instro
