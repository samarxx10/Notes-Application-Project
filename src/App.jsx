import { useEffect, useMemo, useState } from 'react'
import ReactQuill from 'react-quill-new'
import { Moon, Sun } from 'lucide-react'
import 'react-quill-new/dist/quill.snow.css'

const TAG_OPTIONS = ['Work', 'Personal', 'Study', 'Urgent']

const TAG_COLORS = {
  Work:     'bg-blue-500',
  Personal: 'bg-green-500',
  Study:    'bg-purple-500',
  Urgent:   'bg-red-500',
}

const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
}

const QUILL_FORMATS = ['bold', 'italic', 'underline', 'list']

const THEME_STORAGE_KEY = 'notes_theme'

const getInitialTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    return prefersDark ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [tag, setTag] = useState('Personal')
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const submitHandler = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const id = crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`
    setNotes(prev => [...prev, { id, title, details, tag }])
    setTitle('')
    setDetails('')
    setTag('Personal')
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    const q = search.toLowerCase()
    return notes.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.details.replace(/<[^>]+>/g, '').toLowerCase().includes(q)
    )
  }, [notes, search])

  const isDark = theme === 'dark'

  const fieldClass =
    'px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-gray-900 dark:focus:border-gray-300 transition text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="w-full flex items-center justify-between p-6 lg:px-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">React Notes</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enterprise portfolio notebook
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </header>

      <div className="lg:flex">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5 lg:w-[45%] p-10 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold tracking-tight">Add Note</h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Title
            </label>
            <input
              type="text"
              placeholder="Note heading…"
              className={fieldClass}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Category
            </label>
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className={`${fieldClass} cursor-pointer appearance-none`}
            >
              {TAG_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Details
            </label>
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-gray-900 dark:focus-within:border-gray-300 transition-colors duration-200">
              <ReactQuill
                theme="snow"
                value={details}
                onChange={setDetails}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write your note… (bold, italic, lists supported)"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-semibold py-2.5 rounded-lg active:scale-95 transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Add Note
          </button>
        </form>

        <div className="flex-1 p-10 flex flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-tight">Your Notes</h2>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or content…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 ${fieldClass}`}
            />
          </div>

          {filteredNotes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              {search ? 'No notes match your search.' : 'No notes yet. Add one!'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto pb-4">
              {filteredNotes.map(elem => (
                <div
                  key={elem.id}
                  className="relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 min-h-44 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <span
                    className={`self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white mb-2 ${TAG_COLORS[elem.tag] ?? 'bg-gray-500'}`}
                  >
                    {elem.tag}
                  </span>

                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-sm leading-snug mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
                      {elem.title}
                    </h3>
                    <div
                      className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4 quill-content"
                      dangerouslySetInnerHTML={{ __html: elem.details }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteNote(elem.id)}
                    className="mt-3 w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 active:scale-95 transition py-1.5 text-xs rounded-xl font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
