import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '42%'])

  const features = [
    {
      icon: '🧠',
      title: 'TF-IDF Summarization',
      description: 'Advanced extractive summarization using Term Frequency-Inverse Document Frequency to distill long articles into core insights.',
    },
    {
      icon: '🎭',
      title: 'Sentiment Analysis',
      description: 'VADER sentiment scoring delivers accurate emotional context for each article, helping you gauge market sentiment instantly.',
    },
    {
      icon: '🔍',
      title: 'Keyword Extraction',
      description: 'Intelligent keyword identification powered by machine learning techniques to track trending topics in real-time.',
    },
  ]

  const stats = [
    { label: 'Real-Time News', value: 'Live Fetching', color: 'indigo' },
    { label: 'Architecture', value: 'FastAPI + React', color: 'emerald' },
    { label: 'Intelligence', value: 'Multi-Layer NLP', color: 'purple' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/75 bg-slate-950/85 px-6 py-20 shadow-[0_0_120px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl md:px-12 lg:px-16 mb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.12),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(16,185,129,0.08),transparent_18%),radial-gradient(circle_at_25%_80%,rgba(56,189,248,0.06),transparent_20%)] opacity-100" />
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl opacity-60"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl opacity-50"
      />
      <div className="absolute inset-x-8 top-8 h-56 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:92px_92px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring', bounce: 0.35 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-200 shadow-[0_0_24px_-10px_rgba(6,182,212,0.35)] backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
            </span>
            System Online & Processing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.85 }}
            className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight"
          >
            Advanced News <br className="hidden sm:block" /> Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300/90 sm:text-xl"
          >
            Transform raw articles into actionable insights instantly. Our multi-layer NLP pipeline performs real-time extractive summarization, sentiment analysis, and keyword detection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {['React 19', 'FastAPI', 'Python', 'NLTK', 'Scikit-learn', 'TF-IDF', 'VADER'].map((tech, idx) => (
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                key={idx}
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 backdrop-blur-md transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-3 mb-20"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative overflow-hidden rounded-[1.75rem] border border-slate-700/60 bg-slate-900/75 p-8 text-center group transition-all duration-300 ${
                stat.color === 'indigo'
                  ? 'shadow-[0_20px_75px_-40px_rgba(99,102,241,0.35)]'
                  : stat.color === 'emerald'
                  ? 'shadow-[0_20px_75px_-40px_rgba(16,185,129,0.25)]'
                  : 'shadow-[0_20px_75px_-40px_rgba(167,139,250,0.25)]'
              }`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 bg-gradient-to-br ${
                stat.color === 'indigo' ? 'from-indigo-500 to-transparent' : stat.color === 'emerald' ? 'from-emerald-500 to-transparent' : 'from-purple-500 to-transparent'
              }`} />
              <div className={`relative text-sm font-semibold uppercase tracking-[0.28em] mb-3 ${
                stat.color === 'indigo' ? 'text-indigo-300' : stat.color === 'emerald' ? 'text-emerald-300' : 'text-purple-300'
              }`}>
                {stat.label}
              </div>
              <div className="relative text-3xl font-semibold text-white tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">AI Capabilities</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-400 mx-auto rounded-full opacity-60" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-3 mb-16"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-700/60 bg-slate-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:bg-slate-900/90 hover:shadow-[0_30px_90px_-30px_rgba(99,102,241,0.18)]"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-700/80 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-indigo-300">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row mt-10"
        >
          <motion.a
            href="#news"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-10 py-4 text-base font-semibold text-white shadow-[0_0_40px_-10px_rgba(56,189,248,0.45)] transition hover:from-indigo-500 hover:to-cyan-500"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative">Explore Live Insights →</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
