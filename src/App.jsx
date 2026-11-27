import { useEffect, useMemo, useState } from 'react'
import { useTaskContext } from './context/TaskContext'
import AppLayout from './components/AppLayout'
import AppRoutes from './components/AppRoutes'
import TaskModal from './pages/TaskModal'
import ListModal from './pages/ListModal'
import './App.css'

export default function App() {
  const {
    tasks,
    lists,
    setLists,
    setTasks,
    addTask,
    updateTask,
    toggleComplete,
    toggleFlag,
    deleteTask
  } = useTaskContext()

  const [search, setSearch] = useState('')
  const [taskModal, setTaskModal] = useState(null)
  const [listModal, setListModal] = useState(false)
  const [listStyles, setListStyles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('todo_list_styles')) || {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('todo_list_styles', JSON.stringify(listStyles))
  }, [listStyles])

  const searchedTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return tasks
    return tasks.filter((task) =>
      `${task.title} ${task.notes || ''}`.toLowerCase().includes(query)
    )
  }, [search, tasks])

  const blankTask = (list = '') => ({
    title: '',
    notes: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    flagged: false,
    list
  })

  const saveTask = (task) => {
    if (task.id) updateTask(task.id, task)
    else addTask(task)
  }

  const addList = (listName) => {
    setLists((current) =>
      current.includes(listName) ? current : [...current, listName]
    )
  }

  const removeList = (listName) => {
    setLists((current) => current.filter((name) => name !== listName))
    setTasks((current) =>
      current.map((task) => (task.list === listName ? { ...task, list: '' } : task))
    )
    setListStyles((current) => {
      const next = { ...current }
      delete next[listName]
      return next
    })
    return true
  }

  return (
    <AppLayout
      searchTerm={search}
      setSearchTerm={setSearch}
      listStyles={listStyles}
      onOpenNewTask={() => setTaskModal(blankTask())}
      onOpenNewList={() => setListModal(true)}
    >
      <AppRoutes
        search={search}
        tasks={searchedTasks}
        lists={lists}
        listStyles={listStyles}
        openTask={setTaskModal}
        blankTask={blankTask}
        toggleComplete={toggleComplete}
        toggleFlag={toggleFlag}
        deleteTask={deleteTask}
        removeList={removeList}
      />

      {taskModal !== null && (
        <TaskModal
          task={taskModal}
          lists={lists}
          onClose={() => setTaskModal(null)}
          onSave={(task) => {
            saveTask(task)
            setTaskModal(null)
          }}
        />
      )}

      {listModal && (
        <ListModal
          onClose={() => setListModal(false)}
          onSave={(list) => {
            addList(list.name)
            setListStyles((current) => ({
              ...current,
              [list.name]: { color: list.color, icon: list.icon }
            }))
            setListModal(false)
          }}
        />
      )}
    </AppLayout>
  )
}