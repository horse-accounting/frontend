import { Form, Input, Button, Typography, Card, message, Result } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useForgotPassword } from '../api'

const { Title, Text, Paragraph } = Typography

interface ForgotPasswordFormData {
  email: string
}

export function ForgotPasswordPage() {
  const [form] = Form.useForm<ForgotPasswordFormData>()
  const [emailSent, setEmailSent] = useState(false)
  const forgotPassword = useForgotPassword()

  const handleSubmit = async (values: ForgotPasswordFormData) => {
    forgotPassword.mutate(values, {
      onSuccess: (result) => {
        message.success(result.message)
        setEmailSent(true)
      },
      onError: (error) => {
        message.error(error.message)
      },
    })
  }

  if (emailSent) {
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
              title="Имэйл илгээгдлээ"
              subTitle="Нууц үг сэргээх заавар таны имэйл хаяг руу илгээгдлээ. Имэйлээ шалгана уу."
              extra={
                <Link to="/login">
                  <Button type="primary">Нэвтрэх хуудас руу буцах</Button>
                </Link>
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
            <Text type="secondary">Бүртгэлтэй имэйл хаягаа оруулна уу</Text>
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
                Сэргээх линк илгээх
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <Link to="/login">
              <ArrowLeftOutlined /> Нэвтрэх хуудас руу буцах
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
