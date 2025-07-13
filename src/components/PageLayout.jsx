// src/components/PageLayout.jsx
import { motion } from 'framer-motion';

export default function PageLayout({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100"
    >
      <section className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        {title && <h2 className="text-3xl font-semibold mb-6 text-indigo-800">{title}</h2>}
        {children}
      </section>
    </motion.div>
  );
}