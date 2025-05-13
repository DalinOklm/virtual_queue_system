"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mx-auto h-8 w-8 border-2 border-teal-500 border-opacity-30 border-t-teal-500 rounded-full"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading super admin dashboard...</p>
      </div>
    </div>
  )
}
