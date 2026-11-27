import { Link } from 'react-router-dom'
import { useTaskContext } from '../context/TaskContext'
import { isToday, isOverdue, getRelativeDate } from '../utilities/dateHelpers'
import './Overview.css'

export default function Overview({ searchTerm = '' }) {
  const { tasks = [], lists = [], listStyles = {}, toggleComplete, toggleFlag } = useTaskContext()

  const query = searchTerm.trim().toLowerCase()
  const visibleTasks = query
    ? tasks.filter((task) =>
        `${task.title} ${task.notes || ''}`.toLowerCase().includes(query)
      )
    : tasks

  const todayCount = visibleTasks.filter(
    (task) => !task.completed && isToday(task.dueDate)
  ).length
  const overdueCount = visibleTasks.filter(
    (task) => !task.completed && isOverdue(task.dueDate, task.completed)
  ).length
  const scheduleCount = visibleTasks.filter(
    (task) => !task.completed && Boolean(task.dueDate)
  ).length
  const flaggedCount = visibleTasks.filter(
    (task) => !task.completed && task.flagged
  ).length
  const allActiveCount = visibleTasks.filter((task) => !task.completed).length

  const focusTasks = visibleTasks.filter(
    (task) =>
      !task.completed &&
      (isToday(task.dueDate) || isOverdue(task.dueDate, task.completed))
  )

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const smartCards = [
    {
      id: 'today',
      label: 'Today',
      count: todayCount,
      to: '/today',
      color: '#76EAE6',
      icon: '📅',
      lightBadge: true
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      count: scheduleCount,
      to: '/scheduled',
      color: '#8A4EC4',
      icon: '🗓️',
      lightBadge: false
    },
    {
      id: 'flagged',
      label: 'Flagged',
      count: flaggedCount,
      to: '/flagged',
      color: '#D499F5',
      icon: '⚑',
      lightBadge: true
    },
    {
      id: 'all',
      label: 'All Active',
      count: allActiveCount,
      to: '/scheduled',
      color: '#5B2E91',
      icon: '📥',
      lightBadge: false
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: overdueCount,
      to: '/today',
      color: '#26124B',
      icon: '⚠️',
      lightBadge: false,
      highlightBorder: overdueCount > 0
    }
  ]

  return (
    <section className="view overview-view" aria-labelledby="overview-heading">
      {/* Apple-Style Date Eyebrow & Heading */}
      <header className="overview-header">
        <div>
          <p className="eyebrow">{formattedDate}</p>
          <h1 id="overview-heading" className="overview-heading">
            Overview
          </h1>
          <p className="overview-subtitle">
            {query
              ? `Showing matches for "${searchTerm.trim()}"`
              : 'Your smart lists, custom folders, and daily focus'}
          </p>
        </div>
      </header>

      {/* Smart Lists Summary Grid */}
      <div className="overview-smart-grid" role="region" aria-label="Smart Lists Summary">
        {smartCards.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className={`overview-smart-card ${card.highlightBorder ? 'has-alert' : ''}`}
          >
            <div className="smart-card-top">
              <span
                className={`smart-card-badge ${card.lightBadge ? 'light-badge' : ''}`}
                style={{ backgroundColor: card.color }}
                aria-hidden="true"
              >
                {card.icon}
              </span>
              <span className="smart-card-count">{card.count}</span>
            </div>
            <div className="smart-card-bottom">
              <span className="smart-card-label">{card.label}</span>
              <span className="smart-card-chevron" aria-hidden="true">
                ›
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* My Lists Grouped Card */}
      <section className="overview-section" aria-labelledby="my-lists-heading">
        <div className="section-title-row">
          <h2 id="my-lists-heading" className="overview-section-title">
            My Lists
          </h2>
          <span className="section-meta-pill">{lists.length} lists</span>
        </div>

        <div className="overview-card-panel">
          {lists.map((listName) => {
            const count = visibleTasks.filter(
              (task) => task.list === listName && !task.completed
            ).length
            const styleMeta = listStyles[listName] || { color: '#5B2E91', icon: '📋' }

            return (
              <Link
                key={listName}
                to={`/list/${encodeURIComponent(listName)}`}
                className="overview-list-row"
              >
                <div className="list-row-left">
                  <span
                    className="overview-list-badge"
                    style={{ backgroundColor: styleMeta.color || '#5B2E91' }}
                    aria-hidden="true"
                  >
                    {styleMeta.icon || '📋'}
                  </span>
                  <span className="overview-list-name">{listName}</span>
                </div>

                <div className="list-row-right">
                  <span className="overview-list-count">{count}</span>
                  <span className="list-row-chevron" aria-hidden="true">
                    ›
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Today & Overdue Focus Card */}
      <section className="overview-section" aria-labelledby="focus-heading">
        <div className="section-title-row">
          <h2 id="focus-heading" className="overview-section-title">
            Today &amp; Overdue Focus
          </h2>
          <Link to="/today" className="see-all-link">
            Open Today →
          </Link>
        </div>

        <div className="overview-card-panel">
          {focusTasks.length === 0 ? (
            <div className="overview-empty-focus" role="status">
              <div className="empty-check-circle" aria-hidden="true">
                ✓
              </div>
              <p className="empty-focus-title">All caught up for today!</p>
              <p className="empty-focus-sub">
                You have no overdue or due-today reminders remaining.
              </p>
            </div>
          ) : (
            <ul className="overview-focus-list">
              {focusTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.completed)
                const listMeta = listStyles[task.list] || { color: '#8A4EC4' }

                return (
                  <li key={task.id} className="overview-task-row">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={`Mark "${task.title}" complete`}
                      className={`apple-circle-check ${task.completed ? 'checked' : ''}`}
                      style={{ '--check-accent': listMeta.color || '#76EAE6' }}
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.completed ? '✓' : ''}
                    </button>

                    <div className="overview-task-body">
                      <div className="overview-task-title-line">
                        {task.priority === 'high' && (
                          <span className="priority-pill">!!!</span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="priority-pill">!!</span>
                        )}
                        <span className="overview-task-title">{task.title}</span>
                      </div>

                      {task.notes && (
                        <p className="overview-task-notes">{task.notes}</p>
                      )}

                      <div className="overview-task-meta">
                        <span className={`due-chip ${overdue ? 'overdue' : ''}`}>
                          📅 {getRelativeDate(task.dueDate)}
                        </span>
                        {task.list && (
                          <span className="category-chip">
                            <span
                              className="category-dot"
                              style={{ backgroundColor: listMeta.color || '#8A4EC4' }}
                            />
                            {task.list}
                          </span>
                        )}
                      </div>
                    </div>

                    {typeof toggleFlag === 'function' && (
                      <button
                        type="button"
                        aria-label={task.flagged ? 'Unflag reminder' : 'Flag reminder'}
                        className={`overview-flag-btn ${task.flagged ? 'flagged' : ''}`}
                        onClick={() => toggleFlag(task.id)}
                      >
                        {task.flagged ? '⚑' : '⚐'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </section>
  )
}