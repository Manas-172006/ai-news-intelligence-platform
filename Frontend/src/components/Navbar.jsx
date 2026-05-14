import React from 'react'

const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Neural<span className="text-cyan-400">News</span>
            </p>
            <p className="text-xs font-medium text-slate-400">AI-Powered Intelligence</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a href="#news" className="transition-colors hover:text-cyan-400">
            Live Feed
          </a>
          <a href="#about" className="transition-colors hover:text-cyan-400">
            About System
          </a>
          <a
            href="#news"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.6)]"
          >
            Access Dashboard
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
