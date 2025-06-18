import { toast } from 'react-toastify'

class CategoryService {
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
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "task_count" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      }

      const response = await this.apperClient.fetchRecords('category', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      // Add the "All Tasks" virtual category
      const allCategories = [
        {
          Id: "all",
          Name: "All Tasks",
          color: "#6366F1",
          icon: "List",
          task_count: 0
        },
        ...(response.data || [])
      ]

      return allCategories
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
      return []
    }
  }

  async getById(id) {
    try {
      // Handle virtual "all" category
      if (id === 'all') {
        return {
          Id: "all",
          Name: "All Tasks",
          color: "#6366F1",
          icon: "List",
          task_count: 0
        }
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "task_count" } }
        ]
      }

      const response = await this.apperClient.getRecordById('category', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      return null
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            Name: categoryData.name || 'New Category',
            color: categoryData.color || '#6366F1',
            icon: categoryData.icon || 'Folder',
            task_count: 0
          }
        ]
      }

      const response = await this.apperClient.createRecord('category', params)
      
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
      console.error("Error creating category:", error)
      throw error
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      }

      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.color !== undefined) updateData.color = updates.color
      if (updates.icon !== undefined) updateData.icon = updates.icon
      if (updates.task_count !== undefined) updateData.task_count = updates.task_count

      const params = {
        records: [updateData]
      }

      const response = await this.apperClient.updateRecord('category', params)
      
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
      console.error("Error updating category:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord('category', params)
      
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
      console.error("Error deleting category:", error)
      throw error
    }
  }

  async updateTaskCount(categoryId, count) {
    try {
      return await this.update(categoryId, { task_count: count })
    } catch (error) {
      console.error("Error updating task count:", error)
      return null
    }
  }
}

export default new CategoryService()