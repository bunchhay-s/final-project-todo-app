import { useState, useEffect } from 'react'
import './ListModal.css'

export default function ListModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#5B2E91')
  const [icon, setIcon] = useState('📋')

  const icons = ['📋', '💼', '🏠', '🛍️', '🎓', '💪', '🎨', '✈️']
  const colors = [
    { hex: '#26124B', label: 'Midnight Plum' },
    { hex: '#5B2E91', label: 'Royal Violet' },
    { hex: '#8A4EC4', label: 'Vibrant Amethyst' },
    { hex: '#D499F5', label: 'Soft Lilac' },
    { hex: '#76EAE6', label: 'Aqua Mint' }
  ]

  // Allow closing modal via Escape key for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color, icon })
  }

  return (
    <div
      className="modal-backdrop list-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal small-modal list-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="list-modal-title"
      >
        {/* Modal Header */}
        <header className="list-modal-header">
          <div>
            <p className="eyebrow">My Lists</p>
            <h2 id="list-modal-title">New Custom List</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        <form className="list-modal-form" onSubmit={handleSubmit}>
          {/* Live Apple-Style Badge Preview */}
          <div className="list-preview-card">
            <div
              className="list-preview-badge"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            >
              <span>{icon}</span>
            </div>
            <p className="list-preview-name">
              {name.trim() || 'List Preview'}
            </p>
          </div>

          {/* List Name Input */}
          <label className="list-field-label">
            <span>List Name</span>
            <input
              type="text"
              required
              autoFocus
              maxLength={32}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Travel, INF 651, Fitness"
              className="list-text-input"
            />
          </label>

          {/* 5-Color Custom Palette Swatches */}
          <fieldset className="list-fieldset">
            <legend>Palette Color</legend>
            <div className="swatches">
              {colors.map(({ hex, label }) => {
                const isSelected = color === hex
                return (
                  <button
                    type="button"
                    key={hex}
                    title={label}
                    aria-label={`Choose ${label} (${hex})`}
                    aria-pressed={isSelected}
                    className={`swatch-btn ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setColor(hex)}
                  />
                )
              })}
            </div>
          </fieldset>

          {/* Icon Symbol Picker */}
          <fieldset className="list-fieldset">
            <legend>Icon Symbol</legend>
            <div className="icon-picker">
              {icons.map((value) => {
                const isSelected = icon === value
                return (
                  <button
                    type="button"
                    key={value}
                    aria-label={`Select icon ${value}`}
                    aria-pressed={isSelected}
                    className={`icon-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setIcon(value)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Footer Actions */}
          <footer className="list-modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={!name.trim()}
            >
              Create List
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}