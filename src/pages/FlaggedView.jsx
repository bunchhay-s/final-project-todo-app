import { useState } from 'react'
import { TaskList, ViewHeader } from './TaskComponents'
import './FlaggedView.css'

export default function FlaggedView({ tasks, openTask, blankTask, toggleComplete, toggleFlag, deleteTask }) {
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
