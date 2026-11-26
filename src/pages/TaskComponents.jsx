import { getRelativeDate } from '../utilities/dateHelpers'

const priorityLabels = { high: '!!!', medium: '!!', low: '!' }

export function ViewHeader({ title, subtitle, onAdd }) {
  return <header className="view-header"><div><p className="eyebrow">Reminders</p><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{onAdd && <button type="button" className="add-button" onClick={onAdd}>＋ New Reminder</button>}</header>
}

export function TaskList({ tasks, openTask, toggleComplete, toggleFlag, deleteTask }) {
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
