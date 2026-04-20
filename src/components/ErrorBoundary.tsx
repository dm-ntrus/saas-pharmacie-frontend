"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: unknown;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // logErrorToService(error, errorInfo);
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
      const maybeMessage = (error as { message?: unknown }).message;
      if (typeof maybeMessage === "string") return maybeMessage;
      if (maybeMessage && typeof maybeMessage === "object") {
        try {
          return JSON.stringify(maybeMessage);
        } catch {
          return "Une erreur inattendue est survenue.";
        }
      }
      try {
        return JSON.stringify(error);
      } catch {
        return "Une erreur inattendue est survenue.";
      }
    }
    return "Une erreur inattendue est survenue.";
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (
          React.isValidElement(this.props.fallback) ||
          typeof this.props.fallback === "string" ||
          typeof this.props.fallback === "number"
        ) {
          return this.props.fallback;
        }
      }

      return (
        <div className="error-boundary">
          <h1>Une erreur est survenue</h1>
          <p>{this.getErrorMessage(this.state.error)}</p>
          <button onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
