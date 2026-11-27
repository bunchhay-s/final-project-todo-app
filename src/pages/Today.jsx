import { useTaskContext } from '../context/TaskContext'
import { isToday, isOverdue, getRelativeDate } from '../utilities/dateHelpers'
import './Today.css'

export default function Today({ searchTerm = '', openTask, listStyles = {} }) {
  const { tasks = [], toggleComplete, toggleFlag, deleteTask } = useTaskContext()

  const query = searchTerm.trim().toLowerCase()
  const visibleTasks = query
    ? tasks.filter((task) =>
        `${task.title} ${task.notes || ''}`.toLowerCase().includes(query)
      )
    : tasks

  const overDueTasks = visibleTasks.filter(
    (task) => !task.completed && isOverdue(task.dueDate, task.completed)
  )

  const dueTodayTasks = visibleTasks.filter((task) => isToday(task.dueDate))

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const remainingTodayCount = dueTodayTasks.filter((t) => !t.completed).length

  const renderTaskRow = (task, isTaskOverdue = false) => {
    const listMeta = listStyles[task.list] || { color: '#8A4EC4' }

    return (
      <li
        key={task.id}
        className={`today-task-row ${task.completed ? 'completed' : ''}`}
      >
        {/* Apple Circular Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={`Mark "${task.title}" ${
            task.completed ? 'incomplete' : 'complete'
          }`}
          className={`today-circle-check ${task.completed ? 'checked' : ''}`}
          style={{ '--check-accent': listMeta.color || '#76EAE6' }}
          onClick={() => toggleComplete(task.id)}
        >
          {task.completed ? '✓' : ''}
        </button>

        {/* Task Details */}
        <div
          className="today-task-body"
          onClick={() => typeof openTask === 'function' && openTask(task)}
        >
          <div className="today-title-line">
            {!task.completed && task.priority === 'high' && (
              <span className="today-priority-pill">!!!</span>
            )}
            {!task.completed && task.priority === 'medium' && (
              <span className="today-priority-pill">!!</span>
            )}
            <span className="today-task-title">{task.title}</span>
          </div>

          {task.notes && <p className="today-task-notes">{task.notes}</p>}

          <div className="today-task-meta">
            {task.dueDate && (
              <span className={`today-due-chip ${isTaskOverdue ? 'overdue' : ''}`}>
                📅 {getRelativeDate(task.dueDate)}
                {task.dueTime ? ` · ${task.dueTime}` : ''}
              </span>
            )}

            {task.list && (
              <span className="today-list-chip">
                <span
                  className="today-list-dot"
                  style={{ backgroundColor: listMeta.color || '#8A4EC4' }}
                />
                {task.list}
              </span>
            )}
          </div>
        </div>

        {/* Row Action Buttons */}
        <div className="today-row-actions">
          <button
            type="button"
            aria-label={task.flagged ? 'Unflag reminder' : 'Flag reminder'}
            title={task.flagged ? 'Remove Flag' : 'Flag Reminder'}
            className={`today-flag-btn ${task.flagged ? 'flagged' : ''}`}
            onClick={() => toggleFlag(task.id)}
          >
            {task.flagged ? '⚑' : '⚐'}
          </button>

          {typeof openTask === 'function' && (
            <button
              type="button"
              aria-label={`Edit "${task.title}"`}
              title="Edit Reminder"
              className="today-edit-btn"
              onClick={() => openTask(task)}
            >
              ✎
            </button>
          )}

          {typeof deleteTask === 'function' && (
            <button
              type="button"
              aria-label={`Delete "${task.title}"`}
              title="Delete Reminder"
              className="today-edit-btn"
              onClick={() => deleteTask(task.id)}
            >
              ⌫
            </button>
          )}
        </div>
      </li>
    )
  }

  return (
    <section className="view today-view" aria-labelledby="today-heading">
      {/* Apple-Style Today Header */}
      <header className="today-header">
        <div>
          <p className="eyebrow">{formattedDate}</p>
          <h1 id="today-heading" className="today-heading">
            Today
          </h1>
          <p className="today-subtitle">
            {query
              ? `Showing matches for "${searchTerm.trim()}"`
              : `${remainingTodayCount} ${
                  remainingTodayCount === 1 ? 'reminder' : 'reminders'
                } remaining today`}
          </p>
        </div>
      </header>

      {/* Overdue Alert Section (Only shown when overdue tasks exist or when searching) */}
      {overDueTasks.length > 0 && (
        <div className="today-section-block overdue-block">
          <div className="today-section-header">
            <div className="section-label-group">
              <span className="overdue-pill-badge">⚠️ Overdue</span>
            </div>
            <span className="today-count-pill alert">{overDueTasks.length}</span>
          </div>

          <div className="today-card-panel overdue-card">
            <ul className="today-task-list">
              {overDueTasks.map((task) => renderTaskRow(task, true))}
            </ul>
          </div>
        </div>
      )}

      {/* Due Today Section */}
      <div className="today-section-block">
        <div className="today-section-header">
          <h2 className="today-section-title">Due Today</h2>
          <span className="today-count-pill">{dueTodayTasks.length}</span>
        </div>

        <div className="today-card-panel">
          {dueTodayTasks.length === 0 ? (
            <div className="today-empty-state" role="status">
              <div className="today-empty-circle" aria-hidden="true">
                ✨
              </div>
              <h3 className="today-empty-title">No Reminders Due Today</h3>
              <p className="today-empty-desc">
                Enjoy your clear schedule or click &ldquo;+ New Reminder&rdquo; in the top bar to add one.
              </p>
            </div>
          ) : (
            <ul className="today-task-list">
              {dueTodayTasks.map((task) => renderTaskRow(task, false))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}