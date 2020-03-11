
const drag = (event, taskId) => { 
    event.dataTransfer.setData("id", taskId); 
} 
const preventDefault = event => event.preventDefault();


const drop = event => {
    const taskId = event.dataTransfer.getData("id"); 
    const task = document.getElementById(taskId); 
    if (event.target.classList.contains('tasks')) { 
        event.target.appendChild(task) 
    }
}

const getLocalStorageColumns = () => localStorage.getItem('columns') ? 
    JSON.parse(localStorage.getItem('columns')) : [];

const columns = getLocalStorageColumns();
columns.forEach(column => {
    let tasks = ``
    
    column.tasks.forEach(task => {
        tasks += `<div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
        <h5>${task.title}</h5>
        <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
    </div>`
    })
    
    document.querySelector('main').innerHTML += `<div class="column" 
        id="${column.id}">
                    <h2>${column.title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    ${tasks}
                    </div>
                    <input type="text" onkeyup="addTask(event,${column.id})">
                    </div>`

}); 
const removeTaskFromLocalStorage = (taskId, columnId) => { 
    const columns = getLocalStorageColumns(); 
    const currentColumn = columns.find(column => column.id == columnId); 
    const tasksFiltered = currentColumn.tasks.filter(task => task.id !== taskId); 
    currentColumn.tasks = tasksFiltered; 
    localStorage.setItem('columns', JSON.stringify(columns)); 
}


const removeTask = (taskId) => { 
    const currentColumnId = document.getElementById(taskId).parentElement.parentElement.id; 
    removeTaskFromLocalStorage(taskId, currentColumnId) 
    document.getElementById(taskId).remove(); 
}

const addTask = (event, columnId) => { 
    if (event.key === 'Enter') { 
        const taskId = Date.now(); 
        document.getElementById(columnId).children[1].innerHTML += ` 
        <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
            <h5>${event.target.value}</h5>
            <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
        </div>`
            
        const columns = getLocalStorageColumns(); 
        
        const currentColumn = columns.find(column => column.id === columnId); 
    
        currentColumn.tasks.push({ 
            id: taskId,
            title: event.target.value
        }); 
        localStorage.setItem('columns', JSON.stringify(columns)); 
        event.target.value = ''; 
    }
}

document.querySelector('.addColumn').onkeyup = event => {  
    if (event.key === "Enter") {  
        const columnId = Date.now(); 
        const title = event.target.value 
        document.querySelector('main').innerHTML += ` <div class="column" 
        id="${columnId}">
                    <h2>${title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    </div>
                    <input type="text" onkeyup="addTask(event,${columnId})">
                    </div>`
                    
        const columns = getLocalStorageColumns(); 
        columns.push({ 
            id: columnId,
            title,
            tasks: []
        })
        localStorage.setItem('columns', JSON.stringify(columns)) 
        event.target.value = ''; 
    }
}
// document.querySelector('.addColumn').addEventListener('keyup', event => {}) // segunda forma de hacer lo mismo