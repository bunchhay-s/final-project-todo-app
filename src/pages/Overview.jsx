// Homepage ../

import { useTaskContext } from "../context/TaskContext";
import { isToday, isOverdue, getRelativeDate } from "../utilities/dateHelpers";

export default function Overview({ searchTerm = "" }) {
    const { tasks, lists, toggleComplete } = useTaskContext();
    const query = searchTerm.trim().toLowerCase();
    const visibleTasks = query
        ? tasks.filter((task) => `${task.title} ${task.notes || ""}`.toLowerCase().includes(query))
        : tasks;

    const todayCount = visibleTasks.filter((task) => !task.completed && isToday(task.dueDate)).length;
    const overdueCount = visibleTasks.filter(
        (task)=> !task.completed && isOverdue(task.dueDate, task.completed)).length
    const scheduleCount = visibleTasks.filter((task) => !task.completed && task.dueDate).length
    const flaggedCount = visibleTasks.filter((task) => !task.completed && task.flagged).length
    const allActiveCount = visibleTasks.filter((task) => !task.completed).length

    const focusTask = visibleTasks.filter((task) => !task.completed && (isToday(task.dueDate) || isOverdue(task.dueDate, task.completed)))

    return (
        <div style={{ padding:"20px" }}>
            <h1>Overview</h1>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div><strong>Today: </strong>{todayCount}</div>
                <div><strong>Scheduled: </strong>{scheduleCount}</div>
                <div><strong>All: </strong>{allActiveCount}</div>
                <div><strong>Flagged: </strong>{flaggedCount}</div>
                <div><strong>Overdue: </strong>{overdueCount}</div>
            </div>


            <h2>My Lists</h2>
            <ul>
                {lists.map((listName) => {
                    const count = visibleTasks.filter(
                        (task) => task.list === listName && !task.completed).length;
                        return (
                            <li key={listName}>
                                {listName}: {count}
                            </li>
                        );
                })}
            </ul>

            <h2>Today && Overdue Focus</h2>
            {focusTask.length === 0 ? (
                <p>All caught up for today</p>
            ) : (
                <ul>
                    {focusTask.map((task) => (
                        <li key={task.id}>
                        <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}></input>{"  "}
                        {task.title} ({getRelativeDate(task.dueDate)})
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}