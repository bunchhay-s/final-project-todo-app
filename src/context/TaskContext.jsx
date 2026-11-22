/* 
- useState initialized from localStorage
- useEffect saves tasks and settings to localStorage whenever tasks state changes


- also import functions from utilities/...


*/

import { createContext, useContext, useState, useEffect } from "react";
import { createTaskActions } from "../utilities/taskActions";

const TaskContext = createContext();

const DEMO_TASKS = [
{
    id: "1731142800001",
    title: "Finish slides",
    notes: "Check rubric",
    dueDate: "2026-11-22",
    priority: "high",
    list: "School",
    completed: false,
    flagged: true,
},
{
    id: "1731142800002",
    title: "Buy groceries",
    notes: "",
    dueDate: "",
    priority: "low",
    list: "Personal",
    completed: false,
    flagged: false,
  },    
]

const DEFAULT_LISTS = ["School", "Personal", "Work"]

const DEFAULT_SETTINGS = {
    darkmode: false,
    userName: "Student"
}

export function TaskProvider ({ children }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("todo_tasks");
        return saved ? JSON.parse(saved) : DEMO_TASKS;
    })

    const [lists, setLists] = useState(() => {
        const saved = localStorage.getItem("todo_lists");
        return saved ? JSON.parse(saved) : DEFAULT_LISTS;
    })

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("todo_settings");
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    })

    useEffect(() => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        localStorage.setItem("todo_lists", JSON.stringify(lists))
    }, [lists])

    useEffect(() => {
        localStorage.setItem("todo_settings", JSON.stringify(settings))
    }, [settings])

const actions = createTaskActions(setTasks, DEMO_TASKS);

    return (
        <TaskContext.Provider value={{tasks, lists, settings, setTasks, setLists, setSettings, ...actions}}>
            {children}
        </TaskContext.Provider>
    )

}



export function useTaskContext() {
    const context = useContext(TaskContext);
    return context;
}