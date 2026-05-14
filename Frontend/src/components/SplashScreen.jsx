import React from 'react'
import { motion } from 'framer-motion'

const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-emerald-600 p-8 rounded-full shadow-2xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">AI</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent"
        >
          AI News Intelligence Platform
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-slate-400 text-lg mb-8"
        >
          Powered by Advanced NLP & Machine Learning
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-64 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full mx-auto"
        ></motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          onClick={onComplete}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Enter Platform
        </motion.button>
      </div>
    </motion.div>
  )
}

export default SplashScreen