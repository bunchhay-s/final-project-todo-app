import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TaskList } from './TaskComponents'
import './ListView.css'

export default function ListView({
  tasks = [],
  lists = [],
  listStyles = {},
  openTask,
  blankTask,
  toggleComplete,
  toggleFlag,
  deleteTask,
  removeList
}) {
  const { listName: encodedName } = useParams()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const listName = decodeURIComponent(encodedName || '')

  // Reset inline delete confirmation whenever user switches to a different list
  useEffect(() => {
    setConfirmDelete(false)
  }, [listName])

  if (!lists.includes(listName)) {
    return <Navigate to="/" replace />
  }

  const listTasks = tasks.filter((task) => task.list === listName)
  const remaining = listTasks.filter((task) => !task.completed).length
  const completedCount = listTasks.length - remaining

  const styleMeta = listStyles[listName] || { color: '#5B2E91', icon: '📋' }
  const badgeColor = styleMeta.color || '#5B2E91'
  const badgeIcon = styleMeta.icon || '📋'

  // Ensure crisp contrast when badge background is bright Aqua Mint or Soft Lilac
  const isLightAccent = badgeColor === '#76EAE6' || badgeColor === '#D499F5'

  const handleConfirmDelete = () => {
    if (removeList(listName)) {
      navigate('/')
    }
  }

  return (
    <section className="view list-view" aria-labelledby="custom-list-heading">
      {/* Apple-Style Custom List Header */}
      <header className="view-header list-view-header">
        <div className="list-title-cluster">
          <div
            className="list-hero-badge"
            style={{ backgroundColor: badgeColor }}
            aria-hidden="true"
          >
            <span>{badgeIcon}</span>
          </div>

          <div>
            <p className="eyebrow">My Lists</p>
            <h1
              id="custom-list-heading"
              className="list-heading"
              style={{ '--list-accent': badgeColor }}
            >
              {listName}
            </h1>
            <p className="list-subtitle">
              {remaining} {remaining === 1 ? 'reminder' : 'reminders'} remaining
              {completedCount > 0 ? ` • ${completedCount} completed` : ''}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions list-header-actions">
          {lists.length > 1 && !confirmDelete && (
            <button
              type="button"
              className="delete-list-btn"
              onClick={() => setConfirmDelete(true)}
            >
              Delete List
            </button>
          )}

          <button
            type="button"
            className={`add-button list-add-btn ${isLightAccent ? 'light-accent' : ''}`}
            style={{ backgroundColor: badgeColor }}
            onClick={() => openTask(blankTask(listName))}
          >
            ＋ New Reminder
          </button>
        </div>
      </header>

      {/* Non-intrusive Inline Delete Confirmation Banner */}
      {confirmDelete && (
        <div className="delete-confirm-banner" role="alert">
          <p>
            Delete <strong>"{listName}"</strong> and move or clear its reminders?
          </p>
          <div className="confirm-actions">
            <button
              type="button"
              className="confirm-cancel-btn"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="confirm-yes-btn"
              onClick={handleConfirmDelete}
            >
              Yes, Delete List
            </button>
          </div>
        </div>
      )}

      {/* Task List Card or Guided Empty State */}
      <div className="list-content-card">
        {listTasks.length > 0 ? (
          <TaskList
            tasks={listTasks}
            openTask={openTask}
            toggleComplete={toggleComplete}
            toggleFlag={toggleFlag}
            deleteTask={deleteTask}
          />
        ) : (
          <div className="list-empty-state" role="status">
            <div
              className="empty-list-badge"
              style={{ backgroundColor: badgeColor }}
              aria-hidden="true"
            >
              {badgeIcon}
            </div>
            <h3 className="empty-list-title">No Reminders in {listName}</h3>
            <p className="empty-list-desc">
              Keep your {listName.toLowerCase()} tasks organized by adding your first reminder below.
            </p>
            <button
              type="button"
              className={`add-button list-add-btn ${isLightAccent ? 'light-accent' : ''}`}
              style={{ backgroundColor: badgeColor }}
              onClick={() => openTask(blankTask(listName))}
            >
              ＋ Add to {listName}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}