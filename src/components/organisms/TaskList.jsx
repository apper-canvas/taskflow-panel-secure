import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import FilterBar from '@/components/molecules/FilterBar'
import Button from '@/components/atoms/Button'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'

const TaskList = ({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskEdit, 
  onBulkDelete,
  className = '' 
}) => {
  const [selectedTasks, setSelectedTasks] = useState(new Set())
  const [filters, setFilters] = useState({
    priority: 'all',
    dueDate: 'all',
    status: 'all'
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      priority: 'all',
      dueDate: 'all', 
      status: 'all'
    })
  }

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(taskId)) {
        newSelected.delete(taskId)
      } else {
        newSelected.add(taskId)
      }
      return newSelected
    })
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)))
    }
  }

  const handleBulkDelete = async () => {
    const taskIds = Array.from(selectedTasks)
    await onBulkDelete?.(taskIds)
    setSelectedTasks(new Set())
  }

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false
    }
    
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !task.completed) return false
      if (filters.status === 'pending' && task.completed) return false
    }
    
    if (filters.dueDate !== 'all' && filters.dueDate !== 'all') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (!task.dueDate) return false
      
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      
      switch (filters.dueDate) {
        case 'today':
          if (taskDate.getTime() !== today.getTime()) return false
          break
        case 'overdue':
          if (taskDate >= today || task.completed) return false
          break
        case 'upcoming':
          if (taskDate <= today) return false
          break
      }
    }
    
    return true
  })

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Get started by creating your first task"
        actionLabel="Create Task"
        icon="CheckSquare"
        onAction={() => {/* Will be handled by parent */}}
      />
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedTasks.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-primary font-medium">
                  {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-primary hover:text-white"
                >
                  {selectedTasks.size === filteredTasks.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon="Trash2"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Try adjusting your filters or create a new task"
          actionLabel="Clear Filters"
          icon="Filter"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <TaskCard
                  task={task}
                  onUpdate={onTaskUpdate}
                  onDelete={onTaskDelete}
                  onEdit={onTaskEdit}
                  isSelected={selectedTasks.has(task.id)}
                  onSelect={handleSelectTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default TaskList