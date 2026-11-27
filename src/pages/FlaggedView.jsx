import { useState } from 'react'
import { TaskList, ViewHeader } from './TaskComponents'
import './FlaggedView.css'

export default function FlaggedView({
  tasks = [],
  openTask,
  blankTask,
  toggleComplete,
  toggleFlag,
  deleteTask
}) {
  const [segment, setSegment] = useState('all')

  // Active high-focus tasks (matching Member 2's filtering logic)
  const activeFocusTasks = tasks.filter(
    (task) =>
      !task.completed &&
      (task.flagged || task.priority === 'high' || task.priority === 'medium')
  )

  const counts = {
    all: activeFocusTasks.length,
    flagged: tasks.filter((task) => !task.completed && task.flagged).length,
    high: tasks.filter((task) => !task.completed && task.priority === 'high').length,
    medium: tasks.filter((task) => !task.completed && task.priority === 'medium').length
  }

  let filtered = activeFocusTasks
  if (segment === 'flagged') {
    filtered = tasks.filter((task) => !task.completed && task.flagged)
  } else if (segment === 'high') {
    filtered = tasks.filter((task) => !task.completed && task.priority === 'high')
  } else if (segment === 'medium') {
    filtered = tasks.filter((task) => !task.completed && task.priority === 'medium')
  }

  const segmentTabs = [
    { value: 'all', label: 'All Focus', count: counts.all },
    { value: 'flagged', label: 'Flagged', count: counts.flagged },
    { value: 'high', label: 'High !!!', count: counts.high },
    { value: 'medium', label: 'Medium !!', count: counts.medium }
  ]

  const handleCreateFlagged = () => {
    const newBlank = blankTask ? blankTask() : {}
    openTask({
      ...newBlank,
      flagged: segment === 'flagged' || segment === 'all',
      priority:
        segment === 'high'
          ? 'high'
          : segment === 'medium'
          ? 'medium'
          : newBlank.priority || 'none'
    })
  }

  return (
    <section className="view flagged-view" aria-labelledby="flagged-heading">
      {/* Header + Segmented Control Toolbar */}
      <div className="flagged-header-bar">
        <ViewHeader
          id="flagged-heading"
          title="Flagged & Priority"
          subtitle="High-focus reminders marked for immediate attention"
          onAdd={handleCreateFlagged}
        />

        <div className="segments-wrapper">
          <div className="segments" role="tablist" aria-label="Priority filter">
            {segmentTabs.map((tab) => {
              const isSelected = segment === tab.value
              return (
                <button
                  type="button"
                  role="tab"
                  key={tab.value}
                  aria-selected={isSelected}
                  className={`segment-tab ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSegment(tab.value)}
                >
                  <span className="segment-label">{tab.label}</span>
                  <span className="segment-badge">{tab.count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Task List Card or Polished Empty State */}
      <div className="flagged-content-card">
        {filtered.length > 0 ? (
          <TaskList
            tasks={filtered}
            openTask={openTask}
            toggleComplete={toggleComplete}
            toggleFlag={toggleFlag}
            deleteTask={deleteTask}
          />
        ) : (
          <div className="flagged-empty-state" role="status">
            <div className="empty-flag-circle" aria-hidden="true">
              ⚑
            </div>
            <h3 className="empty-title">No Matching Focus Reminders</h3>
            <p className="empty-description">
              Tap the flag icon on any reminder or set its priority to High or Medium to pin it here.
            </p>
            <button
              type="button"
              className="empty-cta-btn"
              onClick={handleCreateFlagged}
            >
              + Add Focus Reminder
            </button>
          </div>
        )}
      </div>
    </section>
  )
}