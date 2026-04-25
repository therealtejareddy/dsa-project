import { useState, useEffect, useRef } from 'react'
import { codeToHtml } from 'shiki'

const LANG_MAP = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
  js: 'javascript',
}

const THEME = 'one-dark-pro'

/**
 * ShikiCodeBlock
 *
 * Props:
 *  - code     : string  — the source code to highlight
 *  - language : string  — 'python' | 'java' | 'cpp' | 'javascript'
 *  - showCopy : boolean — show copy-to-clipboard button (default true)
 */
export default function ShikiCodeBlock({ code, language = 'javascript', showCopy = true }) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const lang = LANG_MAP[language] ?? 'javascript'

    codeToHtml(code, { lang, theme: THEME })
      .then((result) => {
        if (!cancelled) {
          setHtml(result)
          setLoading(false)
        }
      })
      .catch(() => {
        // Fallback: plain text block
        if (!cancelled) {
          setHtml('')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [code, language])

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative rounded-xl overflow-hidden mt-1" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      {showCopy && (
        <button
          className={`absolute z-2 px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
            copied
              ? 'text-emerald-300'
              : 'text-white/75 hover:text-white'
          }`}
          style={{
            top: 10, right: 10,
            border: copied ? '1px solid rgba(16,185,129,0.6)' : '1px solid rgba(255,255,255,0.2)',
            background: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleCopy}
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      )}

      {loading ? (
        <pre
          className="m-0 p-5 text-[13.5px] leading-[1.7] font-mono overflow-x-auto rounded-xl"
          style={{ background: '#282c34', color: '#abb2bf' }}
        ><code>{code}</code></pre>
      ) : html ? (
        <div
          className="[&_pre]:m-0! [&_pre]:p-5! [&_pre]:rounded-none! [&_pre]:overflow-x-auto [&_pre]:text-[13.5px]! [&_pre]:leading-[1.7]! [&_pre]:font-['Monaco','Menlo','Fira_Code',monospace]! [&_code]:text-inherit! [&_code]:bg-transparent! [&_code]:p-0! [&_code]:rounded-none!"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        /* Shiki failed — plain fallback */
        <pre
          className="m-0 p-5 text-[13.5px] leading-[1.7] font-mono overflow-x-auto rounded-xl"
          style={{ background: '#282c34', color: '#abb2bf' }}
        ><code>{code}</code></pre>
      )}
    </div>
  )
}
