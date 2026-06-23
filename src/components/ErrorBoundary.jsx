import React from 'react'
import '../styles/errorBoundary.css'

// Catches render-time errors anywhere in the tree and shows a friendly
// fallback instead of a blank white screen.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log so issues are still visible in the console / monitoring.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/home');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorboundary">
          <div className="errorboundary-content">
            <p className="errorboundary-emoji" aria-hidden="true">⚠️</p>
            <h1 className="errorboundary-title">Something went wrong</h1>
            <p className="errorboundary-text">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button className="errorboundary-btn" onClick={this.handleReload}>
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary
