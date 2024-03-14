function createToDo(title, desc, due, priority) {
    return new todoItem(title, desc, due, priority)
}

class todoItem {
    constructor(title, desc, due, priority) {
        this.title = title;
        this.description = desc;
        this.dueDate = due;
        this.priority = priority;
    }
}