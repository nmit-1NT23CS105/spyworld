import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CineSpy ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#e6ecf5] flex items-center justify-center p-4">
          <div className="neu-card p-6 sm:p-8 max-w-md w-full text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl neu-card-sm flex items-center justify-center text-rose-600">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                An unexpected display error occurred. Don't worry, your match can be restarted safely.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-2xl neu-inset text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  Error Details:
                </span>
                <p className="text-xs font-mono text-rose-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3.5 neu-btn-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} />
                <span>Reload Game</span>
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="py-3.5 px-4 neu-btn text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Home size={15} />
                <span>Lobby</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
