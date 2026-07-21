import { Component, type ReactNode } from 'react'
import { Button, Result } from 'antd'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

// Рендерийн үед гарсан гэнэтийн алдаа бүх аппыг цагаан дэлгэц болгохоос
// сэргийлж, ойлгомжтой мессеж + дахин ачаалах товч харуулна.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Алдаа гарлаа"
          subTitle="Гэнэтийн алдаа гарлаа. Хуудсыг дахин ачаална уу."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Дахин ачаалах
            </Button>
          }
        />
      )
    }
    return this.props.children
  }
}
