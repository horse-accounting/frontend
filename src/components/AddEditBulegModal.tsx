import { useEffect } from 'react'
import { Modal, Form, Input, App } from 'antd'
import {
  useCreateBuleg,
  useUpdateBuleg,
  type Buleg,
  type CreateBulegRequest,
} from '../api'

const { TextArea } = Input

interface AddEditBulegModalProps {
  open: boolean
  buleg: Buleg | null
  onClose: () => void
  onSuccess: () => void
}

export function AddEditBulegModal({ open, buleg, onClose, onSuccess }: AddEditBulegModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!buleg

  const { message } = App.useApp()

  const createBuleg = useCreateBuleg()
  const updateBuleg = useUpdateBuleg()

  useEffect(() => {
    if (open) {
      if (buleg) {
        form.setFieldsValue({
          name: buleg.name,
          description: buleg.description,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, buleg, form])

  const handleSubmit = async (values: CreateBulegRequest) => {
    try {
      if (isEdit && buleg) {
        await updateBuleg.mutateAsync({ id: buleg.id, data: values })
        message.success('Бүлэг амжилттай шинэчлэгдлээ')
      } else {
        await createBuleg.mutateAsync(values)
        message.success('Бүлэг амжилттай нэмэгдлээ')
      }
      onSuccess()
    } catch {
      message.error('Алдаа гарлаа')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Бүлэг засах' : 'Бүлэг нэмэх'}
      open={open}
      onCancel={handleCancel}
      onOk={form.submit}
      okText={isEdit ? 'Хадгалах' : 'Нэмэх'}
      cancelText="Болих"
      confirmLoading={createBuleg.isPending || updateBuleg.isPending}
      destroyOnClose
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Нэр"
          rules={[{ required: true, message: 'Бүлгийн нэр оруулна уу' }]}
        >
          <Input placeholder="Жишээ: Азарга А-ийн төл" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Тайлбар"
        >
          <TextArea
            rows={4}
            placeholder="Бүлгийн тайлбар..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
