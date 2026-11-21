//  Example & Format of the objects.
// {
//   id: "1731142800000",   // String (generated via Date.now().toString())
//   title: "Finish slides", // String (required)
//   notes: "Check rubric",  // String (optional)
//   dueDate: "2026-11-21",  // String in YYYY-MM-DD format, or "" if no due date
//   priority: "high",       // String: "low" | "medium" | "high"
//   list: "School",         // String: category/list name
//   completed: false,       // Boolean
//   flagged: false          // Boolean
// } 


//addTask
export const createTaskActions = (setTasks, demoTasks) => { //from /context/TaskContext.jsx
    const addTask = (newTask) => {
        const task = {
            id: Date.now().toString(),
            completed: false,
            flagged: false,
            ...newTask
        };
        setTasks(prevTasks => [task, ...prevTasks]);
    }



//updateTask
const updateTask = (id, updatedFields) => {
    setTasks((prev) => 
    prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
        )
    )
}


// toggleComplete
const toggleComplete = (id) => {
    setTasks((prev)=>
    prev.map((task) => 
    task.id === id ? { ...task, completed: !task.completed } : task
        )
    )
}

// toggleFlag
const toggleFlag = (id) => {
    setTasks((prev) => 
    prev.map((task) => 
    task.id === id ? { ...task, flagged: !task.flagged } : task
        )
    )
}

// deleteTask
const deleteTask = (id) => {
    setTasks((prev) =>
    prev.filter((task) => task.id !== id))
}


// clearCompletedTasks
const clearCompletedTasks = () => {
    setTasks((prev) =>
    prev.filter((task) => !task.completed))
}
//resetDemodata

const resetDemoData = () => {
    setTasks(demoTasks);
}

return {
    addTask,
    updateTask,
    toggleComplete,
    toggleFlag,
    deleteTask,
    clearCompletedTasks,
    resetDemoData,
  };

}