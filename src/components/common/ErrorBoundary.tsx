import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from './ErrorState'
import { logger } from '../../utils/logger'
import { pesanError } from '../../utils/errors'

type Props = {
  children: ReactNode
  /** Nilai yang jika berubah (mis. path halaman) mengosongkan error. */
  resetKey?: string
}

type State = { error: unknown; resetKey?: string }

/** Error boundary level halaman dengan tombol "Coba lagi". */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) return { error: null, resetKey: props.resetKey }
    return null
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    logger.error('ErrorBoundary', { error, componentStack: info.componentStack })
  }

  private cobaLagi = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <ErrorState halaman judul="Halaman ini mengalami masalah" pesan={pesanError(this.state.error)} onCobaLagi={this.cobaLagi} />
      )
    }
    return this.props.children
  }
}
