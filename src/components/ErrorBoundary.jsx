import { Component } from 'react';

import ErrorScreen from '@/components/ErrorScreen';

/**
 * Ловит падение рендера. Класс нужен: у function-компонентов
 * в React нет error boundary.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}
