import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTaskContext } from '../context/TaskContext'
import { isToday } from '../utilities/dateHelpers'
import './AppLayout.css'

export default function AppLayout({
  children,
  searchTerm = '',
  setSearchTerm,
  listStyles: propListStyles,
  onOpenNewTask,
  onOpenNewList
}) {
  const { tasks = [], lists = [], listStyles: contextListStyles = {} } = useTaskContext()
  const listStyles = propListStyles || contextListStyles
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightMode, setLightMode] = useState(() => {
    try {
      return localStorage.getItem('reminders_theme_mode') === 'light'
    } catch {
      return false
    }
  })

  // Persist theme preference and sync class on document body
  useEffect(() => {
    try {
      localStorage.setItem('reminders_theme_mode', lightMode ? 'light' : 'dark')
    } catch {
      // Ignore storage errors
    }
    document.body.classList.toggle('light-mode', lightMode)
  }, [lightMode])

  // Stay in sync when Settings toggles the theme
  useEffect(() => {
    const syncTheme = (event) => {
      const nextIsLight =
        typeof event?.detail?.lightMode === 'boolean'
          ? event.detail.lightMode
          : localStorage.getItem('reminders_theme_mode') === 'light'
      setLightMode(nextIsLight)
    }
    window.addEventListener('reminders-theme-change', syncTheme)
    window.addEventListener('storage', syncTheme)
    return () => {
      window.removeEventListener('reminders-theme-change', syncTheme)
      window.removeEventListener('storage', syncTheme)
    }
  }, [])

  const handleToggleTheme = () => {
    setLightMode((prev) => {
      const next = !prev
      window.dispatchEvent(
        new CustomEvent('reminders-theme-change', { detail: { lightMode: next } })
      )
      return next
    })
  }

  // Close mobile sidebar drawer automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Live smart-list counts for sidebar badges
  const activeTasks = tasks.filter((t) => !t.completed)
  const counts = {
    overview: activeTasks.length,
    today: activeTasks.filter((t) => isToday(t.dueDate)).length,
    scheduled: activeTasks.filter((t) => Boolean(t.dueDate)).length,
    flagged: activeTasks.filter((t) => t.flagged || t.priority === 'high').length
  }

  // Derive readable breadcrumb label from current route
  const getBreadcrumbLabel = () => {
    if (searchTerm?.trim()) return `Search: "${searchTerm.trim()}"`
    if (location.pathname === '/') return 'Overview'
    if (location.pathname === '/today') return 'Today'
    if (location.pathname === '/scheduled') return 'Scheduled'
    if (location.pathname === '/flagged') return 'Flagged & Priority'
    if (location.pathname === '/settings') return 'Settings & Data'
    if (location.pathname.startsWith('/list/')) {
      return decodeURIComponent(location.pathname.replace('/list/', ''))
    }
    return 'Reminders'
  }

  const smartNavItems = [
    {
      to: '/',
      end: true,
      label: 'Overview',
      count: counts.overview,
      color: '#5B2E91',
      icon: '📥',
      lightBadge: false
    },
    {
      to: '/today',
      end: false,
      label: 'Today',
      count: counts.today,
      color: '#76EAE6',
      icon: '📅',
      lightBadge: true
    },
    {
      to: '/scheduled',
      end: false,
      label: 'Scheduled',
      count: counts.scheduled,
      color: '#8A4EC4',
      icon: '🗓️',
      lightBadge: false
    },
    {
      to: '/flagged',
      end: false,
      label: 'Flagged & Priority',
      count: counts.flagged,
      color: '#D499F5',
      icon: '⚑',
      lightBadge: true
    }
  ]

  return (
    <div className={`app-shell ${lightMode ? 'light-mode' : 'dark-mode'}`}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Apple Reminders Frosted Glass Sidebar */}
      <aside
        className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Primary Navigation"
      >
        {/* Top Window Dots + Course Pill */}
        <div className="sidebar-brand-row">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-amethyst" />
            <span className="dot dot-lilac" />
            <span className="dot dot-aqua" />
            <span className="brand-title">REMINDERS</span>
          </div>
          <span className="course-badge">INF 651</span>
        </div>

        {/* Global Search Input */}
        {typeof setSearchTerm === 'function' && (
          <div className="sidebar-search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reminders..."
              aria-label="Search reminders"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Scrollable Navigation Groups */}
        <div className="sidebar-scroll-area">
          <div className="nav-group">
            <p className="nav-group-label">Smart Views</p>
            <nav className="nav-links" aria-label="Smart Views">
              {smartNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-link-left">
                    <span
                      className={`nav-circle-icon ${item.lightBadge ? 'light-icon' : ''}`}
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="nav-link-text">{item.label}</span>
                  </span>
                  <span className="nav-count-pill">{item.count}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Dynamic Custom Lists */}
          <div className="nav-group">
            <div className="nav-group-header">
              <p className="nav-group-label">My Lists</p>
              {typeof onOpenNewList === 'function' && (
                <button
                  type="button"
                  className="inline-add-list-btn"
                  onClick={onOpenNewList}
                >
                  + Add
                </button>
              )}
            </div>

            <nav className="nav-links" aria-label="Custom Lists">
              {lists.map((listName) => {
                const listCount = activeTasks.filter(
                  (task) => task.list === listName
                ).length
                const styleMeta = listStyles[listName] || {
                  color: '#5B2E91',
                  icon: '📋'
                }

                return (
                  <NavLink
                    key={listName}
                    to={`/list/${encodeURIComponent(listName)}`}
                    className={({ isActive }) =>
                      `sidebar-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="nav-link-left">
                      <span
                        className="nav-circle-icon"
                        style={{ backgroundColor: styleMeta.color || '#5B2E91' }}
                        aria-hidden="true"
                      >
                        {styleMeta.icon || '📋'}
                      </span>
                      <span className="nav-link-text">{listName}</span>
                    </span>
                    <span className="nav-count-pill">{listCount}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="sidebar-footer">
          {typeof onOpenNewList === 'function' ? (
            <button
              type="button"
              className="footer-action-btn"
              onClick={onOpenNewList}
            >
              📁 Add List
            </button>
          ) : (
            <span />
          )}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `footer-settings-link ${isActive ? 'active' : ''}`
            }
          >
            ⚙️ Settings
          </NavLink>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="app-main-column">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-drawer-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="crumb-root">
                Reminders
              </Link>
              <span className="crumb-sep" aria-hidden="true">›</span>
              <span className="crumb-current">{getBreadcrumbLabel()}</span>
            </nav>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-switch-btn"
              onClick={handleToggleTheme}
              aria-label="Toggle Light and Dark Mode"
              title="Switch between Midnight Plum Dark and Soft Lavender Light"
            >
              {lightMode ? '🌙 Dark' : '☀️ Light'}
            </button>

            {typeof onOpenNewTask === 'function' && (
              <button
                type="button"
                className="topbar-new-task-btn"
                onClick={onOpenNewTask}
              >
                + New Reminder
              </button>
            )}
          </div>
        </header>

        <main className="app-content-canvas">
          <div className="app-content-inner">{children}</div>
        </main>
      </div>
    </div>
  )
}