import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StatsCard from '@/components/molecules/StatsCard'
import ProgressRing from '@/components/molecules/ProgressRing'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { statsService } from '@/services'

const ProgressDashboard = ({ className = '' }) => {
  const [stats, setStats] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [userStats, weeklyProgress] = await Promise.all([
        statsService.getUserStats(),
        statsService.getWeeklyProgress()
      ])
      
      setStats(userStats)
      setWeeklyData(weeklyProgress)
    } catch (err) {
      setError(err.message || 'Failed to load statistics')
      toast.error('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <SkeletonLoader count={3} height="h-32" />
        <SkeletonLoader count={1} height="h-48" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadStats}
        className={className}
      />
    )
  }

  if (!stats) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon="CheckSquare"
          color="primary"
        />
        
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon="CheckCircle"
          color="success"
        />
        
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} days`}
          icon="Flame"
          color="warning"
        />
      </div>

      {/* Progress Ring and Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface rounded-lg border border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Overall Progress
          </h3>
          
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={stats.completionRate}
              size={150}
              strokeWidth={12}
              color="#6366F1"
            />
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-400">
              {stats.completedTasks} out of {stats.totalTasks} tasks completed
            </p>
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface rounded-lg border border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Weekly Activity
          </h3>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-gray-400 w-12">{day.day}</span>
                
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((day.completed / 5) * 100, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <span className="text-white font-medium w-8 text-right">
                  {day.completed}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressDashboard