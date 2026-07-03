import React from 'react'
import '../styles/errorBoundary.css'

// Catches render-time errors anywhere in the tree and shows a friendly,
// professional fallback instead of a blank white screen.
//
// Intentionally dependency-free (inline SVG, plain buttons): the fallback must
// never itself throw, even if another component/module is what crashed.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log so issues are still visible in the console / monitoring.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/home');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;
    const isDev = process.env.NODE_ENV === 'development';

    return (
      <div className="errorboundary" role="alert" aria-live="assertive">
        <div className="errorboundary-card">
          <span className="errorboundary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>

          <span className="errorboundary-badge">Error</span>
          <h1 className="errorboundary-title">Something went wrong</h1>
          <p className="errorboundary-text">
            An unexpected error occurred while rendering this page. You can try again, or
            head back to the homepage.
          </p>

          {isDev && error && (
            <details className="errorboundary-details">
              <summary>Technical details</summary>
              <pre>{error.stack || error.message || String(error)}</pre>
            </details>
          )}

          <div className="errorboundary-actions">
            <button
              type="button"
              className="errorboundary-btn errorboundary-btn--primary"
              onClick={this.handleReload}
            >
              Reload page
            </button>
            <button
              type="button"
              className="errorboundary-btn errorboundary-btn--ghost"
              onClick={this.handleHome}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary
