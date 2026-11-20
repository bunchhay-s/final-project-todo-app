// TEST taskActions.js from ./utilities/taskActions.js

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