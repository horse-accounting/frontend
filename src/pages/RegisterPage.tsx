import { Form, Input, Button, Typography, Card, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../api'

const { Title, Text, Paragraph } = Typography

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const [form] = Form.useForm<RegisterFormData>()
  const navigate = useNavigate()
  const register = useRegister()

  const handleSubmit = async (values: RegisterFormData) => {
    register.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          message.success('Бүртгэл амжилттай үүслээ')
          navigate('/')
        },
        onError: (error) => {
          message.error(error.message || 'Бүртгэлд алдаа гарлаа')
        },
      }
    )
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
            <Title level={2}>Бүртгүүлэх</Title>
            <Text type="secondary">Шинэ хаяг үүсгэх</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Нэр"
              rules={[
                { required: true, message: 'Нэрээ оруулна уу' },
                { min: 2, message: 'Нэр хамгийн багадаа 2 тэмдэгт' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Таны нэр"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Имэйл"
              rules={[
                { required: true, message: 'Имэйл хаягаа оруулна уу' },
                { type: 'email', message: 'Зөв имэйл хаяг оруулна уу' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@mail.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг"
              rules={[
                { required: true, message: 'Нууц үгээ оруулна уу' },
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
              label="Нууц үг давтах"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Нууц үгээ давтан оруулна уу' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
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

            <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={register.isPending}
                block
              >
                Бүртгүүлэх
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">эсвэл</Text>
          </Divider>

          <div className="auth-footer">
            <Text>Бүртгэлтэй юу? </Text>
            <Link to="/login">Нэвтрэх</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
