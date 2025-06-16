import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StatsService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getUserStats() {
    await delay(200);
    
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    
    // Calculate today's completed tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCompleted = this.tasks.filter(t => {
      if (!t.completed || !t.updatedAt) return false;
      const taskDate = new Date(t.updatedAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

    // Calculate streak (simplified - consecutive days with completed tasks)
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const hasCompletedTask = this.tasks.some(t => {
        if (!t.completed || !t.updatedAt) return false;
        const taskDate = new Date(t.updatedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === checkDate.getTime();
      });
      
      if (hasCompletedTask) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalTasks,
      completedTasks,
      streak,
      todayCompleted,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }

  async getCategoryStats() {
    await delay(250);
    
    const categoryStats = {};
    this.tasks.forEach(task => {
      if (!categoryStats[task.categoryId]) {
        categoryStats[task.categoryId] = {
          total: 0,
          completed: 0
        };
      }
      categoryStats[task.categoryId].total++;
      if (task.completed) {
        categoryStats[task.categoryId].completed++;
      }
    });

    return categoryStats;
  }

  async getWeeklyProgress() {
    await delay(200);
    
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const completed = this.tasks.filter(t => {
        if (!t.completed || !t.updatedAt) return false;
        const taskDate = new Date(t.updatedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      }).length;
      
      weeklyData.push({
        date: date.toISOString().split('T')[0],
        completed,
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return weeklyData;
  }
}

export default new StatsService();