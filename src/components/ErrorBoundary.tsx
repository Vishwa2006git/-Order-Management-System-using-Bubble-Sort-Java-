import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

export class ErrorBoundary extends (Component as any) {
  public state: any = {
    hasError: false,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): any {
    return { hasError: true, errorInfo: error.message };
  }

  public render() {
    const { hasError, errorInfo } = this.state;
    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-100 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mb-4 mx-auto" />
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-slate-500 text-sm mb-6">
              {errorInfo?.startsWith('{') ? JSON.parse(errorInfo).error : 'An unexpected error occurred.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
