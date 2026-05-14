import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React runtime error caught by ErrorBoundary:', error)
    console.error('Error info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-xl rounded-3xl border border-rose-500/20 bg-slate-900/95 p-8 shadow-xl shadow-rose-500/10">
            <h1 className="text-2xl font-bold text-white mb-4">Application error</h1>
            <p className="text-sm text-slate-300 mb-4">An unexpected error occurred while rendering the app. Please refresh the page or try again later.</p>
            <pre className="max-h-64 overflow-auto rounded-xl bg-slate-950/80 p-4 text-xs text-rose-200">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Home />
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App;
