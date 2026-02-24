import { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, App } from 'antd'
import dayjs from 'dayjs'
import {
  useCreateAmjilt,
  useUpdateAmjilt,
  type Amjilt,
  type CreateAmjiltRequest,
} from '../api'

const { TextArea } = Input

interface AddEditAmjiltModalProps {
  open: boolean
  amjilt: Amjilt | null
  aduuId: number
  onClose: () => void
  onSuccess: () => void
}

export function AddEditAmjiltModal({ open, amjilt, aduuId, onClose, onSuccess }: AddEditAmjiltModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!amjilt

  const { message } = App.useApp()

  const createAmjilt = useCreateAmjilt()
  const updateAmjilt = useUpdateAmjilt()

  useEffect(() => {
    if (open) {
      if (amjilt) {
        form.setFieldsValue({
          temtseen: amjilt.temtseen,
          ezelsenBair: amjilt.ezelsenBair,
          uraldsanOgnoo: amjilt.uraldsanOgnoo ? dayjs(amjilt.uraldsanOgnoo) : null,
          unaach: amjilt.unaach,
          gazarBairshil: amjilt.gazarBairshil,
          tailbar: amjilt.tailbar,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, amjilt, form])

  const handleSubmit = async (values: {
    temtseen: string
    ezelsenBair: string
    uraldsanOgnoo?: dayjs.Dayjs
    unaach?: string
    gazarBairshil?: string
    tailbar?: string
  }) => {
    try {
      const submitData: CreateAmjiltRequest = {
        aduuId,
        temtseen: values.temtseen,
        ezelsenBair: values.ezelsenBair,
        uraldsanOgnoo: values.uraldsanOgnoo?.format('YYYY-MM-DD'),
        unaach: values.unaach,
        gazarBairshil: values.gazarBairshil,
        tailbar: values.tailbar,
      }

      if (isEdit && amjilt) {
        const { aduuId: _, ...updateData } = submitData
        await updateAmjilt.mutateAsync({ id: amjilt.id, data: updateData })
        message.success('Амжилт амжилттай шинэчлэгдлээ')
      } else {
        await createAmjilt.mutateAsync(submitData)
        message.success('Амжилт амжилттай нэмэгдлээ')
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
      title={isEdit ? 'Амжилт засах' : 'Амжилт нэмэх'}
      open={open}
      onCancel={handleCancel}
      onOk={form.submit}
      okText={isEdit ? 'Хадгалах' : 'Нэмэх'}
      cancelText="Болих"
      confirmLoading={createAmjilt.isPending || updateAmjilt.isPending}
      destroyOnClose
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="temtseen"
          label="Тэмцээний нэр"
          rules={[{ required: true, message: 'Тэмцээний нэр оруулна уу' }]}
        >
          <Input placeholder="Жишээ: Наадмын их наадам 2024" />
        </Form.Item>

        <Form.Item
          name="ezelsenBair"
          label="Эзэлсэн байр"
          rules={[{ required: true, message: 'Эзэлсэн байр оруулна уу' }]}
        >
          <Input placeholder="Жишээ: 1-р байр, Түрүү морь" />
        </Form.Item>

        <Form.Item
          name="uraldsanOgnoo"
          label="Уралдсан огноо"
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Огноо сонгох"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="unaach"
          label="Унаач"
        >
          <Input placeholder="Жишээ: Б.Тэмүүжин" />
        </Form.Item>

        <Form.Item
          name="gazarBairshil"
          label="Газар байршил"
        >
          <Input placeholder="Жишээ: Хүй Долоон Худаг" />
        </Form.Item>

        <Form.Item
          name="tailbar"
          label="Тайлбар"
        >
          <TextArea
            rows={3}
            placeholder="Нэмэлт тайлбар..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
