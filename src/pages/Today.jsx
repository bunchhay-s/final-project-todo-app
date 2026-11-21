import { useTaskContext } from "../context/TaskContext";
import { isToday, isOverdue, getRelativeDate } from "../utilities/dateHelpers";

export default function Today() {
    const { tasks, toggleComplete, toggleFlag } = useTaskContext();
    
    const overDueTasks = tasks.filer((task)=>
         !task.completed && isOverdue(task.dueDate, task.completed)
    )

    const dueTodayTaks = tasks.filter((task) => isToday(task.dueDate));
}

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
                        checked={task.complete}
                        onChange={() => toggleComplete(task.id)}></input>{"   "}
                        <strong>{task.title}</strong> ({getRelativeDate(task.dueDate)})
                        <button onClick={() => toggleFlag(task.id)} style= {{ marginLeft: "8px" }}>
                            {task.flagged ? "Unflag" : "Flag"}
                        </button>
                    </li>
                ))}
            </ul>
        )}






    </div>



)