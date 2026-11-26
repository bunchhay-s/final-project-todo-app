import { useState } from 'react'

export default function TaskModal({ task, lists, onClose, onSave }) {
  const [form, setForm] = useState(task)
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <header><div><p className="eyebrow">Reminder</p><h2 id="task-modal-title">{task.id ? 'Edit Reminder' : 'Create Reminder'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></header>
      <form onSubmit={(event) => { event.preventDefault(); if (form.title.trim()) onSave({ ...form, title: form.title.trim() }) }}>
        <label>Title<input required autoFocus value={form.title} onChange={(event) => set('title', event.target.value)} placeholder="What needs to be done?" /></label>
        <label>Notes<textarea value={form.notes || ''} onChange={(event) => set('notes', event.target.value)} placeholder="Add notes" /></label>
        <div className="form-grid"><label>Due date<input type="date" value={form.dueDate || ''} onChange={(event) => set('dueDate', event.target.value)} /></label><label>Time (optional)<input type="time" value={form.dueTime || ''} onChange={(event) => set('dueTime', event.target.value)} /></label></div>
        <div className="form-grid"><label>Priority<select value={form.priority || 'medium'} onChange={(event) => set('priority', event.target.value)}><option value="high">High !!!</option><option value="medium">Medium !!</option><option value="low">Low !</option></select></label><label>List<select value={form.list || ''} onChange={(event) => set('list', event.target.value)}><option value="">No list</option>{lists.map((listName) => <option key={listName} value={listName}>{listName}</option>)}</select></label></div>
        <label className="check-label"><input type="checkbox" checked={Boolean(form.flagged)} onChange={(event) => set('flagged', event.target.checked)} /><span>Flag this reminder</span></label>
        <footer><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="save-button">{task.id ? 'Save Changes' : 'Create Reminder'}</button></footer>
      </form>
    </section>
  </div>
}
