import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Navbar = () => {
  const { scrollY } = useScroll()
  const background = useTransform(scrollY, [0, 120], ['rgba(15, 23, 42, 0.62)', 'rgba(15, 23, 42, 0.95)'])
  const headerShadow = useTransform(scrollY, [0, 120], ['0 0 0 rgba(0,0,0,0)', '0 30px 70px rgba(0,0,0,0.18)'])
  const borderOpacity = useTransform(scrollY, [0, 120], ['rgba(148,163,184,0.12)', 'rgba(148,163,184,0.22)'])

  return (
    <motion.header
      style={{ background, boxShadow: headerShadow, borderBottomColor: borderOpacity }}
      className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-3xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              Neural<span className="text-cyan-400">News</span>
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">AI Intelligence Platform</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a href="#news" className="transition duration-300 hover:text-cyan-300">
            Live Feed
          </a>
          <a href="#about" className="transition duration-300 hover:text-cyan-300">
            About System
          </a>
          <a
            href="#news"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/7 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_-24px_rgba(56,189,248,0.35)] transition duration-300 hover:border-cyan-400/30 hover:bg-slate-900/90 hover:text-cyan-200"
          >
            Access Dashboard
          </a>
        </nav>
      </div>
    </motion.header>
  )
}

export default Navbar
