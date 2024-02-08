

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const logoutButton = document.getElementById('logoutButton');

    let currentUser;

    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
        
        window.location.href = 'Homepage.html';
    } else {
        
        currentUser = getCurrentUser();
        console.log('Current User:', currentUser); 
        fetchTasks();

        
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addTask();
        });

        logoutButton.addEventListener('click', () => {
            
            logoutUser();
        });
    }

    function checkAuthentication() {
        const authToken = localStorage.getItem('authToken');
        return !authToken;
    }

    function getCurrentUser() {

        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    }

    function logoutUser() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }


    function fetchTasks() {
        fetch(`http://localhost:3000/tasks`)
            .then(response => response.json())
            .then(tasks => displayTasks(tasks))
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function displayTasks(tasks) {
        taskList.innerHTML = '';
        const maindiv = document.createElement("div");
        maindiv.style.display = "grid";
        maindiv.style.gridTemplateColumns = "repeat(4,1fr)";
        maindiv.style.gap = "20px"
        maindiv.style.textAlign = "center";

        tasks.forEach(task => {
            const div = document.createElement("div");

            const h3 = document.createElement("h3");
            h3.textContent = task.title;
            const p = document.createElement("p");
            p.textContent = task.description;


            const p1 = document.createElement("p");
            p1.textContent = task.dueDate;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener('click', () => {
                if (task._id) {
                    deleteTask(task._id);
                                } else {
                    console.error('Task ID is undefined');
                }
            });
            div.append(h3, p, p1, deleteButton);
            div.style.border = "2px solid red";
            maindiv.append(div);
            taskList.appendChild(maindiv);

        });
    }
    function deleteTask(taskId) {
        fetch(`http://localhost:3000/delete-task/${taskId}`, {
            method: 'DELETE',
        })
            .then(response => response.text())
            .then(message => {
                console.log(message);
                fetchTasks(); 
            })
            .catch(error => console.error('Error deleting task:', error));
    }
    function addTask() {
        const taskTitle = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('dueDate').value;

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            dueDate: dueDate,
            status: 'in progress',
           
        };

        fetch('http://localhost:3000/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
            .then(response => response.text())
            .then(message => {
                console.log(message);
                fetchTasks();
            })
            .catch(error => console.error('Error adding task:', error));
    }
});

function updateTask(taskId) {
    const updateTitle = document.getElementById('updateTitle').value;
    const updateDescription = document.getElementById('updateDescription').value;
    const updateDueDate = document.getElementById('updateDueDate').value;

    const updatedTask = {
        title: updateTitle,
        description: updateDescription,
        dueDate: updateDueDate,
    };

    fetch(`http://localhost:3000/update-task/${taskId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            displayTasks(message); 
        })
        .catch(error => console.error('Error updating task:', error));
}


function openUpdateForm(task) {
    const updateForm = document.createElement("form");
    updateForm.id = "updateForm";

    const titleLabel = document.createElement("label");
    titleLabel.for = "updateTitle";
    titleLabel.textContent = "Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "updateTitle";
    titleInput.value = task.title;
    titleLabel.appendChild(titleInput);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "updateDescription";
    descriptionLabel.textContent = "Description:";
    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "updateDescription";
    descriptionInput.value = task.description;
    descriptionLabel.appendChild(descriptionInput);

    const dueDateLabel = document.createElement("label");
    dueDateLabel.for = "updateDueDate";
    dueDateLabel.textContent = "Due Date:";
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.id = "updateDueDate";
    dueDateInput.value = task.dueDate;
    dueDateLabel.appendChild(dueDateInput);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Update Task";

    updateForm.append(titleLabel, descriptionLabel, dueDateLabel, submitButton);

    
    updateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        updateTask(task._id);
    
    });
    document.body.appendChild(updateForm);
}


updateTask()