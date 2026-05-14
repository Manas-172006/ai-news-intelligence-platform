import React from 'react'

const SummaryBox = ({ summaryText, sentiment, score, keywords = [], isLoading }) => {
  const sentimentLabel = sentiment || ''
  const sentimentClass =
    sentimentLabel === 'Positive'
      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
      : sentimentLabel === 'Negative'
      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
      : 'bg-slate-500/10 text-slate-300 border border-slate-500/20'

  return (
    <div className="mt-5 rounded-3xl border border-slate-800/90 bg-slate-950/90 p-5 text-left shadow-lg shadow-slate-950/40 transition duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Article summary</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Executive summary</h3>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-900 px-3 py-2 text-sm text-slate-300">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
              Generating summary...
            </div>
          ) : (
            sentimentLabel && (
              <span className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ${sentimentClass}`}>
                {sentimentLabel}
                {score !== null && score !== undefined ? ` (${score})` : ''}
              </span>
            )
          )}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        {summaryText}
      </p>

      {keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default SummaryBox
