// TEST 1 taskActions.js from ./utilities/taskActions.js ========

// import { useState } from "react";
// import { createTaskActions } from "./utilities/taskActions";

// const demoTasks = [
//   { id: "1", title: "Sample Task", completed: false, flagged: false },
// ];

// export default function App() {
//   const [tasks, setTasks] = useState(demoTasks);
//   const actions = createTaskActions(setTasks, demoTasks);

//   return (
//     <div style={{ padding: "20px" }}>
//       <button onClick={() => actions.addTask({ title: "New Task" })}>
//         Add Task
//       </button>
//       <button onClick={() => actions.toggleComplete("1")}>
//         Toggle Task 1
//       </button>
//       <button onClick={() => actions.deleteTask("1")}>
//         Delete Task 1
//       </button>
//       <button onClick={() => actions.resetDemoData()}>
//         Reset
//       </button>

//       <pre>{JSON.stringify(tasks, null, 2)}</pre>
//     </div>
//   );
// }


// TEST 2 - TaskContext.jsx from ./context/TaskContext.jsx =========


// import { TaskProvider, useTaskContext } from "./context/TaskContext";

// function TestPanel() {
//   const { tasks, addTask, toggleComplete, deleteTask, resetDemoData } = useTaskContext();

//   return (
//     <div style={{ padding: "20px" }}>
//       <button onClick={() => addTask({ title: "Saved Task", list: "School", priority: "high" })}>
//         Add Task
//       </button>
//       <button onClick={() => tasks[0] && toggleComplete(tasks[0].id)}>
//         Toggle First
//       </button>
//       <button onClick={() => tasks[0] && deleteTask(tasks[0].id)}>
//         Delete First
//       </button>
//       <button onClick={resetDemoData}>
//         Reset Demo
//       </button>
//       <pre>{JSON.stringify(tasks, null, 2)}</pre>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <TaskProvider>
//       <TestPanel />
//     </TaskProvider>
//   );
// }

// // TEST 3 - datehelpers ==========

// import {
//   isToday,
//   isOverdue,
//   isTmr,
//   isUpcoming,
//   getRelativeDate,
// } from "./utilities/dateHelpers";

// const sampleDates = [
//   "2026-11-20", // Yesterday (overdue)
//   "2026-11-21", // Today
//   "2026-11-22", // Tomorrow
//   "2026-11-28", // Upcoming
//   "",           // No due date
// ];

// export default function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       {sampleDates.map((d, idx) => (
//         <div key={idx} style={{ marginBottom: "8px" }}>
//           <strong>Date:</strong> {d || "(none)"} |{" "}
//           <strong>Label:</strong> {getRelativeDate(d)} |{" "}
//           <strong>Overdue:</strong> {String(isOverdue(d))} |{" "}
//           <strong>Today:</strong> {String(isToday(d))} |{" "}
//           <strong>Tomorrow:</strong> {String(isTmr(d))} |{" "}
//           <strong>Upcoming:</strong> {String(isUpcoming(d))}
//         </div>
//       ))}
//     </div>
//   );
// }


// TEST 4 - Today.jsx ==========

import { TaskProvider } from "./context/TaskContext";
import Scheduled from "./pages/Scheduled";

export default function App() {
  return (
    <TaskProvider>
      <Scheduled />
    </TaskProvider>
  );
}