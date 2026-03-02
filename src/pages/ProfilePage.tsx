import { useEffect, useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Avatar,
  Divider,
  Tag,
  Row,
  Col,
  App,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  SafetyOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import {
  useMe,
  useUpdateProfile,
  useChangePassword,
  type UpdateProfileRequest,
} from '../api'

const { Title, Text } = Typography

export function ProfilePage() {
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [editingProfile, setEditingProfile] = useState(false)
  const { message } = App.useApp()

  const { data: user } = useMe()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, profileForm])

  const handleProfileSubmit = async (values: UpdateProfileRequest) => {
    if (!user) return
    try {
      await updateProfile.mutateAsync({ id: user.id, data: values })
      message.success('Мэдээлэл амжилттай шинэчлэгдлээ')
      setEditingProfile(false)
    } catch {
      message.error('Шинэчлэхэд алдаа гарлаа')
    }
  }

  const handlePasswordSubmit = async (values: { currentPassword: string; newPassword: string }) => {
    try {
      const result = await changePassword.mutateAsync(values)
      message.success(result.message)
      passwordForm.resetFields()
    } catch (error) {
      message.error((error as Error).message || 'Алдаа гарлаа')
    }
  }

  const handleCancelEdit = () => {
    profileForm.setFieldsValue({
      name: user?.name,
      email: user?.email,
    })
    setEditingProfile(false)
  }

  if (!user) return null

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">👤</div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Профайл</Title>
            <Text type="secondary">Хувийн мэдээлэл удирдах</Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Info */}
        <Col xs={24} lg={14}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
              <Avatar
                size={72}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', fontSize: 32 }}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>{user.name}</Title>
                <Text type="secondary">{user.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={user.role === 'admin' ? 'blue' : 'default'}>
                    {user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>Хувийн мэдээлэл</Text>
              {!editingProfile && (
                <Button icon={<EditOutlined />} onClick={() => setEditingProfile(true)}>
                  Засах
                </Button>
              )}
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileSubmit}
            >
              <Form.Item
                name="name"
                label="Нэр"
                rules={[{ required: true, message: 'Нэр оруулна уу' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Нэр"
                  disabled={!editingProfile}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="И-мэйл"
                rules={[
                  { required: true, message: 'И-мэйл оруулна уу' },
                  { type: 'email', message: 'И-мэйл буруу байна' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="И-мэйл"
                  disabled={!editingProfile}
                  size="large"
                />
              </Form.Item>

              {editingProfile && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updateProfile.isPending}
                  >
                    Хадгалах
                  </Button>
                  <Button onClick={handleCancelEdit}>
                    Болих
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={10}>
          {/* Account Info */}
          <Card style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
              Бүртгэлийн мэдээлэл
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary"><CalendarOutlined /> Бүртгүүлсэн</Text>
                <Text>{new Date(user.createdAt).toLocaleDateString('mn-MN')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary"><MailOutlined /> И-мэйл баталгаажсан</Text>
                <Tag color={user.isEmailVerified ? 'green' : 'orange'}>
                  {user.isEmailVerified ? 'Тийм' : 'Үгүй'}
                </Tag>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <SafetyOutlined style={{ fontSize: 16, color: '#1890ff' }} />
              <Text strong style={{ fontSize: 16 }}>Нууц үг солих</Text>
            </div>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSubmit}
            >
              <Form.Item
                name="currentPassword"
                label="Одоогийн нууц үг"
                rules={[{ required: true, message: 'Одоогийн нууц үгээ оруулна уу' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Одоогийн нууц үг"
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Шинэ нууц үг"
                rules={[
                  { required: true, message: 'Шинэ нууц үгээ оруулна уу' },
                  { min: 6, message: 'Хамгийн багадаа 6 тэмдэгт' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Шинэ нууц үг"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Нууц үг давтах"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Нууц үгээ давтана уу' },
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
                  placeholder="Шинэ нууц үг давтах"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={changePassword.isPending}
                block
              >
                Нууц үг солих
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
