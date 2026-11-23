import { useTaskContext } from "../context/TaskContext";
import { isToday, isOverdue, getRelativeDate } from "../utilities/dateHelpers";

export default function Today({ searchTerm = "" }) {
    const { tasks, toggleComplete, toggleFlag } = useTaskContext();
    const query = searchTerm.trim().toLowerCase();
    const visibleTasks = query
        ? tasks.filter((task) => `${task.title} ${task.notes || ""}`.toLowerCase().includes(query))
        : tasks;
    
    const overDueTasks = visibleTasks.filter((task)=>
         !task.completed && isOverdue(task.dueDate, task.completed)
    )

    const dueTodayTaks = visibleTasks.filter((task) => isToday(task.dueDate));


return (
    <div style={{ padding: "20px" }}>
        <h1>Today</h1>

        <h1>OverDue</h1>
        {overDueTasks.length === 0 ? (
            <p>No OverDue Tasks.</p>
        ) : (
            <ul>
                {overDueTasks.map((task)=>(
                    <li key={task.id}>
                        <input
                        type = "checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}></input>{"   "}
                        <strong>{task.title}</strong> ({getRelativeDate(task.dueDate)}) {/* <- Bab, edit the UI here */}
                        <button onClick={() => toggleFlag(task.id)} style= {{ marginLeft: "8px" }}> {/* <- Bab, edit the UI here */}
                            {task.flagged ? "Unflag" : "Flag"} {/* <- Bab, edit the UI here */}
                        </button>
                    </li>
                ))}
            </ul>
        )}

        <h2>Due Today</h2>
        {dueTodayTaks.length === 0 ? (
            <p>No tasks due today.</p>
        ): (
            <ul>
                {dueTodayTaks.map((task) => (
                    <li key={task.id}>
                        <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}></input>{"  "}
                        <span style={{ textDecoration: task.completed ? "line-through" : "none" }}> {/* <- Bab, edit the UI here */}
                            {task.title}
                        </span>
                        <button onClick={() => toggleFlag(task.id)} style={{ marginLeft: "8px" }}>
                            {task.flagged ? "Unflag" : "Flag"} {/* <- Bab, edit the UI here */}
                        </button>

                    </li>
                ))}
            </ul>

        )}
    </div>



)
}