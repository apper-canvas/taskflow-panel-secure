import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast } from 'date-fns'
import { toast } from 'react-toastify'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  onEdit,
  isSelected = false,
  onSelect,
  className = '' 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      const updatedTask = await taskService.toggleComplete(task.id)
      onUpdate?.(updatedTask)
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉', {
          icon: '✅'
        })
      } else {
        toast.info('Task marked as incomplete')
      }
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      await taskService.delete(task.id)
      onDelete?.(task.id)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  const getDueDateStatus = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    if (isPast(dueDate) && !task.completed) {
      return { label: 'Overdue', variant: 'error' }
    }
    if (isToday(dueDate)) {
      return { label: 'Due today', variant: 'warning' }
    }
    return { 
      label: format(dueDate, 'MMM d'), 
      variant: 'default' 
    }
  }

  const dueDateStatus = getDueDateStatus()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-surface rounded-lg border border-gray-700 p-4 transition-all duration-200
        hover:border-gray-600 hover:shadow-lg hover:shadow-primary/5
        ${task.completed ? 'opacity-75' : ''}
        ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 
                className={`
                  font-medium text-white break-words cursor-pointer
                  ${task.completed ? 'line-through text-gray-400' : ''}
                `}
                onClick={() => onEdit?.(task)}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className="mt-1 text-sm text-gray-400 break-words">
                  {task.description}
                </p>
              )}

              {/* Badges */}
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant={task.priority} size="sm" animate>
                  {task.priority}
                </Badge>
                
                {dueDateStatus && (
                  <Badge variant={dueDateStatus.variant} size="sm">
                    <ApperIcon name="Calendar" size={12} className="mr-1" />
                    {dueDateStatus.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {onSelect && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={isSelected ? "CheckSquare" : "Square"}
                  onClick={() => onSelect(task.id)}
                  className="opacity-100"
                />
              )}
              
              <Button
                variant="ghost"
                size="sm"
                icon="Edit"
                onClick={() => onEdit?.(task)}
              />
              
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleDelete}
                loading={isDeleting}
                className="hover:text-error"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion animation */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-surface/90 rounded-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader2" size={24} className="text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TaskCard