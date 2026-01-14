import { Form, Input, Button, Typography, Card, message, Result } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useResetPassword } from '../api'

const { Title, Text, Paragraph } = Typography

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

export function ResetPasswordPage() {
  const [form] = Form.useForm<ResetPasswordFormData>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [resetSuccess, setResetSuccess] = useState(false)
  const resetPassword = useResetPassword()

  const token = searchParams.get('token')

  const handleSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      message.error('Токен олдсонгүй')
      return
    }

    resetPassword.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: (result) => {
          message.success(result.message)
          setResetSuccess(true)
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  if (!token) {
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
            <Result
              status="error"
              title="Токен олдсонгүй"
              subTitle="Нууц үг сэргээх линк буруу эсвэл хугацаа дууссан байна."
              extra={
                <Link to="/forgot-password">
                  <Button type="primary">Дахин оролдох</Button>
                </Link>
              }
            />
          </Card>
        </div>
      </div>
    )
  }

  if (resetSuccess) {
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
            <Result
              status="success"
              title="Нууц үг шинэчлэгдлээ"
              subTitle="Та шинэ нууц үгээрээ нэвтрэх боломжтой."
              extra={
                <Button type="primary" onClick={() => navigate('/login')}>
                  Нэвтрэх
                </Button>
              }
            />
          </Card>
        </div>
      </div>
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
            <Title level={2}>Шинэ нууц үг</Title>
            <Text type="secondary">Шинэ нууц үгээ оруулна уу</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
          >
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

            <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={resetPassword.isPending}
                block
              >
                Нууц үг шинэчлэх
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}
