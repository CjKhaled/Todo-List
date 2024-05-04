// Helper functions
function clearPage() {
    const content = document.querySelector(".content");
    content.innerHTML = '';
}

function formatDate(date) {
    const dt = new Date(date + 'T00:00:00');
    const options = { month: 'short', day: 'numeric' };
    let formattedDate = dt.toLocaleDateString('en-US', options);

    const day = dt.getDate();
    let suffix = 'th';
    const exceptions = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' };
    if (exceptions[day]) {
        suffix = exceptions[day];
    } else if (day > 3 && day < 21) {
        suffix = 'th';
    }

    return `${formattedDate}${suffix}`
}

function formatTitle(title) {
    let newTitle = title.trim();
    newTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    return newTitle;

}

class homeContent {
    constructor() {
        this.home = document.getElementById('home');
        this.active = true;
        this.todoList = [new todoItem("BoomBaby", "Tets", "Apr 31st", "high", this.deleteItem.bind(this), this.editTodoItem.bind(this)), new todoItem("BoomMom", "wassssussppp bitches", "Apr 29th", "medium", this.deleteItem.bind(this), this.editTodoItem.bind(this)), new todoItem("BoomPops", "Tsabjdsakdas", "Apr 26th", "low", this.deleteItem.bind(this), this.editTodoItem.bind(this))]
        this.loadTodoItems();
        this.createElements();
        this.addEventListeners();  
    }

    sortTodoItems() {
        const priorityValues = {'high': 3, 'medium': 2, 'low': 1};
        this.todoList.sort((a, b) => {
            return priorityValues[b.priority] - priorityValues[a.priority];
        })
    }

    loadTodoItems() {
        const savedItems = localStorage.getItem('todoItems');
        if (savedItems !== null) {
            this.todoList = JSON.parse(savedItems).map(item => new todoItem(item.title, item.desc, item.due, item.priority, this.deleteItem.bind(this), this.editTodoItem.bind(this)))
        } else {
            this.todoList = [];
        }
    }

    saveTodoItems() {
        localStorage.setItem('todoItems', JSON.stringify(this.todoList.map(item => ({title: item.title, desc: item.description, due: item.dueDate, priority: item.priority}))))
    }

    createElements() {
        this.content = document.querySelector(".content");
        this.popup = document.createElement('div');
        this.popup.className = 'popup';
        this.backdrop = document.createElement('div');
        this.backdrop.className = "backdrop";
        this.addButton = document.querySelector(".add-button");
        this.todoItems = document.createElement("div");
        this.todoItems.className = "todo-items";
        this.homeHeader = document.createElement("h2");
        this.homeHeader.style.cssText = "text-align: center";
    }

    addEventListeners() {
        this.backdrop.addEventListener('click', () => {
            this.popup.style.display = "none";
            this.backdrop.style.display = "none";
        })

        this.addButton.addEventListener('click', () => {
            if (this.active == true) {
                const today = new Date().toISOString().substring(0, 10);
                this.popup.innerHTML = `<h2>Add To-Do</h2> <form class='input-fields'> <label for='title'>Title:</label> <input type='text' placeholder='4-20 characters max' id='title' name='title' minlength='4' maxlength='20' required> <div class='radio-buttons'> <div class='button-group'><label for='high'>High</label> <input type='radio' id='high' name='priority' value='high' required></div> <div class='button-group'><label for='medium'>Medium</label> <input type='radio' id='medium' name='priority' value='medium' required></div> <div class='button-group'><label for='low'>Low</label> <input type='radio' id='low' name='priority' value='low' required> </div></div><label for='date'>Date Due:</label> <input type='date' id='date' name='date' value=${today} min=${today} max='2024-12-31' required> <label for='description'>Description: </label><textarea name='description' id='description' cols='30' rows='10' minlength='10' maxlength='150' placeholder='10-150 characters max' style='resize: none;' required></textarea> <button type='submit' id='add-to-do' class='add-to-do'>Add Item</button> <p>(click anywhere outside this box to exit the window)</p> </form>`
                this.popup.style.display = "flex";
                this.backdrop.style.display = "flex";
                this.addTodoItem();
            }
        })
    }

    addElements() {
        this.content.appendChild(this.homeHeader)
        this.content.appendChild(this.todoItems);
        this.content.appendChild(this.popup);
        this.content.appendChild(this.backdrop);
    }

    addTodoItem() {
        const submitForm = document.querySelector("form.input-fields")
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.todoList.length == 8) {
                alert("Too many items. You need to delete one to add another.")
            } else {
                const newTitle = formatTitle(e.target.title.value);
                const checkIfExists = this.todoList.some(object => object.title.toLowerCase() === newTitle.toLowerCase());
                if (checkIfExists == false) {
                    this.todoList.push(new todoItem(newTitle, e.target.description.value, formatDate(e.target.date.value), e.target.priority.value, this.deleteItem.bind(this), this.editTodoItem.bind(this)))
                    this.writeContent();
                    this.popup.style.display = "none"
                    this.backdrop.style.display = "none"
                    this.saveTodoItems();
                    submitForm.reset();
                } else {
                    alert("A to-do item with this name exists- use a different name.")
                }
            }
        })
    }

    editTodoItem(title) {        
        this.todoList.forEach((object) => {
            if (object.title == title) {
                const today = new Date().toISOString().substring(0, 10);
                this.popup.innerHTML = `<h2>Edit To-Do</h2> <form class='input-fields-edit'> <label for='title'>Title:</label> <input type='text' value=${object.title} placeholder='4-20 characters max' id='title' name='title' minlength='4' maxlength='20' required> <div class='radio-buttons'> <div class='button-group'><label for='high'>High</label> <input type='radio' id='high' name='priority' value='high' required></div> <div class='button-group'><label for='medium'>Medium</label> <input type='radio' id='medium' name='priority' value='medium' required></div> <div class='button-group'><label for='low'>Low</label> <input type='radio' id='low' name='priority' value='low' required> </div></div><label for='date'>Date Due:</label> <input type='date' id='date' name='date' min=${today} max='2024-12-31' required> <label for='description'>Description: </label><textarea name='description' id='description' cols='30' rows='10' minlength='10' maxlength='150' placeholder='10-150 characters max' style='resize: none;' required>${object.description}</textarea> <button type='submit' id='add-to-do' class='add-to-do'>Edit Item</button> <p>(click anywhere outside this box to exit the window)</p> </form>`
                this.popup.style.display = "flex";
                this.backdrop.style.display = "flex";
                const submitEdit = document.querySelector("form.input-fields-edit")
                submitEdit.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newTitle = formatTitle(e.target.title.value);
                    const checkIfExists = this.todoList.some(object => object.title.toLowerCase() === newTitle.toLowerCase());
                    if (checkIfExists == false) {
                        object.title = newTitle;
                        object.description = e.target.description.value;
                        object.dueDate = e.target.date.value;
                        object.priority = e.target.priority.value;
                        object.updatePriority();
                        this.writeContent();
                        this.popup.style.display = "none"
                        this.backdrop.style.display = "none"
                        this.saveTodoItems();
                        submitEdit.reset();
                    } else {
                        alert("A to-do item with this name exists- use a different name.")
                    }
                })
            }
        })
    }

    deleteItem(title) {
        this.todoList = this.todoList.filter(item => item.title !== title);
        const itemToDelete = document.querySelector(`[data-todo="${title}"]`)
        itemToDelete.remove();
        this.saveTodoItems();
        this.writeContent();
    }

    defaultText() {
        if (this.todoList.length == 0) {
            this.homeHeader.innerHTML = "This is currently empty. Click the lower left hand plus symbol to add a new task!";
        } else {
            this.homeHeader.innerHTML = "";
        }
    }

    checkClickedOn(check) {
        if (check == true) {
            this.home.className = "active"
        }

        else {
            this.home.className = "not-active"
            this.popup.style.display = "none";
            this.backdrop.style.display = "none";
        }

        this.changeStatus();
    }

    changeStatus() {
        if (this.home.className == 'active') {
            this.active = true;
        } 
        
        else {
            this.active = false;
        }
    }

    sideBarContent() {
        this.addButtonText = document.querySelector(".add-button-text");
        this.addButtonText.innerHTML = "Add Todo: Home"
    }

    writeContent() {
        if (this.active == true) {
            clearPage()
            this.addElements();
            this.sortTodoItems();
            this.defaultText();
            this.sideBarContent();
            this.todoList.forEach((item) => {
                item.showTodo(this.todoItems, this.popup, this.backdrop);
            })
        }  
    }
}

class projectsContent {
    constructor(handleProjectClick, deleteProject, addToProjects) {
        this.projects = document.getElementById('projects')
        this.active = false;
        this.loadProjects();
        this.handleProjectClick = handleProjectClick;
        this.deleteProject = deleteProject;
        this.createElements();
        this.addEventListeners();
        this.addToProjects = addToProjects;
        this.submitListenerAdded = false;
    }

    loadProjects() {
        const savedProjects = localStorage.getItem('projectObjects');
        if (savedProjects !== null) {
            this.projectObjects = JSON.parse(savedProjects).map(name => new projectContent(name));
        } else {
            this.projectObjects = [];
        }
    }

    saveProjects() {
        localStorage.setItem('projectObjects', JSON.stringify(this.projectObjects.map(proj => proj.name)))
    }

    createElements() {
        this.content = document.querySelector(".content");
        this.projectHeader = document.createElement("h2");
        this.projectHeader.innerHTML = "This is where you can add/delete projects";
        this.projectHeader.style.cssText = "text-align: center";
        this.projectItems = document.createElement("div");
        this.projectItems.className = "project-items";
        this.popup = document.createElement('div');
        this.popup.className = 'popup';
        this.popup.innerHTML = "<h2>New Project</h2> <form class='input-fields-projects'> <label for='title'>Title:</label> <input type='text' placeholder='2-10 characters max' id='title' name='title' minlength='2' maxlength='10' required> <button type='submit' id='add-to-do' class='add-to-do'>Add Project</button> </form>"
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'backdrop';
        this.addButton = document.querySelector(".add-button");
    }

    createProjectElements(name) {
        this.projectItem = document.createElement("div")
        this.projectItem.className = "project-item"
        this.projectTitle = document.createElement("div")
        this.projectTitle.className = "project-title";
        this.projectTitle.innerHTML = name;
        this.uiButtons = document.createElement("div")
        this.uiButtons.className = "ui-buttons"
        this.openProject = document.createElement("button");
        this.openProject.className = "open-project";
        this.openProject.innerHTML = "Open";
        this.deleteProjectButton = document.createElement("div")
        this.deleteProjectButton.className = "delete"
        this.deleteProjectButton.innerHTML = '<svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 290 290" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_24_"> <g id="XMLID_29_"> <path d="M265,60h-30h-15V15c0-8.284-6.716-15-15-15H85c-8.284,0-15,6.716-15,15v45H55H25c-8.284,0-15,6.716-15,15s6.716,15,15,15 h5.215H40h210h9.166H265c8.284,0,15-6.716,15-15S273.284,60,265,60z M190,60h-15h-60h-15V30h90V60z"></path> </g> <g id="XMLID_86_"> <path d="M40,275c0,8.284,6.716,15,15,15h180c8.284,0,15-6.716,15-15V120H40V275z"></path> </g> </g> </g></svg>'
        
    }

    addProjectEventListeners(name) {
        this.openProject.addEventListener('click', () => {
            this.handleProjectClick(name)
            console.log("opening " + name)
        })

        this.deleteProjectButton.addEventListener('click', () => {
            this.projectObjects = this.projectObjects.filter(item => item.name !== name);
            this.saveProjects();
            this.deleteProject(name);
        })
    }

    addEventListeners() {
        this.backdrop.addEventListener('click', () => {
            this.popup.style.display = "none";
            this.backdrop.style.display = "none";
        })

        this.addButton.addEventListener('click', () => {
            this.popup.style.display = "flex";
            this.backdrop.style.display = "flex";
            this.addProject();
        })        
    }

    addProject() {
        const submitProject = document.querySelector("form.input-fields-projects");
        if (this.submitListenerAdded !== true && this.active == true) {
            submitProject.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.projectObjects.length == 10) {
                    alert("Too many projects. You need to delete one to add another.")
                } else {
                    const newTitle = formatTitle(e.target.title.value)
                    const checkIfExists = this.projectObjects.some(object => object.name.toLowerCase() === newTitle.toLowerCase());
                    if (checkIfExists == false) {
                        this.projectObjects.push(new projectContent(newTitle));
                        this.saveProjects();
                        this.addToProjects(newTitle);
                        submitProject.reset();
                        this.popup.style.display = "none";
                        this.backdrop.style.display = "none"
                        this.writeContent();
                    } else {
                        alert("Project with this name already exists. Please choose a different name.")
                    }
                }
                
                
            })
            this.submitListenerAdded = true;
        } 
        
    }

    addProjectElements() {
        this.projectItems.appendChild(this.projectItem);
        this.projectItem.appendChild(this.projectTitle);
        this.projectItem.appendChild(this.uiButtons);
        this.uiButtons.appendChild(this.openProject);
        this.uiButtons.appendChild(this.deleteProjectButton);
    }

    addElements() {
        this.content.appendChild(this.projectHeader);
        this.content.appendChild(this.projectItems)
        this.content.appendChild(this.popup);
        this.content.appendChild(this.backdrop);
    }

    checkClickedOn(check) {
        if (check == true) {
            this.projects.className = "active"
        }

        else {
            this.projects.className = "not-active"
            this.popup.style.display = "none";
            this.backdrop.style.display = "none";
        }

        this.changeStatus();
    }

    changeStatus() {
        if (projects.className == 'active') {
            this.active = true;
        } 
        
        else {
            this.active = false;
        }
    }

    sideBarContent() {
        this.addButtonText = document.querySelector(".add-button-text");
        this.addButtonText.innerHTML = "Add Project: Projects"
    }

    writeContent() {
        if (this.active == true) {
            clearPage();
            this.addElements();
            this.sideBarContent()
            this.projectItems.innerHTML = "";
            this.projectObjects.forEach((object) => {
                this.createProjectElements(object.name);
                this.addProjectElements();
                this.addProjectEventListeners(object.name);
            })
        }
    }
}

class projectContent {
    constructor(name) {
        this.name = name
        this.active = false;
        this.todoList = [];
        this.loadTodoItems();
        this.createElements();
        this.addEventListeners();
    }

    sortTodoItems() {
        const priorityValues = {'high': 3, 'medium': 2, 'low': 1};
        this.todoList.sort((a, b) => {
            return priorityValues[b.priority] - priorityValues[a.priority];
        })
    }

    loadTodoItems() {
        const savedProjectItems = localStorage.getItem(`todoItems-${this.name}`);
        if (savedProjectItems !== null) {
            this.todoList = JSON.parse(savedProjectItems).map(item => new todoItem(item.title, item.desc, item.due, item.priority, this.deleteItem.bind(this), this.editTodoItem.bind(this)))
        } else {
            this.todoList = [];
        }
    }

    saveTodoItems() {
        localStorage.setItem(`todoItems-${this.name}`, JSON.stringify(this.todoList.map(item => ({title: item.title, desc: item.description, due: item.dueDate, priority: item.priority}))))
    }

    initializeProjectElement() {
        this.project = document.querySelector(`h3[data-project="${this.name}"]`)
    }

    createElements() {
        this.content = document.querySelector(".content");
        this.popup = document.createElement('div');
        this.popup.className = 'popup';
        this.backdrop = document.createElement('div');
        this.backdrop.className = "backdrop";
        this.addButton = document.querySelector(".add-button");
        this.todoItems = document.createElement("div");
        this.todoItems.className = "todo-items";
        this.projectHeader = document.createElement("h2");
        this.projectHeader.style.cssText = "text-align: center";
    }

    addEventListeners() {
        this.backdrop.addEventListener('click', () => {
            this.popup.style.display = "none";
            this.backdrop.style.display = "none";
        })

        this.addButton.addEventListener('click', () => {
            if (this.active == true) {
                const today = new Date().toISOString().substring(0, 10);
                this.popup.innerHTML = `<h2>Add To Project</h2> <form class='input-fields-project' id=${this.name}-add> <label for='title'>Title:</label> <input type='text' placeholder='4-20 characters max' id='title' name='title' minlength='4' maxlength='20' required> <div class='radio-buttons'> <div class='button-group'><label for='high'>High</label> <input type='radio' id='high' name='priority' value='high' required></div> <div class='button-group'><label for='medium'>Medium</label> <input type='radio' id='medium' name='priority' value='medium' required></div> <div class='button-group'><label for='low'>Low</label> <input type='radio' id='low' name='priority' value='low' required> </div></div><label for='date'>Date Due:</label> <input type='date' id='date' name='date' value=${today} min=${today} max='2024-12-31' required> <label for='description'>Description: </label><textarea name='description' id='description' cols='30' rows='10' minlength='10' maxlength='150' placeholder='10-150 characters max' style='resize: none;' required></textarea> <button type='submit' id='add-to-do' class='add-to-do'>Add Item</button> <p>(click anywhere outside this box to exit the window)</p> </form>`
                this.popup.style.display = "flex";
                this.backdrop.style.display = "flex";
                this.addTodoItem();
            }
        })
    }

    addElements() {
        this.content.appendChild(this.projectHeader)
        this.content.appendChild(this.todoItems);
        this.content.appendChild(this.popup);
        this.content.appendChild(this.backdrop);
    }

    addTodoItem() {
        const submitForm = document.getElementById(`${this.name}-add`)
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.todoList.length == 8) {
                alert("Too many items. You need to delete one to add another.")
            } else {
                const newTitle = formatTitle(e.target.title.value);
                const checkIfExists = this.todoList.some(object => object.title.toLowerCase() === newTitle.toLowerCase());
                if (checkIfExists == false) {
                    this.todoList.push(new todoItem(newTitle, e.target.description.value, formatDate(e.target.date.value), e.target.priority.value, this.deleteItem.bind(this), this.editTodoItem.bind(this)))
                    this.writeContent();
                    this.popup.style.display = "none"
                    this.backdrop.style.display = "none"
                    this.saveTodoItems()
                    submitForm.reset()
                } else {
                    alert("A to-do item with this name exists- use a different name.")
                }
            }
            
        })
    }

    editTodoItem(title) {        
        this.todoList.forEach((object) => {
            if (object.title == title) {
                const today = new Date().toISOString().substring(0, 10);
                this.popup.innerHTML = `<h2>Edit To-Do</h2> <form class='input-fields-edit' id=${this.name}-edit> <label for='title'>Title:</label> <input type='text' value=${object.title} placeholder='4-20 characters max' id='title' name='title' minlength='4' maxlength='20' required> <div class='radio-buttons'> <div class='button-group'><label for='high'>High</label> <input type='radio' id='high' name='priority' value='high' required></div> <div class='button-group'><label for='medium'>Medium</label> <input type='radio' id='medium' name='priority' value='medium' required></div> <div class='button-group'><label for='low'>Low</label> <input type='radio' id='low' name='priority' value='low' required> </div></div><label for='date'>Date Due:</label> <input type='date' id='date' name='date' min=${today} max='2024-12-31' required> <label for='description'>Description: </label><textarea name='description' id='description' cols='30' rows='10' minlength='10' maxlength='150' placeholder='10-150 characters max' style='resize: none;' required>${object.description}</textarea> <button type='submit' id='add-to-do' class='add-to-do'>Edit Item</button> <p>(click anywhere outside this box to exit the window)</p> </form>`
                this.popup.style.display = "flex";
                this.backdrop.style.display = "flex";
                const submitEdit = document.getElementById(`${this.name}-edit`)
                submitEdit.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newTitle = formatTitle(e.target.title.value);
                    const checkIfExists = this.todoList.some(object => object.title.toLowerCase() === newTitle.toLowerCase());
                    if (checkIfExists == false) {
                        object.title = newTitle;
                        object.description = e.target.description.value;
                        object.dueDate = e.target.date.value;
                        object.priority = e.target.priority.value;
                        object.updatePriority();
                        this.writeContent();
                        this.popup.style.display = "none"
                        this.backdrop.style.display = "none"
                        this.saveTodoItems();
                        submitEdit.reset();
                    } else {
                        alert("A to-do item with this name exists- use a different name.")
                    }
                    
                })
            }
        })
    }

    deleteItem(title) {
        this.todoList = this.todoList.filter(item => item.title !== title);
        const itemToDelete = document.querySelector(`[data-todo="${title}"]`)
        itemToDelete.remove();
        this.saveTodoItems();
        this.writeContent();
    }

    checkClickedOn(check) {
        this.initializeProjectElement();
        if (check == true) {
            this.project.className = "active"
        }

        else {
            this.project.className = "not-active"
        }

        this.changeStatus();
    }

    changeStatus() {
        if (this.project.className == 'active') {
            this.active = true;
        } 
        
        else {
            this.active = false;
        }
    }

    defaultText() {
        if (this.todoList.length == 0) {
            this.projectHeader.innerHTML = "This project is currently empty. Click the lower left hand plus symbol to add a new task!";
        } else {
            this.projectHeader.innerHTML = "";
        }
    }

    sideBarContent() {
        this.addButtonText = document.querySelector(".add-button-text");
        this.addButtonText.innerHTML = `Add Todo: ${this.name}`
    }

    writeContent() {
        if (this.active == true) {
            clearPage()
            this.addElements();
            this.defaultText();
            this.sortTodoItems();
            this.sideBarContent()
            this.todoList.forEach((item) => {
                item.showTodo(this.todoItems, this.popup, this.backdrop);
            })
        }
    }
}

class contentController {
    constructor () {
        this.projectObjects = [];
        this.homeContent = new homeContent();
        this.projectsContent = new projectsContent(this.handleProjectClick.bind(this), this.deleteProject.bind(this), this.addToProjects.bind(this));
        this.loadProjects();
        // home content by default is active, so we will show on initialization
        this.homeContent.writeContent();
    }

    loadProjects() {
        const savedProjects = localStorage.getItem('projectObjects');
        if (savedProjects !== null) {
            this.projectObjects = JSON.parse(savedProjects).map(name => new projectContent(name));
        } else {
            this.projectObjects = [];
        }

        this.updateSidebar();
    }

    handleLinkClick() {
        const links = document.querySelector(".links")
        links.addEventListener('click', (e) => {
            if (e.target.id == 'home') {
                this.homeContent.checkClickedOn(true);
                this.projectsContent.checkClickedOn(false);
                this.projectObjects.forEach((object) => {
                    object.checkClickedOn(false);
                })
                this.homeContent.writeContent();
            }

            if (e.target.id == 'projects') {
                this.projectsContent.checkClickedOn(true);
                this.homeContent.checkClickedOn(false);
                this.projectObjects.forEach((object) => {
                    object.checkClickedOn(false);
                })
                this.projectsContent.writeContent();
            }

            if (e.target.id == 'project') {
                this.projectObjects.forEach((object) => {
                    if (object.name == e.target.getAttribute('data-project')) {
                        object.checkClickedOn(true);
                        this.homeContent.checkClickedOn(false);
                        this.projectsContent.checkClickedOn(false);
                        object.writeContent()
                    } else {
                        object.checkClickedOn(false)
                    }
                })
            }
        })
    }

    handleProjectClick(title) {
        this.projectObjects.forEach((object) => {
            if (object.name == title) {
                object.checkClickedOn(true);
                this.homeContent.checkClickedOn(false);
                this.projectsContent.checkClickedOn(false);
                object.writeContent()
            } else {
                object.checkClickedOn(false);
            }
        })
    }

    deleteProject(title) {
        this.projectObjects = this.projectObjects.filter(item => item.name !== title);
        const project = document.querySelector(`h3[data-project="${title}"]`)
        project.remove();
        this.projectsContent.writeContent();
    }

    updateSidebar() {
        const sideBarProjectLinks = document.querySelector('.project-links');
        sideBarProjectLinks.innerHTML = "";
        
        this.projectObjects.forEach(proj => {
            const newLink = document.createElement("h3")
            newLink.id = "project";
            newLink.className = "not-active";
            newLink.style.fontSize = "23px";
            newLink.setAttribute('data-project', proj.name);
            newLink.innerHTML = proj.name;
            sideBarProjectLinks.appendChild(newLink);
        })
        this.projectsContent.writeContent();
    }

    addToProjects(title) {
        this.projectObjects.push(new projectContent(title));
        this.updateSidebar();
    }
}


class todoItem {
    constructor(title, desc, due, priority, onDelete, editTodo) {
        this.title = title;
        this.description = desc;
        this.dueDate = due;
        this.priority = priority;
        this.onDelete = onDelete
        this.editTodo = editTodo;
        this.updatePriority();
        this.createTodoElements();
        this.addEventListeners();
    }

    createTodoElements() {
        this.completed = false;
        this.detailsShowing = false;
        if (this.priority == 'high') {
            this.color = 'red';
        } else if (this.priority == 'medium') {
            this.color = 'orange'
        } else if (this.priority == 'low') {
            this.color = 'green'
        }

        this.todo = document.createElement("div");
        this.todo.className = "todo-item"
        this.todo.style.cssText = `border-left: solid 10px ${this.color}`
        this.todo.setAttribute('data-todo', this.title)

        this.leftSide = document.createElement("div");
        this.leftSide.className = "left-side";
        
        this.checkButton = document.createElement("div")
        this.checkButton.className = "check"
        this.checkButton.innerHTML = '<svg width="28px" height="28px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>ic_fluent_checkbox_unchecked_24_regular</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="ic_fluent_checkbox_unchecked_24_regular" fill="#212121" fill-rule="nonzero"> <path d="M5.75,3 L18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 Z M5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 L5.75,4.5 Z" id="🎨Color"> </path> </g> </g> </g></svg>'
        
        this.name = document.createElement("div");
        this.name.className = "name";
        this.name.innerHTML = this.title;

        this.todo.appendChild(this.leftSide);
        this.leftSide.appendChild(this.checkButton);
        this.leftSide.appendChild(this.name);

        this.rightSide = document.createElement("div")
        this.rightSide.className = "right-side"

        this.details = document.createElement("div")
        this.details.innerHTML = "Details"
        this.details.className = "details";

        this.date = document.createElement("div")
        this.date.className = "date";
        this.date.innerHTML = this.dueDate

        this.editButton = document.createElement("div")
        this.editButton.innerHTML = '<svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 348.882 348.882" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231 c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685 c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176 C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99 L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386 c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"></path> <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904 c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15 s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798 c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"></path> </g> </g></svg>'
        this.editButton.className = "edit";

        this.deleteButton = document.createElement("div")
        this.deleteButton.className = "delete";
        this.deleteButton.innerHTML = '<svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 290 290" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_24_"> <g id="XMLID_29_"> <path d="M265,60h-30h-15V15c0-8.284-6.716-15-15-15H85c-8.284,0-15,6.716-15,15v45H55H25c-8.284,0-15,6.716-15,15s6.716,15,15,15 h5.215H40h210h9.166H265c8.284,0,15-6.716,15-15S273.284,60,265,60z M190,60h-15h-60h-15V30h90V60z"></path> </g> <g id="XMLID_86_"> <path d="M40,275c0,8.284,6.716,15,15,15h180c8.284,0,15-6.716,15-15V120H40V275z"></path> </g> </g> </g></svg>'
    
        this.todo.appendChild(this.rightSide);
        this.rightSide.appendChild(this.details);
        this.rightSide.appendChild(this.date);
        this.rightSide.appendChild(this.editButton);
        this.rightSide.appendChild(this.deleteButton);
    }

    addEventListeners() {
        this.checkButton.addEventListener('click', () => {
            this.completed = !this.completed;
            if (this.completed == false) {
                this.checkButton.innerHTML = '<svg width="28px" height="28px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>ic_fluent_checkbox_unchecked_24_regular</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="ic_fluent_checkbox_unchecked_24_regular" fill="#212121" fill-rule="nonzero"> <path d="M5.75,3 L18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 Z M5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 L5.75,4.5 Z" id="🎨Color"> </path> </g> </g> </g></svg>'
            } else if (this.completed == true) {
                this.checkButton.innerHTML = '<svg width="28px" height="28px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>ic_fluent_checkbox_checked_24_regular</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="ic_fluent_checkbox_checked_24_regular" fill="#212121" fill-rule="nonzero"> <path d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z" id="🎨Color"> </path> </g> </g> </g></svg>'
            }
        })

        this.details.addEventListener('click', () => {
            this.detailsShowing = !this.detailsShowing;
            if (this.detailsShowing == true) {
                this.popup.innerHTML = `<h2>${this.title}</h2> <div class="details-top"><p>Due Date: ${this.dueDate}</p> <p>${this.priority} priority</p></div>  <p>Description: ${this.description}</p> <p>(click anywhere outside this box to exit the window)</p>`;
                this.popup.style.display = 'flex';
                this.backdrop.style.display = 'flex';
            }      
        })

        this.editButton.addEventListener('click', () => {
            this.editTodo(this.title);
        })

        this.deleteButton.addEventListener('click', () => {
            this.onDelete(this.title)
        })
    }

    updateTodo() {
        this.todo.style.cssText = `border-left: solid 10px ${this.color}`;
        this.name.innerHTML = this.title;
        this.date.innerHTML = this.dueDate;
    }

    updatePriority() {
        if (this.priority == 'high') {
            this.color = 'red';
        } else if (this.priority == 'medium') {
            this.color = 'orange'
        } else if (this.priority == 'low') {
            this.color = 'green'
        }
    }

    showTodo(todoItems, popup, backdrop) {
        this.popup = popup;
        this.backdrop = backdrop;

        backdrop.addEventListener('click', () => {
            popup.style.display = 'none';
            backdrop.style.display = 'none';
            this.detailsShowing = false;
        })

        this.updateTodo()

        todoItems.appendChild(this.todo)
    }
}

const content = new contentController();
content.handleLinkClick()







