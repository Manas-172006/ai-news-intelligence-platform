import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import SummaryBox from './SummaryBox'
import { stripHtml } from '../utils/sanitize.js'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

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
      const response = await axios.post(`${apiBaseUrl}/summarize`, {
        text,
      })

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
      const message =
        apiError.response?.data?.error ||
        apiError.response?.data?.detail ||
        apiError.message ||
        'Unable to generate summary. Please try again.'
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
      className="group flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/90 shadow-soft hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] hover:border-cyan-500/30 transition-all duration-300 relative z-0"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="overflow-hidden rounded-[1.75rem] bg-slate-900"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={imageUrl}
          alt={article.title}
          className="h-52 w-full object-cover"
        />
      </motion.div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
            {article.category || article.source?.name || 'News'}
          </p>
          <h2 className="mt-3 text-xl font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {stripHtml(article.title || '')}
          </h2>
        </div>
        <div className="flex-grow space-y-4">
          <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">
            {subtitle}
          </p>
          {safeContent && safeContent !== subtitle && (
            <p className="text-sm leading-relaxed text-slate-400 opacity-80 line-clamp-2">
              {safeContent}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-auto pt-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-800/50">
          <motion.button
            type="button"
            onClick={handleSummarize}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:from-indigo-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)]"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Source
          </motion.a>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200 mt-2 flex items-start gap-3 backdrop-blur-sm"
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
