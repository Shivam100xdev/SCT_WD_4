class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.bindEvents();
        this.loadTasks();
        this.updateStats();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.dueDate = document.getElementById('dueDate');
        this.addBtn = document.getElementById('addBtn');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalTasks = document.getElementById('totalTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.overdueTasks = document.getElementById('overdueTasks');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date(),
            dueDate: this.dueDate.value ? new Date(this.dueDate.value) : null
        };

        this.tasks.push(task);
        this.taskInput.value = '';
        this.dueDate.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // Add button animation
        this.addBtn.classList.add('pulse');
        setTimeout(() => this.addBtn.classList.remove('pulse'), 600);
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    isOverdue(task) {
        if (!task.dueDate || task.completed) return false;
        return new Date() > task.dueDate;
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            case 'overdue':
                return this.tasks.filter(t => this.isOverdue(t));
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">📝</div>
                    <h3>No tasks!</h3>
                    <p>Add your first task above to get started</p>
                </div>
            `;
            return;
        }

        this.tasksContainer.innerHTML = filteredTasks.map(task => {
            const isOverdue = this.isOverdue(task);
            const dueDateText = task.dueDate ? 
                `Due: ${task.dueDate.toLocaleDateString()}` : 
                'No due date';

            return `
                <div class="task ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                    <div class="task-header">
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            ${!task.completed ? `
                                <button class="task-btn complete-btn" onclick="todoApp.completeTask(${task.id})">
                                    Complete
                                </button>
                            ` : ''}
                            <button class="task-btn delete-btn" onclick="todoApp.deleteTask(${task.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                    <div class="task-date">
                        ${dueDateText}
                        ${isOverdue ? '<span class="overdue-badge">OVERDUE</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;
        const overdue = this.tasks.filter(t => this.isOverdue(t)).length;

        this.totalTasks.textContent = total;
        this.pendingTasks.textContent = pending;
        this.completedTasks.textContent = completed;
        this.overdueTasks.textContent = overdue;

        // Add pulse animation to updated stats
        [this.totalTasks, this.pendingTasks, this.completedTasks, this.overdueTasks].forEach(el => {
            el.classList.add('pulse');
            setTimeout(() => el.classList.remove('pulse'), 600);
        });
    }

    saveTasks() {
        // For persistent storage, you can uncomment the following line:
        // localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        // For persistent storage, you can uncomment the following lines:
        // const savedTasks = localStorage.getItem('todoTasks');
        // if (savedTasks) {
        //     this.tasks = JSON.parse(savedTasks).map(task => ({
        //         ...task,
        //         createdAt: new Date(task.createdAt),
        //         dueDate: task.dueDate ? new Date(task.dueDate) : null
        //     }));
        // }
        this.renderTasks();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});