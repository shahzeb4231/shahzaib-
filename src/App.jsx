import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LampLogin from './components/LampLogin.jsx'
import Surprise from './components/Surprise.jsx'

export default function App() {
  const [page, setPage] = useState('login')

  return (
    <AnimatePresence mode="wait">
      {page === 'login' ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LampLogin onSuccess={() => setPage('gift')} />
        </motion.div>
      ) : (
        <motion.div
          key="gift"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Surprise />
        </motion.div>
      )}
    </AnimatePresence>
  )
}