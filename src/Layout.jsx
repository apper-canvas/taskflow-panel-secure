import { Outlet, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
  const location = useLocation()
  const { categoryId } = useParams()

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname + (categoryId || '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout