import { Form, Input, Button, Typography, Card, Result, App, Steps } from 'antd'
import { MailOutlined, ArrowLeftOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForgotPassword, useVerifyResetCode, useResetPassword } from '../api'

const { Title, Text, Paragraph } = Typography

export function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const navigate = useNavigate()
  const { message } = App.useApp()

  const forgotPassword = useForgotPassword()
  const verifyResetCode = useVerifyResetCode()
  const resetPassword = useResetPassword()

  // Step 1: Email input
  const handleEmailSubmit = (values: { email: string }) => {
    forgotPassword.mutate(values, {
      onSuccess: (result) => {
        message.success(result.message)
        setEmail(values.email)
        setCurrentStep(1)
      },
      onError: (error) => {
        message.error(error.message)
      },
    })
  }

  // Step 2: Verify 6-digit code
  const handleCodeSubmit = (values: { code: string }) => {
    verifyResetCode.mutate(
      { email, code: values.code },
      {
        onSuccess: (result) => {
          message.success(result.message)
          setResetToken(result.data.resetToken)
          setCurrentStep(2)
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  // Step 3: Set new password
  const handlePasswordSubmit = (values: { newPassword: string }) => {
    resetPassword.mutate(
      { resetToken, newPassword: values.newPassword },
      {
        onSuccess: (result) => {
          message.success(result.message)
          setCurrentStep(3)
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  // Resend code
  const handleResendCode = () => {
    forgotPassword.mutate(
      { email },
      {
        onSuccess: (result) => {
          message.success(result.message)
        },
        onError: (error) => {
          message.error(error.message)
        },
      }
    )
  }

  // Success state
  if (currentStep === 3) {
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
            <Title level={2}>Нууц үг сэргээх</Title>
          </div>

          <Steps
            current={currentStep}
            size="small"
            style={{ marginBottom: 32 }}
            items={[
              { title: 'Имэйл' },
              { title: 'Код' },
              { title: 'Шинэ нууц үг' },
            ]}
          />

          {/* Step 1: Email */}
          {currentStep === 0 && (
            <>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Бүртгэлтэй имэйл хаягаа оруулна уу. 6 оронтой код илгээгдэх болно.
              </Text>
              <Form
                layout="vertical"
                onFinish={handleEmailSubmit}
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
                    prefix={<MailOutlined />}
                    placeholder="example@mail.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={forgotPassword.isPending}
                    block
                  >
                    Код илгээх
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          {/* Step 2: 6-digit code */}
          {currentStep === 1 && (
            <>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                <strong>{email}</strong> хаяг руу илгээсэн 6 оронтой кодоо оруулна уу.
              </Text>
              <Form
                layout="vertical"
                onFinish={handleCodeSubmit}
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

                <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={verifyResetCode.isPending}
                    block
                  >
                    Код шалгах
                  </Button>
                </Form.Item>
              </Form>

              <div className="auth-footer">
                <Text type="secondary">Код ирээгүй юу? </Text>
                <Button
                  type="link"
                  onClick={handleResendCode}
                  loading={forgotPassword.isPending}
                  style={{ padding: 0 }}
                >
                  Дахин илгээх
                </Button>
              </div>
            </>
          )}

          {/* Step 3: New password */}
          {currentStep === 2 && (
            <>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Шинэ нууц үгээ оруулна уу.
              </Text>
              <Form
                layout="vertical"
                onFinish={handlePasswordSubmit}
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
            </>
          )}

          {currentStep === 0 && (
            <div className="auth-footer">
              <Link to="/login">
                <ArrowLeftOutlined /> Нэвтрэх хуудас руу буцах
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
