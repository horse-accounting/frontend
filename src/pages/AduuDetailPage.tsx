import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Spin,
  Image,
  Space,
  Empty,
  App,
  Statistic,
  Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  IdcardOutlined,
  ExperimentOutlined,
  TagOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { useAduu, useFamilyTree, type Huis } from '../api'
import { useState } from 'react'
import { AddEditAduuModal } from '../components/AddEditAduuModal'
import { FamilyTree } from '../components/FamilyTree'

const { Title, Text, Paragraph } = Typography

const huisLabels: Record<Huis, string> = {
  azarga: 'Азарга',
  guu: 'Гүү',
  mori: 'Морь',
}

const huisColors: Record<Huis, string> = {
  azarga: 'blue',
  guu: 'magenta',
  mori: 'green',
}

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMGY1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI2NCI+8J+QtDwvdGV4dD48L3N2Zz4='

export function AduuDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const [modalOpen, setModalOpen] = useState(false)

  const aduuId = Number(id)
  const { data: aduu, isLoading, error, refetch } = useAduu(aduuId)
  const { data: familyTree } = useFamilyTree(aduuId)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !aduu) {
    return (
      <div className="page-container">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/aduu')}
          style={{ marginBottom: 16 }}
        >
          Буцах
        </Button>
        <Empty description="Адуу олдсонгүй" />
      </div>
    )
  }

  const handleEdit = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleSuccess = () => {
    setModalOpen(false)
    refetch()
    message.success('Адуу амжилттай шинэчлэгдлээ')
  }

  // Calculate age
  const currentYear = new Date().getFullYear()
  const age = aduu.tursunOn ? (aduu.nasBarsan || currentYear) - aduu.tursunOn : null

  return (
    <div className="page-container">
      {/* Header */}
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/aduu')}
        >
          Буцах
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Засах
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="detail-hero-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={6} lg={5}>
            <div className="detail-hero-image">
              {aduu.zurag && aduu.zurag.length > 0 ? (
                <Image
                  src={aduu.zurag[0]}
                  alt={aduu.ner}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  fallback={FALLBACK_IMAGE}
                />
              ) : (
                <div className="detail-hero-placeholder">🐴</div>
              )}
            </div>
          </Col>
          <Col xs={24} sm={16} md={18} lg={19}>
            <div className="detail-hero-info">
              <div style={{ marginBottom: 12 }}>
                <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                  {aduu.ner}
                </Title>
                <Space size={8} wrap>
                  <Tag color={huisColors[aduu.huis]} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {huisLabels[aduu.huis]}
                  </Tag>
                  {aduu.uulder && (
                    <Tag style={{ fontSize: 14, padding: '4px 12px' }}>{aduu.uulder.name}</Tag>
                  )}
                  {aduu.uraldsan && (
                    <Tag color="gold" icon={<TrophyOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                      Уралдсан
                    </Tag>
                  )}
                  {aduu.nasBarsan && (
                    <Tag color="default" style={{ fontSize: 14, padding: '4px 12px' }}>
                      Нас барсан ({aduu.nasBarsan})
                    </Tag>
                  )}
                </Space>
              </div>
              <Row gutter={[24, 16]}>
                {age !== null && (
                  <Col>
                    <Statistic
                      title="Нас"
                      value={age}
                      suffix="настай"
                      styles={{ content: { fontSize: 20 } }}
                    />
                  </Col>
                )}
                {aduu.tursunOn && (
                  <Col>
                    <Statistic
                      title="Төрсөн он"
                      value={aduu.tursunOn}
                      styles={{ content: { fontSize: 20 } }}
                    />
                  </Col>
                )}
                {aduu.zus && (
                  <Col>
                    <Statistic
                      title="Зүс"
                      value={aduu.zus}
                      styles={{ content: { fontSize: 20 } }}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={8}>
          {/* Gallery */}
          {aduu.zurag && aduu.zurag.length > 1 && (
            <Card title="Зургууд" size="small" style={{ marginBottom: 24 }}>
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {aduu.zurag.map((url, index) => (
                    <Col span={8} key={index}>
                      <Image
                        src={url}
                        alt={`${aduu.ner}-${index}`}
                        style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }}
                        fallback={FALLBACK_IMAGE}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </Card>
          )}

          {/* ID Info */}
          <Card title="Таних тэмдэг" size="small" style={{ marginBottom: 24 }}>
            <div className="detail-info-list">
              <div className="detail-info-item">
                <div className="detail-info-icon" style={{ background: '#e6f7ff' }}>
                  <IdcardOutlined style={{ color: '#1890ff' }} />
                </div>
                <div className="detail-info-content">
                  <Text type="secondary">Микрочип</Text>
                  <Text strong>{aduu.microchip || '—'}</Text>
                </div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-icon" style={{ background: '#f6ffed' }}>
                  <ExperimentOutlined style={{ color: '#52c41a' }} />
                </div>
                <div className="detail-info-content">
                  <Text type="secondary">DNA код</Text>
                  <Text strong>{aduu.dnaCode || '—'}</Text>
                </div>
              </div>
              <div className="detail-info-item">
                <div className="detail-info-icon" style={{ background: '#fff7e6' }}>
                  <TagOutlined style={{ color: '#fa8c16' }} />
                </div>
                <div className="detail-info-content">
                  <Text type="secondary">Тамга</Text>
                  <Text strong>{aduu.tamga || '—'}</Text>
                </div>
              </div>
              {aduu.tursunGazar && (
                <div className="detail-info-item">
                  <div className="detail-info-icon" style={{ background: '#fff1f0' }}>
                    <EnvironmentOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div className="detail-info-content">
                    <Text type="secondary">Төрсөн газар</Text>
                    <Text strong>{aduu.tursunGazar}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {aduu.tailbar && (
            <Card
              title={<><InfoCircleOutlined /> Тайлбар</>}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Paragraph style={{ margin: 0 }}>{aduu.tailbar}</Paragraph>
            </Card>
          )}
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={16}>
          {/* Parents */}
          <Card title="Эцэг эх" size="small" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div
                  className="detail-parent-card detail-parent-father"
                  onClick={() => aduu.father && navigate(`/aduu/${aduu.father.id}`)}
                  style={{ cursor: aduu.father ? 'pointer' : 'default' }}
                >
                  <div className="detail-parent-icon father">
                    <ManOutlined />
                  </div>
                  <div className="detail-parent-info">
                    <Text type="secondary">Эцэг (Азарга)</Text>
                    <Text strong style={{ fontSize: 16 }}>{aduu.father?.ner || '—'}</Text>
                    {aduu.father && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Дэлгэрэнгүй харах →
                      </Text>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div
                  className="detail-parent-card detail-parent-mother"
                  onClick={() => aduu.mother && navigate(`/aduu/${aduu.mother.id}`)}
                  style={{ cursor: aduu.mother ? 'pointer' : 'default' }}
                >
                  <div className="detail-parent-icon mother">
                    <WomanOutlined />
                  </div>
                  <div className="detail-parent-info">
                    <Text type="secondary">Эх (Гүү)</Text>
                    <Text strong style={{ fontSize: 16 }}>{aduu.mother?.ner || '—'}</Text>
                    {aduu.mother && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Дэлгэрэнгүй харах →
                      </Text>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Children (Descendants) */}
          {familyTree && familyTree.descendants && familyTree.descendants.length > 0 && (
            <Card
              title={`Үр төл (${familyTree.descendants.length})`}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[12, 12]}>
                {familyTree.descendants.map((child) => (
                  <Col xs={12} sm={8} md={6} key={child.id}>
                    <Tooltip title="Дэлгэрэнгүй харах">
                      <div
                        className="detail-child-card"
                        onClick={() => navigate(`/aduu/${child.id}`)}
                      >
                        <div className="detail-child-emoji">🐴</div>
                        <Text strong className="detail-child-name">{child.ner}</Text>
                        <Tag
                          color={huisColors[child.huis]}
                          style={{ fontSize: 11, margin: 0 }}
                        >
                          {huisLabels[child.huis]}
                        </Tag>
                      </div>
                    </Tooltip>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {/* Family Tree */}
          {familyTree && (
            <FamilyTree
              currentHorse={{
                id: aduu.id,
                ner: aduu.ner,
                huis: aduu.huis,
                zurag: aduu.zurag,
              }}
              ancestors={familyTree.ancestors}
              descendants={familyTree.descendants}
            />
          )}

          {/* Achievements */}
          {aduu.amjiltuud && aduu.amjiltuud.length > 0 && (
            <Card
              title={<><TrophyOutlined style={{ color: '#faad14' }} /> Амжилтууд</>}
              size="small"
            >
              <Row gutter={[12, 12]}>
                {aduu.amjiltuud.map((amjilt) => (
                  <Col xs={24} sm={12} key={amjilt.id}>
                    <Card size="small" style={{ background: '#fffbe6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            background: '#faad14',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 18,
                          }}
                        >
                          <TrophyOutlined />
                        </div>
                        <div>
                          <Text strong>{amjilt.temtseen}</Text>
                          <div>
                            <Tag color="gold">{amjilt.ezelsenBair}</Tag>
                            {amjilt.uraldsanOgnoo && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {amjilt.uraldsanOgnoo}
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>
      </Row>

      <AddEditAduuModal
        open={modalOpen}
        aduu={aduu}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
