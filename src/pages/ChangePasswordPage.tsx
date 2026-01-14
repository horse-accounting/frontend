import { Form, Input, Button, Typography, Card, message } from 'antd'
import { LockOutlined, ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useChangePassword } from '../api'

const { Title, Text } = Typography

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ChangePasswordPage() {
  const [form] = Form.useForm<ChangePasswordFormData>()
  const navigate = useNavigate()
  const changePassword = useChangePassword()

  const handleSubmit = async (values: ChangePasswordFormData) => {
    changePassword.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: (result) => {
          message.success(result.message)
          form.resetFields()
          navigate('/')
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, padding: '4px 0' }}
      >
        Буцах
      </Button>

      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <SafetyOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>
            Нууц үг солих
          </Title>
          <Text type="secondary">
            Аюулгүй байдлын үүднээс нууц үгээ тогтмол солих нь зүйтэй
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="currentPassword"
            label="Одоогийн нууц үг"
            rules={[
              { required: true, message: 'Одоогийн нууц үгээ оруулна уу' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Одоогийн нууц үгээ оруулна уу"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Шинэ нууц үг"
            rules={[
              { required: true, message: 'Шинэ нууц үгээ оруулна уу' },
              { min: 6, message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' },
            ]}
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Хамгийн багадаа 6 тэмдэгт
              </Text>
            }
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Шинэ нууц үгээ оруулна уу"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Шинэ нууц үг давтах"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Нууц үгээ давтан оруулна уу' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Нууц үг таарахгүй байна'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Шинэ нууц үгээ дахин оруулна уу"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={changePassword.isPending}
              block
            >
              Нууц үг солих
            </Button>
            <Button
              size="large"
              block
              onClick={() => navigate('/')}
              style={{ marginTop: 12 }}
            >
              Болих
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
