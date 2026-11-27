import { useState, useEffect } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { ViewHeader } from './TaskComponents'
import './Settings.css'

export default function Settings() {
  const {
    tasks = [],
    lists = [],
    clearCompletedTasks,
    resetDemoData
  } = useTaskContext()

  const [lightMode, setLightMode] = useState(() => {
    try {
      return localStorage.getItem('reminders_theme_mode') === 'light'
    } catch {
      return false
    }
  })

  const [displayName, setDisplayName] = useState(() => {
    try {
      return localStorage.getItem('reminders_user_name') || 'INF 651 Student'
    } catch {
      return 'INF 651 Student'
    }
  })

  const [confirmReset, setConfirmReset] = useState(false)
  const [statusBanner, setStatusBanner] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('reminders_theme_mode', lightMode ? 'light' : 'dark')
    } catch {
      // Ignore storage quota errors
    }
    document.body.classList.toggle('light-mode', lightMode)
  }, [lightMode])

  // Stay in sync when the top bar theme button is clicked
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

  const showStatus = (message) => {
    setStatusBanner(message)
    setTimeout(() => setStatusBanner(''), 2600)
  }

  const handleNameChange = (event) => {
    const nextName = event.target.value
    setDisplayName(nextName)
    try {
      localStorage.setItem('reminders_user_name', nextName)
    } catch {
      // Ignore storage errors
    }
  }

  const handleExportBackup = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        displayName,
        lists,
        tasks
      },
      null,
      2
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `reminders-backup-${new Date().toISOString().split('T')[0]}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    showStatus('JSON backup downloaded successfully.')
  }

  const handleClearCompleted = () => {
    if (typeof clearCompletedTasks === 'function') {
      clearCompletedTasks()
      showStatus('Completed reminders cleared.')
    } else {
      showStatus('Connect clearCompletedTasks in TaskContext to remove completed items.')
    }
  }

  const handleResetDemo = () => {
    if (typeof resetDemoData === 'function') {
      resetDemoData()
      showStatus('Demo data restored to default state.')
    } else {
      localStorage.clear()
      showStatus('Browser localStorage cleared. Refresh to load starter tasks.')
    }
    setConfirmReset(false)
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const activeCount = tasks.length - completedCount

  return (
    <section className="view settings-view" aria-labelledby="settings-heading">
      <ViewHeader
        id="settings-heading"
        title="Settings & Data"
        subtitle="Theme customization, browser persistence, and backup tools"
      />

      {statusBanner && (
        <div className="settings-toast" role="status">
          ✓ {statusBanner}
        </div>
      )}

      {/* 1. Appearance & Profile Settings */}
      <div className="settings-group">
        <h3 className="settings-group-label">Appearance &amp; Profile</h3>
        <div className="settings-card settings-rows">
          <div className="settings-row">
            <div>
              <p className="row-title">Student Display Name</p>
              <p className="row-subtitle">Saved locally in browser storage</p>
            </div>
            <input
              type="text"
              value={displayName}
              onChange={handleNameChange}
              aria-label="Student display name"
              className="settings-text-input"
            />
          </div>

          <div className="settings-row">
            <div>
              <p className="row-title">Light / Dark Appearance</p>
              <p className="row-subtitle">
                Switch between Midnight Plum (#26124B) &amp; Soft Lavender Light
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!lightMode}
              onClick={handleToggleTheme}
              className={`apple-switch ${!lightMode ? 'on' : ''}`}
            >
              <span className="switch-thumb" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Browser Persistence & Data Management */}
      <div className="settings-group">
        <h3 className="settings-group-label">Browser Persistence (localStorage)</h3>
        <div className="settings-card settings-rows">
          <div className="settings-row">
            <div>
              <p className="row-title">Export JSON Backup</p>
              <p className="row-subtitle">
                {activeCount} active &amp; {completedCount} completed reminders across {lists.length} lists
              </p>
            </div>
            <button
              type="button"
              className="settings-btn btn-aqua"
              onClick={handleExportBackup}
            >
              Download JSON
            </button>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-title">Clear Completed Reminders</p>
              <p className="row-subtitle">
                Remove {completedCount} checked {completedCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              type="button"
              className="settings-btn btn-violet"
              disabled={completedCount === 0}
              onClick={handleClearCompleted}
            >
              Clear Completed
            </button>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-title">Reset Demo Data</p>
              <p className="row-subtitle">
                Restore starter INF 651 tasks and custom lists
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                className="settings-btn btn-outline-lilac"
                onClick={() => setConfirmReset(true)}
              >
                Reset Data
              </button>
            ) : (
              <div className="inline-confirm-group">
                <button
                  type="button"
                  className="settings-btn btn-outline-lilac"
                  onClick={() => setConfirmReset(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="settings-btn btn-aqua"
                  onClick={handleResetDemo}
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}