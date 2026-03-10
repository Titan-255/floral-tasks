const API_URL = '/tasks';

document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('floralUser');
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('floralUser');
        window.location.href = '/login.html';
    });

    fetchTasks();

    const taskForm = document.getElementById('taskForm');
    const scrollToAddBtn = document.getElementById('scrollToAddBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const navLinks = document.querySelectorAll('.nav-links a');

    taskForm.addEventListener('submit', handleFormSubmit);
    scrollToAddBtn.addEventListener('click', () => {
        document.getElementById('addTaskSection').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('taskTitle').focus();
    });

    cancelBtn.addEventListener('click', resetForm);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            fetchTasks(filter);
        });
    });
});

let allTasks = [];
let currentFilter = 'all';

async function fetchTasks(filter = 'all') {
    currentFilter = filter;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        allTasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

function renderTasks() {
    const grid = document.getElementById('taskGrid');
    grid.innerHTML = '';

    let filteredTasks = allTasks;
    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(t => t.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--text-muted); grid-column: 1/-1;">No tasks found.</p>';
        return;
    }

    filteredTasks.sort((a, b) => b.id - a.id);

    filteredTasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const card = document.createElement('div');
        card.className = `card task-card ${isCompleted ? 'completed-task' : ''}`;

        card.innerHTML = `
            <h3 class="task-title">${escapeHTML(task.title)}</h3>
            <p class="task-desc">${escapeHTML(task.description)}</p>
            <div class="task-meta">
                <span class="status ${escapeHTML(task.status)}">${escapeHTML(task.status)}</span>
                <span class="task-date">${escapeHTML(task.createdAt)}</span>
            </div>
            <div class="task-actions">
                ${!isCompleted ? `<button class="action-btn btn-complete" onclick="markCompleted(${task.id})">Complete</button>` : `<button class="action-btn btn-complete" onclick="markPending(${task.id})">Mark Pending</button>`}
                <button class="action-btn btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    const payload = { title, description };

    try {
        if (id) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to update task");
        } else {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to create task");
        }

        resetForm();
        fetchTasks(currentFilter);
    } catch (error) {
        console.error("Error saving task:", error);
        alert("Failed to save task. See console for details.");
    }
}

async function markCompleted(id) {
    updateStatus(id, 'completed');
}

async function markPending(id) {
    updateStatus(id, 'pending');
}

async function updateStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error("Failed to update status");
        fetchTasks(currentFilter);
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete task");
        fetchTasks(currentFilter);
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;

    document.getElementById('submitBtn').textContent = 'Update Task';
    document.getElementById('cancelBtn').classList.remove('hidden');

    document.getElementById('addTaskSection').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Task';
    document.getElementById('cancelBtn').classList.add('hidden');
}
