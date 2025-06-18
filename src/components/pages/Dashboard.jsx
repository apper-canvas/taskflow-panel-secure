import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import ProgressDashboard from '@/components/organisms/ProgressDashboard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Header from '@/components/organisms/Header'
import { taskService } from '@/services'

const Dashboard = () => {
  const { categoryId } = useParams()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTasks()
  }, [categoryId])

  useEffect(() => {
    handleSearch(searchQuery)
  }, [tasks, searchQuery])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let tasksData
      if (categoryId && categoryId !== 'all') {
        tasksData = await taskService.getByCategory(categoryId)
      } else {
        tasksData = await taskService.getAll()
      }
      
      setTasks(tasksData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredTasks(tasks)
      return
    }

    try {
      const searchResults = await taskService.search(query)
      // Filter search results by category if needed
      const categoryFilteredResults = categoryId && categoryId !== 'all'
        ? searchResults.filter(task => task.categoryId === categoryId)
        : searchResults
      
      setFilteredTasks(categoryFilteredResults)
    } catch (error) {
      toast.error('Search failed')
      setFilteredTasks(tasks)
    }
  }

const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    loadTasks() // Refresh to ensure consistency
  }
  const handleBulkDelete = async (taskIds) => {
    try {
      await taskService.bulkDelete(taskIds)
      setTasks(prev => prev.filter(task => !taskIds.includes(task.id)))
      toast.success(`Deleted ${taskIds.length} task${taskIds.length !== 1 ? 's' : ''}`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }

  const displayTasks = searchQuery ? filteredTasks : tasks

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="flex-shrink-0 p-6 pb-0">
        <Header onSearch={handleSearch} onTaskAdded={handleTaskAdded} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-white font-display">
              {categoryId && categoryId !== 'all' 
                ? `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Tasks`
                : 'All Tasks'
              }
            </h1>
            <p className="text-gray-400 mt-2">
              {searchQuery 
                ? `Showing results for "${searchQuery}"`
                : 'Manage your tasks efficiently and stay productive'
              }
            </p>
          </div>

          {/* Progress Dashboard - only show on main dashboard */}
          {!categoryId && !searchQuery && (
            <ProgressDashboard />
          )}

          {/* Task Management */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              {searchQuery ? 'Search Results' : 'Your Tasks'}
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                <SkeletonLoader count={5} height="h-24" />
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={loadTasks} />
            ) : (
              <TaskList
                tasks={displayTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onBulkDelete={handleBulkDelete}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard