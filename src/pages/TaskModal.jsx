import { useState, useEffect } from 'react'
import './TaskModal.css'

export default function TaskModal({ task = {}, lists = [], onClose, onSave }) {
  const [form, setForm] = useState(task)

  // Keep local form synchronized if the passed task prop updates
  useEffect(() => {
    setForm(task)
  }, [task])

  // Allow dismissing modal with the Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title?.trim()) return
    onSave({ ...form, title: form.title.trim() })
  }

  const priorityOptions = [
    { value: 'low', label: 'Low !' },
    { value: 'medium', label: 'Medium !!' },
    { value: 'high', label: 'High !!!' }
  ]

  return (
    <div
      className="modal-backdrop tm-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal tm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        {/* iOS Sheet Header */}
        <header className="tm-header">
          <div>
            <p className="eyebrow">Reminder</p>
            <h2 id="task-modal-title">
              {task.id ? 'Edit Reminder' : 'Create Reminder'}
            </h2>
          </div>
          <button
            type="button"
            className="close-button tm-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        <form className="tm-form" onSubmit={handleSubmit}>
          {/* Group 1: Title & Notes Card */}
          <div className="tm-card-group">
            <label className="tm-input-block">
              <span className="tm-field-label">Title</span>
              <input
                type="text"
                required
                autoFocus
                value={form.title || ''}
                onChange={(event) => set('title', event.target.value)}
                placeholder="What needs to be done?"
                className="tm-text-input"
              />
            </label>

            <label className="tm-input-block tm-divider-top">
              <span className="tm-field-label">Notes</span>
              <textarea
                rows={3}
                value={form.notes || ''}
                onChange={(event) => set('notes', event.target.value)}
                placeholder="Add notes, links, or details..."
                className="tm-textarea"
              />
            </label>
          </div>

          {/* Group 2: Due Date & Time Card */}
          <div className="tm-card-group">
            <div className="form-grid tm-two-col">
              <label className="tm-col-field">
                <span className="tm-field-label">📅 Due Date</span>
                <input
                  type="date"
                  value={form.dueDate || ''}
                  onChange={(event) => set('dueDate', event.target.value)}
                  className="tm-control-input"
                />
              </label>

              <label className="tm-col-field">
                <span className="tm-field-label">⏰ Time (Optional)</span>
                <input
                  type="time"
                  value={form.dueTime || ''}
                  onChange={(event) => set('dueTime', event.target.value)}
                  className="tm-control-input"
                />
              </label>
            </div>
          </div>

          {/* Group 3: Priority Pills, List Selector & Flag Switch */}
          <div className="tm-card-group">
            {/* Priority Segmented Pills */}
            <div className="tm-inline-row">
              <span className="tm-row-label">Priority</span>
              <div className="tm-priority-pills" role="group" aria-label="Priority level">
                {priorityOptions.map((opt) => {
                  const isSelected = (form.priority || 'medium') === opt.value
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      aria-pressed={isSelected}
                      className={`tm-pill-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => set('priority', opt.value)}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* List Dropdown */}
            <div className="tm-inline-row tm-divider-top">
              <label htmlFor="tm-list-select" className="tm-row-label">
                List
              </label>
              <select
                id="tm-list-select"
                value={form.list || ''}
                onChange={(event) => set('list', event.target.value)}
                className="tm-select-input"
              >
                <option value="">No list</option>
                {lists.map((listName) => (
                  <option key={listName} value={listName}>
                    {listName}
                  </option>
                ))}
              </select>
            </div>

            {/* Flag Toggle Row */}
            <div className="tm-inline-row tm-divider-top">
              <span className="tm-row-label">⚑ Flag this reminder</span>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(form.flagged)}
                aria-label="Flag this reminder"
                onClick={() => set('flagged', !form.flagged)}
                className={`tm-switch ${form.flagged ? 'on' : ''}`}
              >
                <span className="tm-switch-thumb" />
              </button>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <footer className="tm-footer">
            <button
              type="button"
              className="cancel-button tm-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button tm-save-btn"
              disabled={!form.title?.trim()}
            >
              {task.id ? 'Save Changes' : 'Create Reminder'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}