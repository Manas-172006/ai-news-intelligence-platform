import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const features = [
    {
      icon: '🧠',
      title: 'TF-IDF Summarization',
      description: 'Advanced extractive summarization using Term Frequency-Inverse Document Frequency vectorization to distill long articles into core insights.'
    },
    {
      icon: '🎭',
      title: 'Sentiment Analysis',
      description: 'VADER sentiment scoring delivers accurate emotional context for each article, helping you gauge market sentiment instantly.'
    },
    {
      icon: '🔍',
      title: 'Keyword Extraction',
      description: 'Intelligent keyword identification powered by machine learning techniques to track trending topics in real-time.'
    }
  ]

  const stats = [
    { label: 'Real-Time News', value: 'Live Fetching', color: 'indigo' },
    { label: 'Architecture', value: 'FastAPI + React', color: 'emerald' },
    { label: 'Intelligence', value: 'Multi-Layer NLP', color: 'purple' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] md:px-12 lg:px-16 mb-16">
      {/* Animated background gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="relative mx-auto max-w-6xl z-10">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Online & Processing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent drop-shadow-sm leading-tight"
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

          {/* Tech Stack Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {['React 19', 'FastAPI', 'Python', 'NLTK', 'Scikit-learn', 'TF-IDF', 'VADER'].map((tech, idx) => (
              <motion.span
                whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                key={idx}
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300 backdrop-blur-md transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
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
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative overflow-hidden rounded-[1.5rem] border backdrop-blur-xl p-8 text-center group ${
                stat.color === 'indigo'
                  ? 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/10'
                  : stat.color === 'emerald'
                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                  : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10'
              } transition-all duration-300`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${
                stat.color === 'indigo' ? 'from-indigo-500 to-transparent' : stat.color === 'emerald' ? 'from-emerald-500 to-transparent' : 'from-purple-500 to-transparent'
              }`} />
              <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${
                stat.color === 'indigo' ? 'text-indigo-400' : stat.color === 'emerald' ? 'text-emerald-400' : 'text-purple-400'
              }`}>
                {stat.label}
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="text-center mb-10">
           <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Capabilities</h2>
           <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full opacity-50"></div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3 mb-16"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-[2rem] border border-slate-700/50 bg-slate-800/20 p-8 backdrop-blur-md transition-all duration-300 hover:bg-slate-800/40 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] hover:border-slate-600/50"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/80 border border-slate-700/80 text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row mt-10"
        >
          <motion.a
            href="#news"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 px-10 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition hover:from-indigo-500 hover:to-emerald-500"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative">Explore Live Insights →</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
