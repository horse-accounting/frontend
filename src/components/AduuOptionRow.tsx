import { Avatar } from 'antd'
import { FALLBACK_IMAGE_THUMB } from '../api'

// Эцэг/эх сонголтын жагсаалтын нэг мөр — жижиг thumbnail + нэр + төрсөн он.
// Select-ийн optionRender дотор ашиглана (AddEditAduuModal, FamilyTree хоёулаа).
export function AduuOptionRow({
  image,
  ner,
  tursunOn,
}: {
  image?: string
  ner: string
  tursunOn?: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      {image ? (
        <img
          src={image}
          width={28}
          height={28}
          style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE_THUMB
          }}
        />
      ) : (
        <Avatar
          size={28}
          shape="square"
          style={{ borderRadius: 6, background: '#f0f5ff', color: '#1890ff', flexShrink: 0 }}
        >
          🐴
        </Avatar>
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {ner}
        {tursunOn ? ` (${tursunOn})` : ''}
      </span>
    </div>
  )
}
