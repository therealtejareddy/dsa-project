/**
 * CodeLangTabs — language switcher used across all pattern code sections.
 *
 * Props:
 *   activeLang   - currently selected language string
 *   onChange     - callback(lang: string)
 *   className    - optional extra class on the wrapper
 */
export default function CodeLangTabs({
  activeLang,
  onChange,
  className = '',
  containerClass = 'code-lang-tabs',
  btnClass = 'code-lang-btn',
}) {
  const LANGS = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python',     label: 'Python'     },
    { id: 'java',       label: 'Java'       },
  ]

  return (
    <div className={`${containerClass} ${className}`}>
      {LANGS.map(({ id, label }) => (
        <button
          key={id}
          className={`${btnClass} ${activeLang === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
