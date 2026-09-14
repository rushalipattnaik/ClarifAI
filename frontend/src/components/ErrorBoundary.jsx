import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
            <h1 className="text-3xl font-bold text-red-400">
              Something Went Wrong
            </h1>

            <p className="mt-4 text-slate-300">
              An unexpected error occurred. Please refresh the page and try
              again.
            </p>

            <button
              onClick={() => window.location.assign("/")}
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;