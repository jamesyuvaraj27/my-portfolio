import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Portfolio render error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center px-4">
          <section className="glass-panel max-w-lg rounded-[2rem] p-8 text-center">
            <h1 className="text-2xl font-semibold text-white">Something went wrong.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Refresh the page or try again in a moment. The dashboard data is safe.
            </p>
            <button
              type="button"
              className="magnetic-button mt-6"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
