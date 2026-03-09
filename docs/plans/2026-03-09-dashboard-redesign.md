# Dashboard Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Дашбоардыг Pie donut chart, насаар ангилал, сайжруулсан хүснэгтүүдтэй болгох.

**Architecture:** `@ant-design/charts` Pie chart-ийг хүйсийн харьцаанд, Ant Design Table + Progress bar-ийг насаар/үүлдрээр/бүлгээр ангилалд ашиглана. Нэг `DashboardPage.tsx` файл дотор бүх өөрчлөлт хийгдэнэ.

**Tech Stack:** React 19, Ant Design 6, @ant-design/charts (Pie), TanStack React Query

---

### Task 1: Install @ant-design/charts

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

Run: `pnpm add @ant-design/charts`

**Step 2: Verify installation**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @ant-design/charts for dashboard donut chart"
```

---

### Task 2: Replace gender Progress bars with Donut chart

**Files:**
- Modify: `src/pages/DashboardPage.tsx`

**Step 1: Add Pie import**

Add to the top of DashboardPage.tsx:
```tsx
import { Pie } from '@ant-design/charts'
```

**Step 2: Replace the "Хүйсээр" Card content (lines 156-186)**

Replace the entire `{/* Sex Distribution */}` Col block with a Pie donut chart:

```tsx
<Col xs={24} lg={8}>
  <Card
    title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📊</span><span>Хүйсээр</span></div>}
    style={{ height: '100%' }}
  >
    <Spin spinning={isLoading}>
      {totalAduu > 0 ? (
        <Pie
          data={[
            { type: 'Эр', value: erCount },
            { type: 'Эм', value: emCount },
          ]}
          angleField="value"
          colorField="type"
          innerRadius={0.6}
          height={220}
          color={['#1890ff', '#eb2f96']}
          label={{
            text: (d: { type: string; value: number }) => `${d.type}: ${d.value}`,
            style: { fontSize: 13, fontWeight: 500 },
          }}
          legend={{ position: 'bottom' }}
          annotations={[
            {
              type: 'text',
              style: {
                text: `${totalAduu}`,
                x: '50%',
                y: '50%',
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 'bold',
              },
            },
          ]}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">Өгөгдөл байхгүй</Text>
        </div>
      )}
      {(niit?.zarlagaToo ?? 0) > 0 && (
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, marginTop: 8, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Зарлага: </Text>
          <Text type="warning" strong>{niit?.zarlagaToo}</Text>
        </div>
      )}
    </Spin>
  </Card>
</Col>
```

**Step 3: Verify dev server renders the donut**

Run: `pnpm dev`
Expected: Dashboard shows donut chart with blue (Эр) and pink (Эм) segments, total number in center.

**Step 4: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: replace gender progress bars with donut chart on dashboard"
```

---

### Task 3: Add "Насаар ангилал" section (new 3rd row)

**Files:**
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/api/types.ts` (NasAngilal already exported — no changes needed)

**Step 1: Add the new Row between the 2nd row and the Breed/Group tables**

Insert a new `<Row>` block after the closing `</Row>` of the 2nd row (after line 276, before `{/* Breed & Group Distribution Tables */}`):

```tsx
{/* Age Distribution */}
<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
  <Col span={24}>
    <Card
      title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📈</span><span>Насаар ангилал</span></div>}
    >
      <Spin spinning={isLoading}>
        <Table
          dataSource={stats?.nasaarAngilal ?? []}
          rowKey="nasZereg"
          size="small"
          pagination={false}
          columns={[
            {
              title: 'Нас зэрэг',
              dataIndex: 'nasZereg',
              key: 'nasZereg',
              width: 160,
              render: (text: string) => <Text strong>{text}</Text>,
            },
            {
              title: 'Эр',
              dataIndex: 'erToo',
              key: 'erToo',
              width: 180,
              render: (val: number) => {
                const max = Math.max(...(stats?.nasaarAngilal ?? []).map(n => Math.max(n.erToo, n.emToo)), 1)
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ minWidth: 24, textAlign: 'right' }}>{val}</Text>
                    <Progress
                      percent={Math.round((val / max) * 100)}
                      showInfo={false}
                      strokeColor="#1890ff"
                      style={{ flex: 1, margin: 0 }}
                      size="small"
                    />
                  </div>
                )
              },
            },
            {
              title: 'Эм',
              dataIndex: 'emToo',
              key: 'emToo',
              width: 180,
              render: (val: number) => {
                const max = Math.max(...(stats?.nasaarAngilal ?? []).map(n => Math.max(n.erToo, n.emToo)), 1)
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ minWidth: 24, textAlign: 'right' }}>{val}</Text>
                    <Progress
                      percent={Math.round((val / max) * 100)}
                      showInfo={false}
                      strokeColor="#eb2f96"
                      style={{ flex: 1, margin: 0 }}
                      size="small"
                    />
                  </div>
                )
              },
            },
            {
              title: 'Нийт',
              dataIndex: 'niit',
              key: 'niit',
              width: 80,
              align: 'center' as const,
              render: (v: number) => <Tag color="blue">{v}</Tag>,
            },
          ]}
        />
      </Spin>
    </Card>
  </Col>
</Row>
```

**Step 2: Verify age distribution table renders**

Run: `pnpm dev`
Expected: New "Насаар ангилал" card with table showing Унага, Даага, Шүдлэн etc. with progress bars.

**Step 3: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: add age distribution table with progress bars to dashboard"
```

---

### Task 4: Enhance Breed & Group tables with visual progress bars

**Files:**
- Modify: `src/pages/DashboardPage.tsx`

**Step 1: Update the "Үүлдрээр" table columns (lines 290-309)**

Replace the breed table columns with enhanced versions that include inline Progress bars on Эр/Эм and a colored Tag on Нийт. For null uulderId rows, render name in italic gray:

```tsx
columns={[
  {
    title: 'Үүлдэр',
    dataIndex: 'uulderNer',
    key: 'uulderNer',
    render: (text: string, record) => record.uulderId ? (
      <Button
        type="link"
        size="small"
        style={{ padding: 0 }}
        onClick={() => navigate(`/aduu?uulderId=${record.uulderId}`)}
      >
        {text}
      </Button>
    ) : (
      <Text type="secondary" italic>{text}</Text>
    ),
  },
  {
    title: 'Эр',
    dataIndex: 'erToo',
    key: 'erToo',
    width: 120,
    render: (val: number) => {
      const max = Math.max(...(stats?.uulderaarAngilal ?? []).map(u => Math.max(u.erToo, u.emToo)), 1)
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text style={{ minWidth: 20, textAlign: 'right' }}>{val}</Text>
          <Progress percent={Math.round((val / max) * 100)} showInfo={false} strokeColor="#1890ff" style={{ flex: 1, margin: 0 }} size="small" />
        </div>
      )
    },
  },
  {
    title: 'Эм',
    dataIndex: 'emToo',
    key: 'emToo',
    width: 120,
    render: (val: number) => {
      const max = Math.max(...(stats?.uulderaarAngilal ?? []).map(u => Math.max(u.erToo, u.emToo)), 1)
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text style={{ minWidth: 20, textAlign: 'right' }}>{val}</Text>
          <Progress percent={Math.round((val / max) * 100)} showInfo={false} strokeColor="#eb2f96" style={{ flex: 1, margin: 0 }} size="small" />
        </div>
      )
    },
  },
  {
    title: 'Нийт',
    dataIndex: 'niit',
    key: 'niit',
    width: 70,
    align: 'center' as const,
    render: (v: number) => <Tag color="blue">{v}</Tag>,
  },
]}
```

**Step 2: Update the "Бүлгээр" table columns (lines 324-343)**

Same pattern as breed table but using `bulegaarAngilal` data and `bulegId`/`bulegNer`:

```tsx
columns={[
  {
    title: 'Бүлэг',
    dataIndex: 'bulegNer',
    key: 'bulegNer',
    render: (text: string, record) => record.bulegId ? (
      <Button
        type="link"
        size="small"
        style={{ padding: 0 }}
        onClick={() => navigate(`/aduu?bulegId=${record.bulegId}`)}
      >
        {text}
      </Button>
    ) : (
      <Text type="secondary" italic>{text}</Text>
    ),
  },
  {
    title: 'Эр',
    dataIndex: 'erToo',
    key: 'erToo',
    width: 120,
    render: (val: number) => {
      const max = Math.max(...(stats?.bulegaarAngilal ?? []).map(b => Math.max(b.erToo, b.emToo)), 1)
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text style={{ minWidth: 20, textAlign: 'right' }}>{val}</Text>
          <Progress percent={Math.round((val / max) * 100)} showInfo={false} strokeColor="#1890ff" style={{ flex: 1, margin: 0 }} size="small" />
        </div>
      )
    },
  },
  {
    title: 'Эм',
    dataIndex: 'emToo',
    key: 'emToo',
    width: 120,
    render: (val: number) => {
      const max = Math.max(...(stats?.bulegaarAngilal ?? []).map(b => Math.max(b.erToo, b.emToo)), 1)
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text style={{ minWidth: 20, textAlign: 'right' }}>{val}</Text>
          <Progress percent={Math.round((val / max) * 100)} showInfo={false} strokeColor="#eb2f96" style={{ flex: 1, margin: 0 }} size="small" />
        </div>
      )
    },
  },
  {
    title: 'Нийт',
    dataIndex: 'niit',
    key: 'niit',
    width: 70,
    align: 'center' as const,
    render: (v: number) => <Tag color="blue">{v}</Tag>,
  },
]}
```

**Step 3: Verify enhanced tables render correctly**

Run: `pnpm dev`
Expected: Breed/Group tables show inline progress bars next to numbers, Tag on totals, null rows in italic gray.

**Step 4: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: enhance breed and group tables with progress bars and visual styling"
```

---

### Task 5: Build check and final verification

**Files:**
- No new changes

**Step 1: Run TypeScript build**

Run: `pnpm build`
Expected: Build succeeds with 0 errors

**Step 2: Run lint**

Run: `pnpm lint`
Expected: No new lint errors

**Step 3: Visual verification**

Run: `pnpm dev`
Verify:
- Row 1: 4 stat cards (unchanged)
- Row 2: Donut chart (left), Recent horses (center), Top achievers (right)
- Row 3: Age distribution table with progress bars (full width)
- Row 4: Breed table (left) and Group table (right) with progress bars

**Step 4: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: dashboard redesign cleanup"
```
