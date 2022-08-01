import { Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import * as marked from 'marked'
import { useRef, useState } from 'react'

const MenuContent = () => {
    const { t } = useTranslation()

    // const [markedShow, setMarkedShow] = useState<string>('')
    const showRef = useRef<HTMLDivElement>(null)

    const handleChange = _ => {
        const value = _?.target?.value
        const result = marked.parse(value)
        console.log(result)
        ;(showRef.current as HTMLDivElement).innerHTML = result

        // setMarkedShow(result)
    }

    return (
        <>
            <Card
                bordered={false}
                hoverable
                style={{
                    margin: 12,
                }}
            >
                <Form name='form'>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={t('menucontent.name.form.label')} name={'name'}>
                                <Select placeholder={t('menucontent.name.form.select.text')}></Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label={t('menucontent.name.form.content')} name={'content'}>
                                <Input.TextArea onChange={handleChange} showCount placeholder={t('menucontent.name.form.content.text')} allowClear autoSize={{ minRows: 5, maxRows: 8 }}></Input.TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card
                style={{
                    margin: 12,
                    height: 300,
                    overflow: 'scroll',
                }}
            >
                {/* {markedShow} */}
                <div ref={showRef}></div>
            </Card>
        </>
    )
}

export default MenuContent
