import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CategoryCard from '@/components/molecules/CategoryCard'
import StatsCard from '@/components/molecules/StatsCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { categoryService, statsService } from '@/services'

const Sidebar = () => {
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [categoriesData, statsData] = await Promise.all([
        categoryService.getAll(),
        statsService.getUserStats()
      ])
      
      setCategories(categoriesData)
      setStats(statsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load sidebar data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <aside className="w-80 bg-surface border-r border-gray-700 overflow-y-auto p-6 space-y-6 z-40">
        <SkeletonLoader count={4} height="h-16" />
        <SkeletonLoader count={2} height="h-24" />
      </aside>
    )
  }

  if (error) {
    return (
      <aside className="w-80 bg-surface border-r border-gray-700 overflow-y-auto p-6 z-40">
        <ErrorState
          message={error}
          onRetry={loadData}
        />
      </aside>
    )
  }

  return (
    <aside className="w-80 bg-surface border-r border-gray-700 overflow-y-auto p-6 z-40">
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={
                  (!categoryId && category.id === 'all') ||
                  categoryId === category.id
                }
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Today's Progress</h2>
            <div className="space-y-4">
              <StatsCard
                title="Completed Today"
                value={stats.todayCompleted}
                icon="CheckCircle"
                color="success"
              />
              
              <StatsCard
                title="Current Streak"
                value={`${stats.streak} days`}
                icon="Flame"
                color="warning"
              />
              
              <StatsCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon="Target"
                color="primary"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar