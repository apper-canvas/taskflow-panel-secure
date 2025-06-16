import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AnimatePresence } from 'framer-motion'
import Layout from '@/Layout'
import Dashboard from '@/components/pages/Dashboard'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/category/:categoryId" element={<Dashboard />} />
            </Route>
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-surface border border-gray-700"
          progressClassName="bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </BrowserRouter>
  )
}

export default App