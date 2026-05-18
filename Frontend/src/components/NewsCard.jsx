import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import SummaryBox from './SummaryBox'
import { stripHtml } from '../utils/sanitize.js'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
const isApiUrlDefined = Boolean(apiBaseUrl)

console.log('API URL:', apiBaseUrl, 'mode:', import.meta.env.MODE)
if (!apiBaseUrl) {
  console.error('VITE_API_BASE_URL environment variable is not set!')
}

const NewsCard = ({ article }) => {
  const [showSummary, setShowSummary] = useState(false)
  const [summaryText, setSummaryText] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [sentimentScore, setSentimentScore] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    if (loading) return

    const text = (article.content || article.description || article.title || '').trim()
    if (!text) {
      setError('No article content is available for summarization.')
      return
    }

    setError('')
    setSentiment('')
    setSentimentScore(null)
    setLoading(true)
    setShowSummary(false)

    try {
      if (!isApiUrlDefined) {
        const envMessage = 'VITE_API_BASE_URL is missing in production configuration. Please set this variable in Vercel.'
        console.error(envMessage)
        setError(envMessage)
        setLoading(false)
        return
      }

      const summarizeUrl = `${apiBaseUrl}/summarize`
      console.log('Sending summarize request to:', summarizeUrl)
      const response = await axios.post(summarizeUrl, {
        text,
      }, { timeout: 30000 }) // 30 second timeout

      const summary = response?.data?.summary ?? ''
      const sentimentLabel = response?.data?.sentiment ?? ''
      const sentimentValue = Number.isFinite(response?.data?.score)
        ? response.data.score
        : null
      const responseKeywords = Array.isArray(response?.data?.keywords)
        ? response.data.keywords
        : []

      if (!summary.trim()) {
        setError('The backend returned an empty summary. Please try again.')
        setSummaryText('')
        setSentiment('')
        setSentimentScore(null)
        setKeywords([])
        setShowSummary(false)
      } else {
        setSummaryText(summary)
        setSentiment(sentimentLabel)
        setSentimentScore(sentimentValue)
        setKeywords(responseKeywords)
        setShowSummary(true)
      }
    } catch (apiError) {
      console.error('Summarize API error:', apiError)
      console.error('Error response:', apiError.response)
      const message =
        apiError.response?.data?.error ||
        apiError.response?.data?.detail ||
        apiError.message ||
        'Unable to generate summary. The backend may be starting up. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const imageUrl = article.urlToImage || article.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  const rawSubtitle = article.description || article.content || 'No article description available.'
  const subtitle = stripHtml(rawSubtitle)
  const safeContent = stripHtml(article.content || '')

  return (
    <motion.article
      className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/95 shadow-[0_30px_80px_-40px_rgba(6,182,212,0.18)] transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_35px_100px_-35px_rgba(6,182,212,0.24)]"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-6 z-0 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 via-transparent to-indigo-500/20 blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] bg-slate-900"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={imageUrl}
          alt={article.title}
          className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 to-transparent" />
      </motion.div>

      <div className="space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300 shadow-[0_10px_35px_-25px_rgba(6,182,212,0.35)]">
            {article.category || article.source?.name || 'News'}
          </span>
          {article.publishedAt && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-cyan-300">
            {stripHtml(article.title || '')}
          </h2>
          <p className="text-sm leading-7 text-slate-400 line-clamp-3">
            {subtitle}
          </p>
          {safeContent && safeContent !== subtitle && (
            <p className="text-sm leading-7 text-slate-400/80 line-clamp-2">
              {safeContent}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-4 pt-4 border-t border-slate-800/60 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <motion.button
            type="button"
            onClick={handleSummarize}
            className="inline-flex min-w-[10rem] items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-20px_rgba(6,182,212,0.35)] transition duration-300 hover:from-indigo-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? (
              <>
                <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing
              </>
            ) : (
              'AI Summary'
            )}
          </motion.button>
          <motion.a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition duration-300 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_18px_40px_-26px_rgba(6,182,212,0.18)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Read Source
          </motion.a>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200 mt-2 flex items-start gap-3 backdrop-blur-sm"
          >
            <span className="text-rose-400">⚠️</span>
            <p>{error}</p>
          </motion.div>
        )}

        {showSummary && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryBox
              summaryText={summaryText}
              sentiment={sentiment}
              score={sentimentScore}
              keywords={keywords}
              isLoading={false}
            />
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}

export default NewsCard
