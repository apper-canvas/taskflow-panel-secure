import { toast } from 'react-toastify'

class StatsService {
  constructor() {
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async getUserStats() {
    try {
      // Get all tasks for calculations
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "completed" } },
          { field: { Name: "updated_at" } }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return {
          totalTasks: 0,
          completedTasks: 0,
          streak: 0,
          todayCompleted: 0,
          completionRate: 0
        }
      }

      const tasks = response.data || []
      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.completed).length
      
      // Calculate today's completed tasks
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayCompleted = tasks.filter(t => {
        if (!t.completed || !t.updated_at) return false
        const taskDate = new Date(t.updated_at)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime()
      }).length

      // Calculate streak (simplified - consecutive days with completed tasks)
      let streak = 0
      const currentDate = new Date()
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(currentDate)
        checkDate.setDate(checkDate.getDate() - i)
        checkDate.setHours(0, 0, 0, 0)
        
        const hasCompletedTask = tasks.some(t => {
          if (!t.completed || !t.updated_at) return false
          const taskDate = new Date(t.updated_at)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate.getTime() === checkDate.getTime()
        })
        
        if (hasCompletedTask) {
          streak++
        } else if (i > 0) {
          break
        }
      }

      return {
        totalTasks,
        completedTasks,
        streak,
        todayCompleted,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      toast.error("Failed to load statistics")
      return {
        totalTasks: 0,
        completedTasks: 0,
        streak: 0,
        todayCompleted: 0,
        completionRate: 0
      }
    }
  }

  async getCategoryStats() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "completed" } },
          { field: { Name: "category_id" } }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return {}
      }

      const tasks = response.data || []
      const categoryStats = {}
      
      tasks.forEach(task => {
        const categoryId = task.category_id?.Id || task.category_id || 'uncategorized'
        if (!categoryStats[categoryId]) {
          categoryStats[categoryId] = {
            total: 0,
            completed: 0
          }
        }
        categoryStats[categoryId].total++
        if (task.completed) {
          categoryStats[categoryId].completed++
        }
      })

      return categoryStats
    } catch (error) {
      console.error("Error fetching category stats:", error)
      toast.error("Failed to load category statistics")
      return {}
    }
  }

  async getWeeklyProgress() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "completed" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: ["true"]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      const tasks = response.data || []
      const weeklyData = []
      const today = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        
        const completed = tasks.filter(t => {
          if (!t.completed || !t.updated_at) return false
          const taskDate = new Date(t.updated_at)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate.getTime() === date.getTime()
        }).length
        
        weeklyData.push({
          date: date.toISOString().split('T')[0],
          completed,
          day: date.toLocaleDateString('en-US', { weekday: 'short' })
        })
      }
      
      return weeklyData
    } catch (error) {
      console.error("Error fetching weekly progress:", error)
      toast.error("Failed to load weekly progress")
      return []
    }
  }
}

export default new StatsService()