import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TaskList } from './TaskComponents'

export default function ListView({ tasks, lists, listStyles, openTask, blankTask, toggleComplete, toggleFlag, deleteTask, removeList }) {
  const { listName: encodedName } = useParams()
  const navigate = useNavigate()
  const listName = decodeURIComponent(encodedName)
  const listTasks = tasks.filter((task) => task.list === listName)
  const remaining = listTasks.filter((task) => !task.completed).length
  if (!lists.includes(listName)) return <Navigate to="/" replace />

  return <section className="view">
    <header className="view-header"><div><p className="eyebrow"><span className="list-dot inline" style={{ backgroundColor: listStyles[listName]?.color || '#5B2E91' }}>{listStyles[listName]?.icon || '●'}</span> My Lists</p><h1>{listName}</h1><p>{remaining} {remaining === 1 ? 'reminder' : 'reminders'} remaining</p></div><div className="header-actions"><button type="button" className="delete-list" onClick={() => { if (removeList(listName)) navigate('/') }}>Delete List</button><button type="button" className="add-button" onClick={() => openTask(blankTask(listName))}>＋ New Reminder</button></div></header>
    <TaskList tasks={listTasks} openTask={openTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} />
  </section>
}
