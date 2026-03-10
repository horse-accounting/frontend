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
  App,
  Divider,
  Typography,
  Flex,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CameraOutlined,
  IdcardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  EditOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import {
  useCreateAduu,
  useUpdateAduu,
  useUulders,
  useBulegs,
  useAduunuud,
  useUploadImages,
  useAddZurag,
  useUpdateZurag,
  useDeleteZurag,
  type Aduu,
  type Huis,
  type ZarlagaShaltgaan,
  type CreateAduuRequest,
  zarlagaShaltgaanLabels,
} from '../api'

interface ZuragInfo {
  id?: number
  url: string
  tailbar?: string
  isNew?: boolean
}

const { TextArea } = Input
const { Text } = Typography

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA0IiBoZWlnaHQ9IjEwNCIgdmlld0JveD0iMCAwIDEwNCAxMDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwNCIgaGVpZ2h0PSIxMDQiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JmYmZiZiIgZm9udC1zaXplPSIxMiI+0JfRg9GA0LDQsyDQsNC70LTQsNCwPC90ZXh0Pjwvc3ZnPg=='

interface AddEditAduuModalProps {
  open: boolean
  aduu: Aduu | null
  onClose: () => void
  onSuccess: (newAduu?: Aduu) => void
  defaultHuis?: Huis
}

const huisOptions: { value: Huis; label: string }[] = [
  { value: 'er', label: 'Эр' },
  { value: 'em', label: 'Эм' },
]

const zarlagaOptions = Object.entries(zarlagaShaltgaanLabels).map(([value, label]) => ({
  value: value as ZarlagaShaltgaan,
  label,
}))

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
    <span style={{ fontSize: 16, color: '#1890ff' }}>{icon}</span>
    <Text strong style={{ fontSize: 14 }}>{title}</Text>
  </Flex>
)

export function AddEditAduuModal({ open, aduu, onClose, onSuccess, defaultHuis }: AddEditAduuModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!aduu

  const [images, setImages] = useState<ZuragInfo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [editingTailbar, setEditingTailbar] = useState<number | null>(null)

  const { message } = App.useApp()

  const { data: uulders } = useUulders()
  const { data: bulegs } = useBulegs()
  const { data: aduunuudData } = useAduunuud({ limit: 100 })
  const createAduu = useCreateAduu()
  const updateAduu = useUpdateAduu()
  const uploadImages = useUploadImages()
  const addZurag = useAddZurag()
  const updateZurag = useUpdateZurag()
  const deleteZurag = useDeleteZurag()

  const aduunuud = aduunuudData?.aduunuud || []

  const zarlagaShaltgaan = Form.useWatch('zarlagaShaltgaan', form)
  const ooriinBish = Form.useWatch('ooriinBish', form)

  useEffect(() => {
    if (open) {
      if (aduu) {
        form.setFieldsValue({
          ner: aduu.ner,
          huis: aduu.huis,
          tursunOn: aduu.tursunOn,
          zarlagaShaltgaan: aduu.zarlagaShaltgaan,
          zarlagaOn: aduu.zarlagaOn,
          tursunGazar: aduu.tursunGazar,
          zus: aduu.zus,
          microchip: aduu.microchip,
          dnaCode: aduu.dnaCode,
          tamga: aduu.tamga,
          uraldsan: aduu.uraldsan,
          tailbar: aduu.tailbar,
          ooriinBish: aduu.ooriinBish || false,
          ezniiNer: aduu.ezniiNer,
          unaganEzen: aduu.unaganEzen,
          uulderId: aduu.uulderId,
          bulegId: aduu.bulegId,
          fatherId: aduu.fatherId,
          motherId: aduu.motherId,
        })
        setImages(
          (aduu.zupisnuud || []).map((z) => ({
            id: z.id,
            url: z.url,
            tailbar: z.tailbar,
          }))
        )
      } else {
        form.resetFields()
        if (defaultHuis) {
          form.setFieldsValue({ huis: defaultHuis })
        }
        setImages([])
      }
      setUploadingCount(0)
      setEditingTailbar(null)
    }
  }, [open, aduu, form])

  const handleSubmit = async (values: CreateAduuRequest) => {
    try {
      if (!values.zarlagaShaltgaan) {
        values.zarlagaOn = undefined
      }
      if (!values.ooriinBish) {
        values.ezniiNer = undefined
      }

      if (isEdit && aduu) {
        await updateAduu.mutateAsync({
          id: aduu.id,
          data: {
            ...values,
            zarlagaShaltgaan: values.zarlagaShaltgaan || null,
            zarlagaOn: values.zarlagaOn || null,
            ezniiNer: values.ooriinBish ? values.ezniiNer : null,
          },
        })
        for (const img of images) {
          if (img.isNew) {
            await addZurag.mutateAsync({
              aduuId: aduu.id,
              data: { url: img.url, tailbar: img.tailbar },
            })
          }
        }
        message.success('Адуу амжилттай шинэчлэгдлээ')
      } else {
        const newAduu = await createAduu.mutateAsync(values)
        for (const img of images) {
          await addZurag.mutateAsync({
            aduuId: newAduu.id,
            data: { url: img.url, tailbar: img.tailbar },
          })
        }
        message.success('Адуу амжилттай нэмэгдлээ')
        onSuccess(newAduu)
        return
      }
      onSuccess()
    } catch {
      message.error(isEdit ? 'Шинэчлэхэд алдаа гарлаа' : 'Нэмэхэд алдаа гарлаа')
    }
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file, fileList) => {
    if (file !== fileList[fileList.length - 1]) {
      return false
    }

    const remainingSlots = 10 - images.length
    if (fileList.length > remainingSlots) {
      message.warning(`${remainingSlots} зураг л оруулах боломжтой байна`)
    }

    const filesToUpload = fileList.slice(0, remainingSlots)
    if (filesToUpload.length === 0) return false

    setUploading(true)
    setUploadingCount(filesToUpload.length)

    try {
      const result = await uploadImages.mutateAsync({ files: filesToUpload, folder: 'horses' })
      const newImages: ZuragInfo[] = result.images.map((img) => ({
        url: img.url,
        isNew: true,
      }))
      setImages((prev) => [...prev, ...newImages])
      message.success(`${filesToUpload.length} зураг амжилттай хуулагдлаа`)
    } catch {
      message.error('Зураг хуулахад алдаа гарлаа')
    } finally {
      setUploading(false)
      setUploadingCount(0)
    }

    return false
  }

  const handleRemoveImage = async (imageInfo: ZuragInfo, index: number) => {
    if (imageInfo.id) {
      setDeletingUrl(imageInfo.url)
      try {
        await deleteZurag.mutateAsync(imageInfo.id)
        message.success('Зураг устгагдлаа')
      } catch {
        message.error('Зураг устгахад алдаа гарлаа')
        setDeletingUrl(null)
        return
      }
      setDeletingUrl(null)
    }
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePreview = (url: string) => {
    setPreviewImage(url)
    setPreviewOpen(true)
  }

  const handleTailbarChange = (index: number, tailbar: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, tailbar } : img))
    )
  }

  const handleTailbarSave = async (index: number) => {
    const img = images[index]
    if (img.id && !img.isNew) {
      try {
        await updateZurag.mutateAsync({ id: img.id, data: { tailbar: img.tailbar } })
        message.success('Тайлбар хадгалагдлаа')
      } catch {
        message.error('Тайлбар хадгалахад алдаа гарлаа')
      }
    }
    setEditingTailbar(null)
  }

  const isLoading = createAduu.isPending || updateAduu.isPending

  const fatherOptions = aduunuud
    .filter((a) => a.huis === 'er' && a.id !== aduu?.id)
    .map((a) => ({ value: a.id, label: `${a.ner}${a.tursunOn ? ` (${a.tursunOn})` : ''}` }))

  const motherOptions = aduunuud
    .filter((a) => a.huis === 'em' && a.id !== aduu?.id)
    .map((a) => ({ value: a.id, label: `${a.ner}${a.tursunOn ? ` (${a.tursunOn})` : ''}` }))

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? `${uploadingCount} зураг...` : 'Зураг'}</div>
    </div>
  )

  return (
    <Modal
      title={
        <Flex align="center" gap={12}>
          <span style={{ fontSize: 20 }}>🐴</span>
          <span>{isEdit ? 'Адуу засах' : 'Шинэ адуу нэмэх'}</span>
        </Flex>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      okText={isEdit ? 'Хадгалах' : 'Нэмэх'}
      cancelText="Болих"
      width={800}
      destroyOnHidden
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ uraldsan: false, ooriinBish: false }}
        size="large"
      >
        {/* Image Upload Section */}
        <SectionHeader icon={<CameraOutlined />} title="Зураг" />
        <div
          style={{
            background: '#fafafa',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {images.map((imageInfo, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 100 }}>
                <div
                  style={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={imageInfo.url}
                    alt={`horse-${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      opacity: deletingUrl === imageInfo.url ? 0.5 : 1,
                    }}
                    onClick={() => handlePreview(imageInfo.url)}
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
                      gap: 8,
                      opacity: deletingUrl === imageInfo.url ? 1 : 0,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (deletingUrl !== imageInfo.url) {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
                        e.currentTarget.style.opacity = '1'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingUrl !== imageInfo.url) {
                        e.currentTarget.style.background = 'rgba(0,0,0,0)'
                        e.currentTarget.style.opacity = '0'
                      }
                    }}
                  >
                    {deletingUrl === imageInfo.url ? (
                      <LoadingOutlined style={{ color: '#fff', fontSize: 20 }} />
                    ) : (
                      <>
                        <EditOutlined
                          style={{ color: '#fff', fontSize: 16, cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingTailbar(index)
                          }}
                        />
                        <DeleteOutlined
                          style={{ color: '#fff', fontSize: 16, cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage(imageInfo, index)
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
                {editingTailbar === index ? (
                  <Input
                    size="small"
                    placeholder="Тайлбар..."
                    value={imageInfo.tailbar || ''}
                    onChange={(e) => handleTailbarChange(index, e.target.value)}
                    onBlur={() => handleTailbarSave(index)}
                    onPressEnter={() => handleTailbarSave(index)}
                    autoFocus
                    style={{ fontSize: 11 }}
                  />
                ) : (
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => setEditingTailbar(index)}
                    title="Тайлбар нэмэх"
                  >
                    {imageInfo.tailbar || '+ тайлбар'}
                  </Text>
                )}
              </div>
            ))}
            {images.length < 10 && (
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                accept="image/*"
                disabled={uploading}
                multiple
              >
                {uploadButton}
              </Upload>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12, marginTop: 12, display: 'block' }}>
            10 хүртэл зураг оруулах боломжтой
          </Text>
        </div>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Basic Info Section */}
        <SectionHeader icon={<IdcardOutlined />} title="Үндсэн мэдээлэл" />
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
            <Form.Item name="bulegId" label="Бүлэг">
              <Select
                placeholder="Бүлэг сонгох"
                allowClear
                options={bulegs?.map((b) => ({ value: b.id, label: b.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="zus" label="Зүс">
              <Input placeholder="Хүрэн, Халтар, Хар гэх мэт" />
            </Form.Item>
          </Col>
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
            <Form.Item name="tursunGazar" label="Төрсөн газар">
              <Input placeholder="Аймаг, сум" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Ownership Section */}
        <SectionHeader icon={<WarningOutlined />} title="Эзэмшил" />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="ooriinBish" valuePropName="checked">
              <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" />
            </Form.Item>
            <Text style={{ marginTop: -20, marginBottom: 12, display: 'block' }}>Өөрийн адуу биш</Text>
          </Col>
          {ooriinBish && (
            <Col xs={24} sm={12}>
              <Form.Item name="ezniiNer" label="Эзний нэр">
                <Input placeholder="Эзэмшигчийн нэр" />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="unaganEzen" label="Унаган эзэн">
              <Input placeholder="Унаган эзний нэр" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Зарлага Section */}
        <SectionHeader icon={<WarningOutlined />} title="Зарлага" />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="zarlagaShaltgaan" label="Зарлага шалтгаан">
              <Select
                placeholder="Сонгох..."
                allowClear
                options={zarlagaOptions}
              />
            </Form.Item>
          </Col>
          {zarlagaShaltgaan && (
            <Col xs={24} sm={12}>
              <Form.Item name="zarlagaOn" label="Зарлага он">
                <InputNumber
                  placeholder="2025"
                  style={{ width: '100%' }}
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Parents Section */}
        <SectionHeader icon={<TeamOutlined />} title="Удам угсаа" />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="fatherId" label="Эцэг (Эр)">
              <Select
                placeholder="Эцэг сонгох"
                allowClear
                showSearch
                optionFilterProp="label"
                options={fatherOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="motherId" label="Эх (Эм)">
              <Select
                placeholder="Эх сонгох"
                allowClear
                showSearch
                optionFilterProp="label"
                options={motherOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Identification Section */}
        <SectionHeader icon={<SafetyCertificateOutlined />} title="Таних тэмдэг" />
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="microchip" label="Микрочип">
              <Input placeholder="Дугаар" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="dnaCode" label="DNA код">
              <Input placeholder="Код" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="tamga" label="Тамга">
              <Input placeholder="Тамга тодорхойлолт" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item name="uraldsan" valuePropName="checked">
              <Flex align="center" gap={12}>
                <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" />
                <Text>Уралдаанд оролцсон</Text>
              </Flex>
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* Notes Section */}
        <SectionHeader icon={<FileTextOutlined />} title="Нэмэлт мэдээлэл" />
        <Form.Item name="tailbar">
          <TextArea
            rows={3}
            placeholder="Адууны онцлог, түүх, бусад мэдээлэл..."
            style={{ resize: 'none' }}
          />
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
