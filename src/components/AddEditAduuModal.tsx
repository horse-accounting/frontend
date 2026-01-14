import { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  Upload,
  Image,
  Spin,
  App,
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import {
  useCreateAduu,
  useUpdateAduu,
  useUulders,
  useAduunuud,
  useUploadImage,
  type Aduu,
  type Huis,
  type CreateAduuRequest,
} from '../api'

const { TextArea } = Input

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA0IiBoZWlnaHQ9IjEwNCIgdmlld0JveD0iMCAwIDEwNCAxMDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwNCIgaGVpZ2h0PSIxMDQiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JmYmZiZiIgZm9udC1zaXplPSIxMiI+0JfRg9GA0LDQsyDQsNC70LTQsNCwPC90ZXh0Pjwvc3ZnPg=='

interface AddEditAduuModalProps {
  open: boolean
  aduu: Aduu | null
  onClose: () => void
  onSuccess: () => void
}

const huisOptions: { value: Huis; label: string }[] = [
  { value: 'azarga', label: 'Азарга' },
  { value: 'guu', label: 'Гүү' },
  { value: 'mori', label: 'Морь' },
]

export function AddEditAduuModal({ open, aduu, onClose, onSuccess }: AddEditAduuModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!aduu

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const { message } = App.useApp()

  const { data: uulders } = useUulders()
  const { data: aduunuudData } = useAduunuud({ limit: 100 })
  const createAduu = useCreateAduu()
  const updateAduu = useUpdateAduu()
  const uploadImage = useUploadImage()

  const aduunuud = aduunuudData?.aduunuud || []

  useEffect(() => {
    if (open) {
      if (aduu) {
        form.setFieldsValue({
          ner: aduu.ner,
          huis: aduu.huis,
          tursunOn: aduu.tursunOn,
          nasBarsan: aduu.nasBarsan,
          tursunGazar: aduu.tursunGazar,
          zus: aduu.zus,
          microchip: aduu.microchip,
          dnaCode: aduu.dnaCode,
          tamga: aduu.tamga,
          uraldsan: aduu.uraldsan,
          tailbar: aduu.tailbar,
          uulderId: aduu.uulderId,
          fatherId: aduu.fatherId,
          motherId: aduu.motherId,
        })
        setImageUrls(aduu.zurag || [])
      } else {
        form.resetFields()
        setImageUrls([])
      }
    }
  }, [open, aduu, form])

  const handleSubmit = async (values: CreateAduuRequest) => {
    try {
      const submitData = {
        ...values,
        zurag: imageUrls,
      }

      if (isEdit && aduu) {
        await updateAduu.mutateAsync({ id: aduu.id, data: submitData })
        message.success('Адуу амжилттай шинэчлэгдлээ')
      } else {
        await createAduu.mutateAsync(submitData)
        message.success('Адуу амжилттай нэмэгдлээ')
      }
      onSuccess()
    } catch {
      message.error(isEdit ? 'Шинэчлэхэд алдаа гарлаа' : 'Нэмэхэд алдаа гарлаа')
    }
  }

  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess: onUploadSuccess, onError } = options
    setUploading(true)

    try {
      const result = await uploadImage.mutateAsync({ file: file as File, folder: 'horses' })
      setImageUrls((prev) => [...prev, result.url])
      onUploadSuccess?.(result)
      message.success('Зураг амжилттай хуулагдлаа')
    } catch {
      onError?.(new Error('Upload failed'))
      message.error('Зураг хуулахад алдаа гарлаа')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url))
  }

  const handlePreview = (url: string) => {
    setPreviewImage(url)
    setPreviewOpen(true)
  }

  const isLoading = createAduu.isPending || updateAduu.isPending

  // Filter for father (azarga only) and mother (guu only)
  const fatherOptions = aduunuud
    .filter((a) => a.huis === 'azarga' && a.id !== aduu?.id)
    .map((a) => ({ value: a.id, label: a.ner }))

  const motherOptions = aduunuud
    .filter((a) => a.huis === 'guu' && a.id !== aduu?.id)
    .map((a) => ({ value: a.id, label: a.ner }))

  const uploadButton = (
    <div>
      {uploading ? <Spin size="small" /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Зураг</div>
    </div>
  )

  return (
    <Modal
      title={isEdit ? 'Адуу засах' : 'Адуу нэмэх'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      okText={isEdit ? 'Хадгалах' : 'Нэмэх'}
      cancelText="Болих"
      width={720}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ uraldsan: false }}
      >
        {/* Image Upload Section */}
        <Form.Item label="Зураг">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {imageUrls.map((url, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: 104,
                  height: 104,
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={url}
                  alt={`horse-${index}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePreview(url)}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'all 0.2s',
                  }}
                  className="image-overlay"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0)'
                    e.currentTarget.style.opacity = '0'
                  }}
                >
                  <DeleteOutlined
                    style={{ color: '#fff', fontSize: 20, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(url)
                    }}
                  />
                </div>
              </div>
            ))}
            {imageUrls.length < 5 && (
              <Upload
                listType="picture-card"
                showUploadList={false}
                customRequest={handleUpload}
                accept="image/*"
                disabled={uploading}
              >
                {uploadButton}
              </Upload>
            )}
          </div>
          <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
            5 хүртэл зураг оруулах боломжтой
          </div>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="ner"
              label="Нэр"
              rules={[{ required: true, message: 'Нэр оруулна уу' }]}
            >
              <Input placeholder="Адууны нэр" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="huis"
              label="Хүйс"
              rules={[{ required: true, message: 'Хүйс сонгоно уу' }]}
            >
              <Select placeholder="Хүйс сонгох" options={huisOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="uulderId" label="Үүлдэр">
              <Select
                placeholder="Үүлдэр сонгох"
                allowClear
                options={uulders?.map((u) => ({ value: u.id, label: u.name }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="zus" label="Зүс">
              <Input placeholder="Зүс (жнь: Хүрэн, Халтар)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="tursunOn" label="Төрсөн он">
              <InputNumber
                placeholder="2020"
                style={{ width: '100%' }}
                min={1900}
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="nasBarsan" label="Нас барсан он">
              <InputNumber
                placeholder="2024"
                style={{ width: '100%' }}
                min={1900}
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="tursunGazar" label="Төрсөн газар">
              <Input placeholder="Газар" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="fatherId" label="Эцэг (Азарга)">
              <Select
                placeholder="Эцэг сонгох"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
                options={fatherOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="motherId" label="Эх (Гүү)">
              <Select
                placeholder="Эх сонгох"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
                options={motherOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="microchip" label="Микрочип">
              <Input placeholder="Микрочип дугаар" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="dnaCode" label="DNA код">
              <Input placeholder="DNA код" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="tamga" label="Тамга">
              <Input placeholder="Тамга" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="uraldsan" label="Уралдсан эсэх" valuePropName="checked">
              <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="tailbar" label="Тайлбар">
          <TextArea rows={3} placeholder="Нэмэлт тайлбар..." />
        </Form.Item>
      </Form>

      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </Modal>
  )
}
