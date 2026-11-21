// Function to create 

//formatter 
export function formatDate(now){
    const year = now.getFullYear();
    const month = String(now.getMonth() +1 ).padStart(2, "0"); //somehow its inxdex starting at 0?
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`
}


// 1. getToday yy-month-day
export function getTodayStr() {
    // const today = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth() +1 ).padStart(2, "0"); //somehow its inxdex starting at 0?
    // const day = String(now.getDate()).padStart(2, "0");
    // return `${year}-${month}-${day}`
    return formatDate(new Date())
}

// 2. isToday
export function isToday(dateStr){
    if (!dateStr) return false;
    return dateStr === getTodayStr(); 
}
// 3. isOverdue

export function isOverdue(dateStr, completed = false){
    if(!dateStr || completed) return false;
    return dateStr < getTodayStr();
}
// 4. isTmr

export function isTmr(dateStr){
    if (!dateStr) return false;
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return dateStr === formatDate(tmr)
}
// 5. isUpcoming

export function isUpcoming(dateStr){ //more than 2 days 
    if (!dateStr) return false;
    return dateStr > getTodayStr() && !isTmr(dateStr)
}

export function getRelativeDate(dateStr) {
    if (!dateStr) return "No Due Date";
    if (isToday(dateStr)) return "Today";
    if (isOverdue(dateStr)) return "Overdue";
    if (isTmr(dateStr)) return "Tomorrow";
    return dateStr;
}