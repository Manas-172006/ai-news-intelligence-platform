import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home.jsx'

function App() {
  return (
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
  )
}

export default App;
