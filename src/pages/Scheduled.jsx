import { useTaskContext } from '../context/TaskContext'
import {
  isOverdue,
  isToday,
  isTmr,
  isUpcoming,
  getRelativeDate
} from '../utilities/dateHelpers'
import './Scheduled.css'

export default function Scheduled({ searchTerm = '' }) {
  const { tasks = [], listStyles = {}, toggleComplete, toggleFlag } = useTaskContext()

  const query = searchTerm.trim().toLowerCase()
  const visibleTasks = query
    ? tasks.filter((task) =>
        `${task.title} ${task.notes || ''}`.toLowerCase().includes(query)
      )
    : tasks

  const sections = [
    {
      id: 'overdue',
      title: 'Overdue',
      icon: '⚠️',
      badgeTone: 'aqua',
      items: visibleTasks.filter(
        (task) => !task.completed && isOverdue(task.dueDate, task.completed)
      )
    },
    {
      id: 'today',
      title: 'Today',
      icon: '📅',
      badgeTone: 'lilac',
      items: visibleTasks.filter((task) => isToday(task.dueDate))
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow',
      icon: '🌅',
      badgeTone: 'amethyst',
      items: visibleTasks.filter((task) => isTmr(task.dueDate))
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      icon: '🗓️',
      badgeTone: 'violet',
      items: visibleTasks.filter((task) => isUpcoming(task.dueDate))
    },
    {
      id: 'unscheduled',
      title: 'No Due Date',
      icon: '📥',
      badgeTone: 'muted',
      items: visibleTasks.filter((task) => !task.dueDate)
    }
  ]

  const totalScheduled = visibleTasks.filter((t) => !t.completed && t.dueDate).length

  return (
    <section className="view scheduled-view" aria-labelledby="scheduled-heading">
      {/* Apple-Style Header */}
      <header className="scheduled-header">
        <div>
          <p className="eyebrow">Timeline</p>
          <h1 id="scheduled-heading" className="scheduled-heading">
            Scheduled
          </h1>
          <p className="scheduled-subtitle">
            {query
              ? `Showing matches for "${searchTerm.trim()}"`
              : `${totalScheduled} active ${totalScheduled === 1 ? 'reminder' : 'reminders'} on your schedule`}
          </p>
        </div>
      </header>

      {/* Chronological Timeline Sections */}
      <div className="scheduled-sections">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`scheduled-section-block tone-${section.badgeTone}`}
          >
            <div className="scheduled-section-header">
              <div className="section-label-group">
                <span className="section-emoji" aria-hidden="true">
                  {section.icon}
                </span>
                <h2 className="scheduled-section-title">{section.title}</h2>
              </div>
              <span className="scheduled-count-pill">{section.items.length}</span>
            </div>

            <div className="scheduled-card-panel">
              {section.items.length === 0 ? (
                <p className="scheduled-empty-row">No reminders in {section.title}</p>
              ) : (
                <ul className="scheduled-task-list">
                  {section.items.map((task) => {
                    const overdue =
                      !task.completed && isOverdue(task.dueDate, task.completed)
                    const listMeta = listStyles[task.list] || { color: '#8A4EC4' }

                    return (
                      <li key={task.id} className="scheduled-task-row">
                        {/* Circular Apple Checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={task.completed}
                          aria-label={`Mark "${task.title}" ${
                            task.completed ? 'incomplete' : 'complete'
                          }`}
                          className={`scheduled-circle-check ${
                            task.completed ? 'checked' : ''
                          }`}
                          style={{ '--check-accent': listMeta.color || '#76EAE6' }}
                          onClick={() => toggleComplete(task.id)}
                        >
                          {task.completed ? '✓' : ''}
                        </button>

                        {/* Reminder Body */}
                        <div className="scheduled-task-body">
                          <div className="scheduled-title-line">
                            {!task.completed && task.priority === 'high' && (
                              <span className="scheduled-priority-pill">!!!</span>
                            )}
                            {!task.completed && task.priority === 'medium' && (
                              <span className="scheduled-priority-pill">!!</span>
                            )}
                            <span
                              className={`scheduled-task-title ${
                                task.completed ? 'completed' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          {task.notes && (
                            <p className="scheduled-task-notes">{task.notes}</p>
                          )}

                          <div className="scheduled-task-meta">
                            {task.dueDate && (
                              <span
                                className={`scheduled-due-chip ${
                                  overdue ? 'overdue' : ''
                                }`}
                              >
                                📅 {getRelativeDate(task.dueDate)}
                              </span>
                            )}
                            {task.list && (
                              <span className="scheduled-list-chip">
                                <span
                                  className="scheduled-list-dot"
                                  style={{
                                    backgroundColor: listMeta.color || '#8A4EC4'
                                  }}
                                />
                                {task.list}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Flag Action Button */}
                        <button
                          type="button"
                          aria-label={
                            task.flagged ? 'Unflag reminder' : 'Flag reminder'
                          }
                          title={task.flagged ? 'Remove Flag' : 'Flag Reminder'}
                          className={`scheduled-flag-btn ${
                            task.flagged ? 'flagged' : ''
                          }`}
                          onClick={() => toggleFlag(task.id)}
                        >
                          {task.flagged ? '⚑' : '⚐'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}