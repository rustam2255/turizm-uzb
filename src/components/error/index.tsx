import React, { ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}
interface ErrorBoundaryProps {
  children: ReactNode;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(error, info);
  }
  render(): ReactNode {
    if (this.state.hasError) {
      return <h1>{this.state.hasError}</h1>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
