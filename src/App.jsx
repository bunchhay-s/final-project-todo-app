import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useTaskContext } from './context/TaskContext'
import { getRelativeDate } from './utilities/dateHelpers'
import Overview from './pages/Overview'
import Today from './pages/Today'
import Scheduled from './pages/Scheduled'
import './App.css'

const priorityLabels = { high: '!!!', medium: '!!', low: '!' }

export default function App() {
  const { tasks, lists, setLists, setTasks, addTask, updateTask, toggleComplete, toggleFlag, deleteTask } = useTaskContext()
  const [search, setSearch] = useState('')
  const [taskModal, setTaskModal] = useState(null)
  const [listModal, setListModal] = useState(false)
  const [listStyles, setListStyles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('todo_list_styles')) || {} } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem('todo_list_styles', JSON.stringify(listStyles))
  }, [listStyles])

  const searchedTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return tasks
    return tasks.filter((task) => `${task.title} ${task.notes || ''}`.toLowerCase().includes(query))
  }, [search, tasks])

  const blankTask = (list = '') => ({ title: '', notes: '', dueDate: '', dueTime: '', priority: 'medium', flagged: false, list })

  const saveTask = (task) => {
    if (task.id) updateTask(task.id, task)
    else addTask(task)
  }

  const addList = (listName) => {
    setLists((current) => current.includes(listName) ? current : [...current, listName])
  }

  const removeList = (listName) => {
    if (!window.confirm(`Delete "${listName}"? Reminders in it will become unlisted.`)) return false
    setLists((current) => current.filter((name) => name !== listName))
    setTasks((current) => current.map((task) => task.list === listName ? { ...task, list: '' } : task))
    setListStyles((current) => { const next = { ...current }; delete next[listName]; return next })
    return true
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✓</span><span>Reminders</span></div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search task titles and notes" />
        </label>

        <nav className="main-nav" aria-label="Primary views">
          <NavLink to="/" end className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon aqua">⌂</span><span>Overview</span></NavLink>
          <NavLink to="/today" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon violet">◷</span><span>Today</span></NavLink>
          <NavLink to="/scheduled" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon plum">▣</span><span>Scheduled</span></NavLink>
          <NavLink to="/flagged" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon rose">⚑</span><span>Flagged & Priority</span></NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon lilac">⚙</span><span>Settings</span></NavLink>
        </nav>

        <div className="sidebar-heading"><span>My Lists</span><button type="button" onClick={() => setListModal(true)} aria-label="Create new list">＋</button></div>
        <nav className="list-nav" aria-label="Custom lists">
          {lists.map((listName) => (
            <NavLink key={listName} to={`/list/${encodeURIComponent(listName)}`} className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}>
              <span className="list-dot" style={{ backgroundColor: listStyles[listName]?.color || '#5B2E91' }}>{listStyles[listName]?.icon || '●'}</span><span>{listName}</span>
              <b>{tasks.filter((task) => task.list === listName && !task.completed).length}</b>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Overview searchTerm={search} />} />
          <Route path="/today" element={<Today searchTerm={search} />} />
          <Route path="/scheduled" element={<Scheduled searchTerm={search} />} />
          <Route path="/flagged" element={<FlaggedView tasks={searchedTasks} openTask={setTaskModal} blankTask={blankTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} />} />
          <Route path="/list/:listName" element={<ListView tasks={searchedTasks} lists={lists} listStyles={listStyles} openTask={setTaskModal} blankTask={blankTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} removeList={removeList} />} />
          <Route path="/settings" element={<section className="view"><ViewHeader title="Settings & Data" /><div className="empty-state"><h2>Member 3 view</h2><p>Settings is owned by Member 3.</p></div></section>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {taskModal !== null && (
        <TaskModal
          task={taskModal}
          lists={lists}
          onClose={() => setTaskModal(null)}
          onSave={(task) => { saveTask(task); setTaskModal(null) }}
        />
      )}
      {listModal && <ListModal onClose={() => setListModal(false)} onSave={(list) => { addList(list.name); setListStyles((current) => ({ ...current, [list.name]: { color: list.color, icon: list.icon } })); setListModal(false) }} />}
    </div>
  )
}

function ViewHeader({ title, subtitle, onAdd }) {
  return <header className="view-header"><div><p className="eyebrow">Reminders</p><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{onAdd && <button type="button" className="add-button" onClick={onAdd}>＋ New Reminder</button>}</header>
}

function FlaggedView({ tasks, openTask, blankTask, toggleComplete, toggleFlag, deleteTask }) {
  const [segment, setSegment] = useState('all')
  let filtered = tasks.filter((task) => !task.completed)
  if (segment === 'flagged') filtered = filtered.filter((task) => task.flagged)
  if (segment === 'high') filtered = filtered.filter((task) => task.priority === 'high')
  if (segment === 'medium') filtered = filtered.filter((task) => task.priority === 'medium')

  return <section className="view">
    <ViewHeader title="Flagged & Priority" subtitle="Filter what needs your attention" onAdd={() => openTask(blankTask())} />
    <div className="segments" role="tablist" aria-label="Priority filter">
      {[['all', 'All Focus'], ['flagged', 'Flagged'], ['high', 'High !!!'], ['medium', 'Medium !!']].map(([value, label]) => (
        <button type="button" role="tab" key={value} aria-selected={segment === value} className={segment === value ? 'selected' : ''} onClick={() => setSegment(value)}>{label}</button>
      ))}
    </div>
    <TaskList tasks={filtered} openTask={openTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} />
  </section>
}

function ListView({ tasks, lists, listStyles, openTask, blankTask, toggleComplete, toggleFlag, deleteTask, removeList }) {
  const { listName: encodedName } = useParams()
  const navigate = useNavigate()
  const listName = decodeURIComponent(encodedName)
  const listTasks = tasks.filter((task) => task.list === listName)
  const remaining = listTasks.filter((task) => !task.completed).length
  if (!lists.includes(listName)) return <Navigate to="/" replace />

  return <section className="view">
    <header className="view-header"><div><p className="eyebrow"><span className="list-dot inline" style={{ backgroundColor: listStyles[listName]?.color || '#5B2E91' }}>{listStyles[listName]?.icon || '●'}</span> My Lists</p><h1>{listName}</h1><p>{remaining} {remaining === 1 ? 'reminder' : 'reminders'} remaining</p></div><div className="header-actions"><button type="button" className="delete-list" onClick={() => { if (removeList(listName)) navigate('/') }}>Delete List</button><button type="button" className="add-button" onClick={() => openTask(blankTask(listName))}>＋ New Reminder</button></div></header>
    <TaskList tasks={listTasks} openTask={openTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} />
  </section>
}

function TaskList({ tasks, openTask, toggleComplete, toggleFlag, deleteTask }) {
  if (!tasks.length) return <div className="empty-state"><span>✓</span><h2>No reminders here</h2><p>Nothing matches this view or search.</p></div>
  return <div className="task-list">{tasks.map((task) => (
    <article className={`task-row ${task.completed ? 'completed' : ''}`} key={task.id}>
      <button type="button" className="task-check" onClick={() => toggleComplete(task.id)} aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}>{task.completed ? '✓' : ''}</button>
      <button type="button" className="task-main" onClick={() => openTask(task)}>
        <strong>{task.title}</strong>{task.notes && <span>{task.notes}</span>}
        <small>{getRelativeDate(task.dueDate)}{task.dueTime ? ` · ${task.dueTime}` : ''}{task.list && <em>{task.list}</em>}</small>
      </button>
      <span className={`priority ${task.priority}`}>{priorityLabels[task.priority]}</span>
      <button type="button" className={`row-button ${task.flagged ? 'flagged' : ''}`} onClick={() => toggleFlag(task.id)} aria-label="Toggle flag">⚑</button>
      <button type="button" className="row-button" onClick={() => openTask(task)} aria-label="Edit reminder">✎</button>
      <button type="button" className="row-button delete" onClick={() => deleteTask(task.id)} aria-label="Delete reminder">⌫</button>
    </article>
  ))}</div>
}

function TaskModal({ task, lists, onClose, onSave }) {
  const [form, setForm] = useState(task)
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <header><div><p className="eyebrow">Reminder</p><h2 id="task-modal-title">{task.id ? 'Edit Reminder' : 'Create Reminder'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></header>
      <form onSubmit={(event) => { event.preventDefault(); if (form.title.trim()) onSave({ ...form, title: form.title.trim() }) }}>
        <label>Title<input required autoFocus value={form.title} onChange={(event) => set('title', event.target.value)} placeholder="What needs to be done?" /></label>
        <label>Notes<textarea value={form.notes || ''} onChange={(event) => set('notes', event.target.value)} placeholder="Add notes" /></label>
        <div className="form-grid"><label>Due date<input type="date" value={form.dueDate || ''} onChange={(event) => set('dueDate', event.target.value)} /></label><label>Time (optional)<input type="time" value={form.dueTime || ''} onChange={(event) => set('dueTime', event.target.value)} /></label></div>
        <div className="form-grid"><label>Priority<select value={form.priority || 'medium'} onChange={(event) => set('priority', event.target.value)}><option value="high">High !!!</option><option value="medium">Medium !!</option><option value="low">Low !</option></select></label><label>List<select value={form.list || ''} onChange={(event) => set('list', event.target.value)}><option value="">No list</option>{lists.map((listName) => <option key={listName} value={listName}>{listName}</option>)}</select></label></div>
        <label className="check-label"><input type="checkbox" checked={Boolean(form.flagged)} onChange={(event) => set('flagged', event.target.checked)} /><span>Flag this reminder</span></label>
        <footer><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="save-button">{task.id ? 'Save Changes' : 'Create Reminder'}</button></footer>
      </form>
    </section>
  </div>
}

function ListModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#5B2E91')
  const [icon, setIcon] = useState('📋')
  const icons = ['📋', '💼', '🏠', '🛍️', '🎓', '💪', '🎨', '✈️']
  const colors = ['#26124B', '#5B2E91', '#8A4EC4', '#D499F5', '#76EAE6']

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal small-modal" role="dialog" aria-modal="true" aria-labelledby="list-modal-title">
      <header><div><p className="eyebrow">My Lists</p><h2 id="list-modal-title">New Custom List</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></header>
      <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSave({ name: name.trim(), color, icon }) }}>
        <label>List name<input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Travel" /></label>
        <fieldset><legend>Color</legend><div className="swatches">{colors.map((value) => <button type="button" key={value} aria-label={`Choose ${value}`} className={color === value ? 'selected' : ''} style={{ backgroundColor: value }} onClick={() => setColor(value)} />)}</div></fieldset>
        <fieldset><legend>Icon</legend><div className="icon-picker">{icons.map((value) => <button type="button" key={value} className={icon === value ? 'selected' : ''} onClick={() => setIcon(value)}>{value}</button>)}</div></fieldset>
        <footer><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="save-button">Create List</button></footer>
      </form>
    </section>
  </div>
}
