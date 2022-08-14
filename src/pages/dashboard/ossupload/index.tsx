import { Button, Card, Col, Form, Row, Select, UploadFile, UploadProps } from 'antd'
import { useState } from 'react'
import { uploadStyle } from 'src/common/interface'
import OSSUploadBase from 'src/pages/components/OssUpload'

const { Option } = Select

const OSSUpload = () => {
    const [listType, setListType] = useState<UploadProps['listType']>('picture')
    const [uploadStyle, setUploadStyle] = useState<uploadStyle>('click')

    const [form] = Form.useForm()

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    }

    const handleSubmit = value => {
        const { uploadFile } = value as {
            uploadFile: (UploadFile & { dist: string })[]
        }

        const result: {
            url: string | undefined
            dist: string
            name: string
            size: number | undefined
            type: string | undefined
        }[] = uploadFile?.map(ci => ({
            url: ci?.url,
            dist: ci?.dist,
            name: ci?.name,
            size: ci?.size,
            type: ci?.type,
        }))

        console.log(result)
    }

    return (
        <>
            <h3
                style={{
                    margin: 12,
                }}
            >
                OSS Upload
            </h3>

            <Card
                style={{
                    margin: 12,
                }}
            >
                <Row
                    gutter={24}
                    style={{
                        margin: 8,
                    }}
                >
                    <Col span={12}>
                        <span>List Type:</span>
                        <Select
                            style={{
                                width: '60%',
                            }}
                            placeholder='Please select'
                            onSelect={_ => setListType(_)}
                        >
                            {(['text', 'picture', 'picture-card'] as UploadProps['listType'][])?.map((ci, index) => (
                                <Option key={index + '_listType'} value={ci}>
                                    {ci}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={12}>
                        <span>List Type:</span>
                        <Select
                            style={{
                                width: '60%',
                            }}
                            placeholder='Please select'
                            onSelect={_ => setUploadStyle(_)}
                        >
                            {(['click', 'dragger'] as uploadStyle[])?.map((ci, index) => (
                                <Option key={index + '_uploadStyle'} value={ci}>
                                    {ci}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Card
                style={{
                    margin: 12,
                }}
            >
                <Form name='form' form={form} onFinish={handleSubmit}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item name={'uploadFile'}>
                                <OSSUploadBase listType={listType} uploadStyle={uploadStyle} uploadDir={'image'} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>

                        <Button
                            style={{
                                marginLeft: 8,
                            }}
                            htmlType='button'
                            // onClick={onReset}
                        >
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default OSSUpload
