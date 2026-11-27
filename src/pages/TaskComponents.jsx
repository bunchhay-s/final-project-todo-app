import { getRelativeDate } from '../utilities/dateHelpers'
import './TaskComponents.css'

const priorityLabels = { high: '!!!', medium: '!!', low: '!' }

export function ViewHeader({ id, title, subtitle, onAdd }) {
  return (
    <header className="view-header tc-view-header">
      <div className="tc-header-text">
        <p className="eyebrow">Reminders</p>
        <h1 id={id}>{title}</h1>
        {subtitle && <p className="tc-header-subtitle">{subtitle}</p>}
      </div>

      {onAdd && (
        <button type="button" className="add-button tc-add-btn" onClick={onAdd}>
          <span aria-hidden="true">＋</span> New Reminder
        </button>
      )}
    </header>
  )
}

export function TaskList({
  tasks = [],
  openTask,
  toggleComplete,
  toggleFlag,
  deleteTask
}) {
  if (!tasks.length) {
    return (
      <div className="empty-state tc-empty-state" role="status">
        <span className="tc-empty-circle" aria-hidden="true">
          ✓
        </span>
        <h2>No reminders here</h2>
        <p>Nothing matches this view or search.</p>
      </div>
    )
  }

  return (
    <div className="task-list tc-task-list" role="list">
      {tasks.map((task) => {
        const hasPriority =
          !task.completed && task.priority && priorityLabels[task.priority]

        return (
          <article
            role="listitem"
            className={`task-row tc-task-row ${task.completed ? 'completed' : ''}`}
            key={task.id}
          >
            {/* Apple Circular Checkbox */}
            <button
              type="button"
              role="checkbox"
              aria-checked={task.completed}
              className={`task-check tc-task-check ${task.completed ? 'checked' : ''}`}
              onClick={() => toggleComplete(task.id)}
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {task.completed ? '✓' : ''}
            </button>

            {/* Clickable Task Content */}
            <button
              type="button"
              className="task-main tc-task-main"
              onClick={() => openTask(task)}
            >
              <div className="tc-title-row">
                {hasPriority && (
                  <span className={`priority tc-priority ${task.priority}`}>
                    {priorityLabels[task.priority]}
                  </span>
                )}
                <strong className="tc-task-title">{task.title}</strong>
              </div>

              {task.notes && <span className="tc-task-notes">{task.notes}</span>}

              {(task.dueDate || task.dueTime || task.list) && (
                <small className="tc-task-meta">
                  {(task.dueDate || task.dueTime) && (
                    <span className="tc-meta-date">
                      📅 {task.dueDate ? getRelativeDate(task.dueDate) : ''}
                      {task.dueTime ? ` · ${task.dueTime}` : ''}
                    </span>
                  )}
                  {task.list && (
                    <em className="tc-meta-list">
                      <span className="tc-list-dot" aria-hidden="true" />
                      {task.list}
                    </em>
                  )}
                </small>
              )}
            </button>

            {/* Row Action Buttons */}
            <div className="tc-row-actions">
              <button
                type="button"
                className={`row-button tc-action-btn ${task.flagged ? 'flagged' : ''}`}
                onClick={() => toggleFlag(task.id)}
                aria-label={task.flagged ? 'Unflag reminder' : 'Flag reminder'}
                title={task.flagged ? 'Remove Flag' : 'Flag Reminder'}
              >
                {task.flagged ? '⚑' : '⚐'}
              </button>

              <button
                type="button"
                className="row-button tc-action-btn"
                onClick={() => openTask(task)}
                aria-label="Edit reminder"
                title="Edit Reminder"
              >
                ✎
              </button>

              <button
                type="button"
                className="row-button tc-action-btn delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete reminder"
                title="Delete Reminder"
              >
                ⌫
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}