import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async getByCategory(categoryId) {
    await delay(300);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      categoryId: taskData.categoryId || 'personal',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async toggleComplete(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    return { ...task };
  }

  async bulkDelete(ids) {
    await delay(400);
    const deletedTasks = [];
    ids.forEach(id => {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        deletedTasks.push(this.tasks.splice(index, 1)[0]);
      }
    });
    return deletedTasks;
  }

  async search(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }

  async getByFilters(filters) {
    await delay(300);
    let filteredTasks = [...this.tasks];

    if (filters.categoryId && filters.categoryId !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.categoryId === filters.categoryId);
    }

    if (filters.priority && filters.priority !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
    }

    if (filters.completed !== undefined) {
      filteredTasks = filteredTasks.filter(t => t.completed === filters.completed);
    }

    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filteredTasks = filteredTasks.filter(t => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        switch (filters.dueDate) {
          case 'today':
            return taskDate.getTime() === today.getTime();
          case 'overdue':
            return taskDate < today && !t.completed;
          case 'upcoming':
            return taskDate > today;
          default:
            return true;
        }
      });
    }

    return filteredTasks.map(t => ({ ...t }));
  }
}

export default new TaskService();