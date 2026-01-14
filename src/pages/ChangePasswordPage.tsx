import { Form, Input, Button, Typography, Card, message } from 'antd'
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="dashboard-container">
      <Card className="dashboard-card" style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 24 }}>
          <Link to="/">
            <ArrowLeftOutlined /> Буцах
          </Link>
        </div>

        <div className="auth-card-header" style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Нууц үг солих</Title>
          <Text type="secondary">Одоогийн болон шинэ нууц үгээ оруулна уу</Text>
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
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Шинэ нууц үг"
            rules={[
              { required: true, message: 'Шинэ нууц үгээ оруулна уу' },
              { min: 6, message: 'Нууц үг хамгийн багадаа 6 тэмдэгт' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
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
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={changePassword.isPending}
              block
            >
              Нууц үг солих
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
