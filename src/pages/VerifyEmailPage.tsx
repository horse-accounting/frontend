import { Form, Input, Button, Typography, Card, App } from 'antd'
import { LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate, Navigate } from 'react-router-dom'
import { useVerifyEmail, useSendVerificationCode } from '../api'
import { usePendingVerificationEmail, useAccessToken } from '../stores'

const { Title, Text, Paragraph } = Typography

interface VerifyEmailFormData {
  code: string
  newPassword: string
  confirmPassword: string
}

export function VerifyEmailPage() {
  const [form] = Form.useForm<VerifyEmailFormData>()
  const navigate = useNavigate()
  const verifyEmail = useVerifyEmail()
  const sendCode = useSendVerificationCode()
  const { message } = App.useApp()
  const pendingEmail = usePendingVerificationEmail()
  const accessToken = useAccessToken()

  // No pending verification - redirect to login
  if (!accessToken || !pendingEmail) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = (values: VerifyEmailFormData) => {
    verifyEmail.mutate(
      { code: values.code, newPassword: values.newPassword },
      {
        onSuccess: (result) => {
          message.success(result.message)
          navigate('/')
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  const handleResendCode = () => {
    sendCode.mutate(undefined, {
      onSuccess: (result) => {
        message.success(result.message)
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
            <Title level={2}>Имэйл баталгаажуулалт</Title>
            <Text type="secondary">
              <strong>{pendingEmail}</strong> хаяг руу 6 оронтой код илгээгдсэн. Кодоо оруулж, шинэ нууц үгээ тохируулна уу.
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
              name="code"
              label="Баталгаажуулах код"
              rules={[
                { required: true, message: 'Кодоо оруулна уу' },
                { len: 6, message: 'Код 6 оронтой байх ёстой' },
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="000000"
                size="large"
                maxLength={6}
                style={{ letterSpacing: 8, textAlign: 'center', fontWeight: 600 }}
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
              label="Нууц үг давтах"
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

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={verifyEmail.isPending}
                block
              >
                Баталгаажуулах
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <Text type="secondary">Код ирээгүй юу? </Text>
            <Button
              type="link"
              onClick={handleResendCode}
              loading={sendCode.isPending}
              style={{ padding: 0 }}
            >
              Дахин илгээх
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
