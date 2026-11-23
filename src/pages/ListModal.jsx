import { useState } from 'react'

export default function ListModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#5B2E91')
  const [icon, setIcon] = useState('📋')
  const icons = ['📋', '💼', '🏠', '🛍️', '🎓', '💪', '🎨', '✈️']
  const colors = ['#26124B', '#5B2E91', '#8A4EC4', '#D499F5', '#76EAE6']

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal small-modal" role="dialog" aria-modal="true" aria-labelledby="list-modal-title">
      <header><div><p className="eyebrow">My Lists</p><h2 id="list-modal-title">New Custom List</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></header>
      <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSave({ name: name.trim(), color, icon }) }}>
        <label>List name<input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Travel" /></label>
        <fieldset><legend>Color</legend><div className="swatches">{colors.map((value) => <button type="button" key={value} aria-label={`Choose ${value}`} className={color === value ? 'selected' : ''} style={{ backgroundColor: value }} onClick={() => setColor(value)} />)}</div></fieldset>
        <fieldset><legend>Icon</legend><div className="icon-picker">{icons.map((value) => <button type="button" key={value} className={icon === value ? 'selected' : ''} onClick={() => setIcon(value)}>{value}</button>)}</div></fieldset>
        <footer><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="save-button">Create List</button></footer>
      </form>
    </section>
  </div>
}
