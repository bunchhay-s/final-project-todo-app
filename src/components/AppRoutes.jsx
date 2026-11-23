import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../pages/Overview'
import Today from '../pages/Today'
import Scheduled from '../pages/Scheduled'
import FlaggedView from '../pages/FlaggedView'
import ListView from '../pages/ListView'
import Settings from '../pages/Settings'

export default function AppRoutes({
  search,
  tasks,
  lists,
  listStyles,
  openTask,
  blankTask,
  toggleComplete,
  toggleFlag,
  deleteTask,
  removeList,
}) {
  return (
    <Routes>
      <Route path="/" element={<Overview searchTerm={search} />} />
      <Route path="/today" element={<Today searchTerm={search} />} />
      <Route path="/scheduled" element={<Scheduled searchTerm={search} />} />
      <Route path="/flagged" element={<FlaggedView tasks={tasks} openTask={openTask} blankTask={blankTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} />} />
      <Route path="/list/:listName" element={<ListView tasks={tasks} lists={lists} listStyles={listStyles} openTask={openTask} blankTask={blankTask} toggleComplete={toggleComplete} toggleFlag={toggleFlag} deleteTask={deleteTask} removeList={removeList} />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
