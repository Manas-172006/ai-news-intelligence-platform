import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Hero from '../components/Hero.jsx'
import Navbar from '../components/Navbar.jsx'
import NewsCard from '../components/NewsCard.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
const isApiUrlDefined = Boolean(apiBaseUrl)

console.log('API URL:', apiBaseUrl, 'mode:', import.meta.env.MODE)
if (!apiBaseUrl) {
  console.error('VITE_API_BASE_URL environment variable is not set!')
}

const Home = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [configError, setConfigError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Calculate current articles
  const indexOfLastArticle = currentPage * itemsPerPage
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(articles.length / itemsPerPage)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const fetchNews = async (retryCount = 0) => {
    if (!isApiUrlDefined) {
      const configMessage = 'VITE_API_BASE_URL is missing in production configuration. Please set this variable in Vercel and redeploy.'
      console.error(configMessage)
      setConfigError(configMessage)
      setError(configMessage)
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log(`Fetching news (attempt ${retryCount + 1})`, `${apiBaseUrl}/news`)
      const response = await axios.get(`${apiBaseUrl}/news`, { timeout: 30000 }) // 30 second timeout
      const fetchedArticles = response?.data?.articles ?? []

      if (!Array.isArray(fetchedArticles) || fetchedArticles.length === 0) {
        setError('No live articles available. Please try again later.')
        setArticles([])
      } else {
        setArticles(fetchedArticles)
        setCurrentPage(1)
      }
    } catch (fetchError) {
      console.error('News fetch error:', fetchError)
      console.error('Error response:', fetchError.response)

      // Retry once on failure (for cold starts)
      if (retryCount === 0 && fetchError.code !== 'ECONNABORTED') {
        console.log('Retrying news fetch after failure...')
        setTimeout(() => fetchNews(1), 2000) // Wait 2 seconds then retry
        return
      }

      setError(
        fetchError.response?.data?.error ||
        fetchError.response?.data?.detail ||
        fetchError.message ||
        'Unable to load live news. The backend may be starting up (cold start). Please try again in a few seconds.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isApiUrlDefined) {
      setConfigError('VITE_API_BASE_URL is missing in production configuration. Please set this variable in Vercel.')
      return
    }

    fetchNews()
  }, [])

  // Calculate insights from articles
  const insights = React.useMemo(() => {
    if (!articles.length) return null

    const sentiments = articles
      .filter(article => article.sentiment)
      .map(article => article.sentiment)

    const dominantSentiment = sentiments.length > 0
      ? sentiments.reduce((a, b) =>
          sentiments.filter(v => v === a).length >= sentiments.filter(v => v === b).length ? a : b
        )
      : 'Neutral'

    const allKeywords = articles
      .flatMap(article => article.keywords || [])
      .filter(keyword => keyword.length > 0)

    const keywordCounts = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1
      return acc
    }, {})

    const trendingKeywords = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keyword]) => keyword)

    return {
      totalArticles: articles.length,
      dominantSentiment,
      trendingKeywords
    }
  }, [articles])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.div>

        {/* Today's News Insights */}
        {insights && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Today's News Insights</h2>
              <p className="text-slate-400">AI-powered analysis of current news landscape</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-indigo-400 mb-2">{insights.totalArticles}</div>
                <div className="text-slate-300">Articles Loaded</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-2xl border backdrop-blur-sm ${
                  insights.dominantSentiment === 'Positive'
                    ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20'
                    : insights.dominantSentiment === 'Negative'
                    ? 'bg-gradient-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20'
                    : 'bg-gradient-to-br from-slate-500/10 to-slate-600/10 border-slate-500/20'
                }`}
              >
                <div className="text-3xl font-bold text-white mb-2">{insights.dominantSentiment}</div>
                <div className="text-slate-300">Dominant Sentiment</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="text-lg font-semibold text-white mb-2">Trending Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {insights.trendingKeywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          id="news"
          className="mt-16"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-indigo-300">
                Daily briefings
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Today's top stories
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Fetching live headlines from the backend and summarizing the article content on demand.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={fetchNews}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
            >
              {loading ? 'Refreshing...' : 'Refresh news'}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-6 py-5 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-lg">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-rose-300">Connection Issue</h3>
                  <p className="text-sm text-rose-200/70">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchNews}
                className="shrink-0 rounded-full bg-rose-500/10 px-5 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          <motion.div
            layout
            className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-[2rem] border border-slate-800/50 bg-slate-900/50 p-8 shadow-soft backdrop-blur-sm"
                >
                  <div className="h-52 bg-slate-800/50 rounded-[1.75rem] mb-6 animate-pulse"></div>
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800/50 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate-800/50 rounded-full w-1/2"></div>
                    <div className="h-4 bg-slate-800/50 rounded-full w-full"></div>
                  </div>
                </motion.div>
              ))
            ) : currentArticles.length > 0 ? (
              currentArticles.map((article, index) => (
                <motion.div
                  key={article.url || article.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))
            ) : (
              !error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-8 text-center text-slate-400 shadow-soft"
                >
                  No live news found. Try refreshing the page.
                </motion.div>
              )
            )}
          </motion.div>

          {totalPages > 1 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center rounded-full bg-slate-800/50 p-3 text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    currentPage === idx + 1
                      ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center rounded-full bg-slate-800/50 p-3 text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.section>

        {/* About Developer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          id="about"
          className="mt-16 rounded-[2rem] border border-slate-800/90 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 shadow-soft backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-2">About the Developer</h3>
            <p className="text-slate-400">Meet the creator behind this AI-powered platform</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 p-6 rounded-2xl border border-indigo-500/20 text-center"
            >
              <div className="text-2xl font-bold text-indigo-400 mb-2">Manas</div>
              <div className="text-slate-300">Developer</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-6 rounded-2xl border border-emerald-500/20 text-center"
            >
              <div className="text-lg font-semibold text-emerald-400 mb-2">2112408027</div>
              <div className="text-slate-300">USN</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20 text-center"
            >
              <div className="text-sm font-semibold text-purple-400 mb-2">S-VYASA Deemed to be University</div>
              <div className="text-slate-300">Institution</div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white font-semibold mb-2">Manas</div>
            <div className="text-slate-400 text-sm mb-1">USN: 2112408027</div>
            <div className="text-slate-400 text-sm">S-VYASA Deemed to be University</div>
            <div className="mt-4 text-slate-500 text-xs">
              AI-Powered News Intelligence Platform © 2026
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home
