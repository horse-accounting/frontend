import { useEffect } from 'react'
import { Modal, Form, Input, App } from 'antd'
import {
  useCreateUulder,
  useUpdateUulder,
  type Uulder,
  type CreateUulderRequest,
} from '../api'

const { TextArea } = Input

interface AddEditUulderModalProps {
  open: boolean
  uulder: Uulder | null
  onClose: () => void
  onSuccess: () => void
}

export function AddEditUulderModal({ open, uulder, onClose, onSuccess }: AddEditUulderModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!uulder

  const { message } = App.useApp()

  const createUulder = useCreateUulder()
  const updateUulder = useUpdateUulder()

  useEffect(() => {
    if (open) {
      if (uulder) {
        form.setFieldsValue({
          name: uulder.name,
          description: uulder.description,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, uulder, form])

  const handleSubmit = async (values: CreateUulderRequest) => {
    try {
      if (isEdit && uulder) {
        await updateUulder.mutateAsync({ id: uulder.id, data: values })
        message.success('Үүлдэр амжилттай шинэчлэгдлээ')
      } else {
        await createUulder.mutateAsync(values)
        message.success('Үүлдэр амжилттай нэмэгдлээ')
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
      title={isEdit ? 'Үүлдэр засах' : 'Үүлдэр нэмэх'}
      open={open}
      onCancel={handleCancel}
      onOk={form.submit}
      okText={isEdit ? 'Хадгалах' : 'Нэмэх'}
      cancelText="Болих"
      confirmLoading={createUulder.isPending || updateUulder.isPending}
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
          rules={[{ required: true, message: 'Үүлдрийн нэр оруулна уу' }]}
        >
          <Input placeholder="Жишээ: Монгол адуу" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Тайлбар"
        >
          <TextArea
            rows={4}
            placeholder="Үүлдрийн тайлбар..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
