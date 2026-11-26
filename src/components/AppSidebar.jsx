import { NavLink } from 'react-router-dom'

export default function AppSidebar({ tasks, lists, listStyles, search, onSearchChange, onCreateList }) {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">✓</span><span>Reminders</span></div>
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search" aria-label="Search task titles and notes" />
      </label>

      <nav className="main-nav" aria-label="Primary views">
        <NavLink to="/" end className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon aqua">⌂</span><span>Overview</span></NavLink>
        <NavLink to="/today" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon violet">◷</span><span>Today</span></NavLink>
        <NavLink to="/scheduled" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon plum">▣</span><span>Scheduled</span></NavLink>
        <NavLink to="/flagged" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon rose">⚑</span><span>Flagged & Priority</span></NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}><span className="nav-icon lilac">⚙</span><span>Settings</span></NavLink>
      </nav>

      <div className="sidebar-heading"><span>My Lists</span><button type="button" onClick={onCreateList} aria-label="Create new list">＋</button></div>
      <nav className="list-nav" aria-label="Custom lists">
        {lists.map((listName) => (
          <NavLink key={listName} to={`/list/${encodeURIComponent(listName)}`} className={({ isActive }) => `nav-row ${isActive ? 'active' : ''}`}>
            <span className="list-dot" style={{ backgroundColor: listStyles[listName]?.color || '#5B2E91' }}>{listStyles[listName]?.icon || '●'}</span><span>{listName}</span>
            <b>{tasks.filter((task) => task.list === listName && !task.completed).length}</b>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
