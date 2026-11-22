import { useTaskContext } from "../context/TaskContext";
import { 
    isOverdue,
    isToday,
    isTmr,
    isUpcoming,
    getRelativeDate,
 } from "../utilities/dateHelpers"

export default function Scheduled() {
    const { tasks, toggleComplete, toggleFlag} = useTaskContext();

    const sections = [
        {
            title: "Overdue",
            items: tasks.filter(
                (task) => !task.completed && isOverdue(task.dueDate, task.completed )
            )
        },
        {
            title: "Today",
            items: tasks.filter((task) => isToday(task.dueDate))
        },
        {
            title: "Tomorrow",
            items: tasks.filter((task) => isTmr(task.dueDate))
        },
        {
            title: "Upcoming",
            items: tasks.filter((task) => isUpcoming(task.dueDate))
        },
        {
            title: "No Due Date",
            items: tasks.filter((task) => !task.dueDate),
        }
      
    ];


    return (
        <div style = {{ padding : "20px" }}> 
        <h1>Scheduled</h1>

        {sections.map((section) => (
            <div key={section.title} style= {{ marginBottom : "20px" }}>
                <h2>{section.title} {section.items.length}</h2> 

                {section.items.length === 0 ? (
                    <p>No Task</p>
                ) : (
                    <ul>
                        {section.items.map((task) => (
                            <li key={task.id}>
                                <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}></input>{"   "}

                                <span style = {{ textDecoration: task.completed ? "line-through" : "none", }}>
                                    {task.title}
                                </span>{" "}
                                ({getRelativeDate(task.dueDate)})
                                <button 
                                onClick={() => toggleFlag(task.id)}
                                style={{ marginLeft : "8px" }}>
                                    {task.flagged ? "Unflag" : "Flag"}
                                </button>
                            </li>
                        ))}

                    </ul>
                )}
            </div>
        ))}

        </div>
    )
}