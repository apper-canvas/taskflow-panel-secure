import { toast } from 'react-toastify'

class TaskService {
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

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { Name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to load tasks")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { Name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      }

      const response = await this.apperClient.getRecordById('task', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      return null
    }
  }

  async getByCategory(categoryId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { Name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "category_id",
            Operator: "EqualTo",
            Values: [categoryId]
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks by category:", error)
      toast.error("Failed to load tasks")
      return []
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title || 'New Task',
            title: taskData.title || 'New Task',
            description: taskData.description || '',
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || null,
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category_id: parseInt(taskData.categoryId) || null
          }
        ]
      }

      const response = await this.apperClient.createRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      }

      // Only include updateable fields
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.priority !== undefined) updateData.priority = updates.priority
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.completed !== undefined) updateData.completed = updates.completed
      if (updates.category_id !== undefined) updateData.category_id = parseInt(updates.category_id)
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId)
      
      updateData.updated_at = new Date().toISOString()

      const params = {
        records: [updateData]
      }

      const response = await this.apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return response.results.some(result => result.success)
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  async toggleComplete(id) {
    try {
      // First get current task state
      const currentTask = await this.getById(id)
      if (!currentTask) throw new Error('Task not found')
      
      // Update the completed status
      return await this.update(id, { 
        completed: !currentTask.completed 
      })
    } catch (error) {
      console.error("Error toggling task completion:", error)
      throw error
    }
  }

  async bulkDelete(ids) {
    try {
      const recordIds = ids.map(id => parseInt(id))
      const params = {
        RecordIds: recordIds
      }

      const response = await this.apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return response.results.filter(result => result.success)
      }
    } catch (error) {
      console.error("Error bulk deleting tasks:", error)
      throw error
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { Name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                operator: "OR",
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error searching tasks:", error)
      toast.error("Search failed")
      return []
    }
  }

  async getByFilters(filters) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { Name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }

      // Add category filter
      if (filters.categoryId && filters.categoryId !== 'all') {
        params.where.push({
          FieldName: "category_id",
          Operator: "EqualTo",
          Values: [filters.categoryId]
        })
      }

      // Add priority filter
      if (filters.priority && filters.priority !== 'all') {
        params.where.push({
          FieldName: "priority",
          Operator: "EqualTo",
          Values: [filters.priority]
        })
      }

      // Add completion status filter
      if (filters.completed !== undefined) {
        params.where.push({
          FieldName: "completed",
          Operator: "EqualTo",
          Values: [filters.completed.toString()]
        })
      }

      // Add due date filter
      if (filters.dueDate) {
        const today = new Date().toISOString().split('T')[0]
        
        switch (filters.dueDate) {
          case 'today':
            params.where.push({
              FieldName: "due_date",
              Operator: "EqualTo",
              Values: [today]
            })
            break
          case 'overdue':
            params.where.push({
              FieldName: "due_date",
              Operator: "LessThan",
              Values: [today]
            })
            params.where.push({
              FieldName: "completed",
              Operator: "EqualTo",
              Values: ["false"]
            })
            break
          case 'upcoming':
            params.where.push({
              FieldName: "due_date",
              Operator: "GreaterThan",
              Values: [today]
            })
            break
        }
      }

      const response = await this.apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error filtering tasks:", error)
      toast.error("Failed to filter tasks")
      return []
    }
  }
}

export default new TaskService();