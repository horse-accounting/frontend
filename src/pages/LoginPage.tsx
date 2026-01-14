import { Form, Input, Button, Typography, Card, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api'

const { Title, Text, Paragraph } = Typography

interface LoginFormData {
  email: string
  password: string
}

export function LoginPage() {
  const [form] = Form.useForm<LoginFormData>()
  const navigate = useNavigate()
  const login = useLogin()

  const handleSubmit = async (values: LoginFormData) => {
    login.mutate(values, {
      onSuccess: (result) => {
        message.success(result.message)
        navigate('/')
      },
      onError: (error) => {
        message.error(error.message)
      },
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-logo">🐴</div>
          <Title level={1} className="auth-title">
            Удамшил
          </Title>
          <Paragraph className="auth-description">
            Монгол адууны удам угсааг бүртгэх, хадгалах, удамшлыг хянах систем
          </Paragraph>
        </div>
      </div>

      <div className="auth-right">
        <Card className="auth-card" variant="borderless">
          <div className="auth-card-header">
            <Title level={2}>Нэвтрэх</Title>
            <Text type="secondary">Тавтай морилно уу</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Имэйл"
              rules={[
                { required: true, message: 'Имэйл хаягаа оруулна уу' },
                { type: 'email', message: 'Зөв имэйл хаяг оруулна уу' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="example@mail.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг"
              rules={[
                { required: true, message: 'Нууц үгээ оруулна уу' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: -16, marginBottom: 16 }}>
              <Link to="/forgot-password">Нууц үг мартсан?</Link>
            </div>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={login.isPending}
                block
              >
                Нэвтрэх
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">эсвэл</Text>
          </Divider>

          <div className="auth-footer">
            <Text>Шинэ хэрэглэгч үү? </Text>
            <Link to="/register">Бүртгүүлэх</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
